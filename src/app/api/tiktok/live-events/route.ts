import { NextRequest } from "next/server";

export const runtime = "nodejs";

const liveSubscribers = new Map<string, Set<ReadableStreamDefaultController>>();
const activeConnections = new Map<string, any>();
const likeCounts = new Map<string, number>();
let mod: any = null;

// Optional SIGN_API_URL configuration if specified in env
if (process.env.SIGN_API_URL) {
  console.log(`[TikTokWS] Sign server: ${process.env.SIGN_API_URL}`);
}

async function loadMod() {
  if (!mod) mod = await import("tiktok-live-connector");
  return mod;
}

const avatarCache = new Map<string, string>();
let lastFetch = 0;
const FETCH_INTERVAL = 1200;

async function fetchAvatar(uniqueId: string): Promise<string> {
  if (avatarCache.has(uniqueId)) return avatarCache.get(uniqueId)!;

  const now = Date.now();
  const wait = Math.max(0, FETCH_INTERVAL - (now - lastFetch));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastFetch = Date.now();

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`https://tikwm.com/api/user/info?unique_id=${uniqueId}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (data.code === 0 && data.data?.user) {
        const url =
          data.data.user.avatarThumb ||
          data.data.user.avatarMedium ||
          data.data.user.avatarLarger ||
          "";
        if (url) {
          avatarCache.set(uniqueId, url);
          console.log(`[AVATAR] OK @${uniqueId}: ${url.slice(0, 60)}`);
          return url;
        }
      }
      if (data.code === -1) {
        console.log(`[AVATAR] rate-limited @${uniqueId}, retrying...`);
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
    } catch (e: any) {
      console.log(`[AVATAR] error @${uniqueId}:`, e.message);
    }
    break;
  }

  console.log(`[AVATAR] FAILED @${uniqueId}`);
  return "";
}

function sendEvent(username: string, event: any) {
  const subs = liveSubscribers.get(username);
  if (!subs || subs.size === 0) return;
  const data = `data: ${JSON.stringify(event)}\n\n`;
  const encoded = new TextEncoder().encode(data);
  for (const controller of subs) {
    try {
      controller.enqueue(encoded);
    } catch (e) {
      subs.delete(controller);
    }
  }
}

async function connectToLive(username: string) {
  if (activeConnections.has(username)) {
    console.log(`[TikTokWS] Already connected to @${username}, skipping`);
    return;
  }

  const m = await loadMod();
  const { TikTokLiveConnection, WebcastEvent, ControlEvent } = m;

  console.log(`[TikTokWS] Creating connection for @${username}...`);

  const connection = new TikTokLiveConnection(username, {
    processInitialData: true,
    enableRequestPolling: true,
  });

  connection.on(ControlEvent.CONNECTED, () => {
    console.log(`[TikTokWS] Connected to @${username}`);
  });

  connection.on(ControlEvent.DISCONNECTED, () => {
    console.log(`[TikTokWS] Disconnected from @${username}`);
    activeConnections.delete(username);
  });

  connection.on(ControlEvent.ERROR, (err: any) => {
    const errMsg = err?.info || err?.message || String(err);
    console.error(`[TikTokWS] Error @${username}:`, errMsg);
    if (errMsg.includes('Rate Limited') || errMsg.includes('rate_limit')) {
      console.log(`[TikTokWS] Rate limited for @${username}, will retry in 60s...`);
      activeConnections.delete(username);
      setTimeout(() => {
        if (liveSubscribers.get(username)?.size) {
          console.log(`[TikTokWS] Retrying connection for @${username}...`);
          connectToLive(username);
        }
      }, 60000);
    }
  });

  connection.on(WebcastEvent.FOLLOW, async (data: any) => {
    const user = data?.user || data?.data?.user || {};

    const uniqueId = user.uniqueId || user.uid || "";
    const nickname = user.nickname || uniqueId || "New Follower";
    let avatar = user.avatarThumb || user.avatarMedium || user.avatarLarge || "";

    console.log(`[FOLLOW] @${nickname} uid=${uniqueId} eventAvatar=${avatar ? "YES" : "NO"}`);

    if (!avatar && uniqueId) {
      avatar = await fetchAvatar(uniqueId);
    }

    sendEvent(username, {
      type: "follower",
      displayName: nickname,
      avatar,
      uniqueId,
      timestamp: Date.now(),
    });
  });

  connection.on(WebcastEvent.LIKE, async (data: any) => {
    const user = data?.user || data?.data?.user;
    if (!user) return;

    const batchCount = data?.likeCount || data?.count || 1;
    const prevCount = likeCounts.get(username) || 0;
    const newCount = prevCount + batchCount;
    likeCounts.set(username, newCount);

    let avatar = user.avatarThumb || user.avatarMedium || user.avatarLarge || "";
    if (!avatar && user.uniqueId) avatar = await fetchAvatar(user.uniqueId);

    console.log(`[LIKE] @${user.nickname} batch=${batchCount} total=${newCount}`);

    sendEvent(username, {
      type: "like",
      displayName: user.nickname || user.uniqueId || "New Like",
      avatar,
      uniqueId: user.uniqueId || "",
      totalLikes: newCount,
      timestamp: Date.now(),
    });
  });

  connection.on(WebcastEvent.MEMBER, async (data: any) => {
    const user = data?.user || data?.data?.user;
    if (!user) return;

    let avatar = user.avatarThumb || user.avatarMedium || user.avatarLarge || "";
    if (!avatar && user.uniqueId) avatar = await fetchAvatar(user.uniqueId);

    sendEvent(username, {
      type: "member",
      displayName: user.nickname || user.uniqueId || "New Member",
      avatar,
      uniqueId: user.uniqueId || "",
      timestamp: Date.now(),
    });
  });

  connection.on(WebcastEvent.CHAT, async (data: any) => {
    const user = data?.user || data?.data?.user;
    if (!user) return;

    let avatar = user.avatarThumb || user.avatarMedium || user.avatarLarge || "";
    if (!avatar && user.uniqueId) avatar = await fetchAvatar(user.uniqueId);

    sendEvent(username, {
      type: "chat",
      displayName: user.nickname || user.uniqueId || "",
      avatar,
      uniqueId: user.uniqueId || "",
      comment: data?.comment || data?.data?.comment || "",
      timestamp: Date.now(),
    });
  });

  connection.on(WebcastEvent.GIFT, async (data: any) => {
    const user = data?.user || data?.data?.user;
    if (!user) return;

    let avatar = user.avatarThumb || user.avatarMedium || user.avatarLarge || "";
    if (!avatar && user.uniqueId) avatar = await fetchAvatar(user.uniqueId);

    const giftCount = data?.gift?.count || data?.count || 1;
    const giftName = data?.gift?.name || data?.giftName || "Gift";

    console.log(`[GIFT] @${user.nickname} x${giftCount} ${giftName}`);

    sendEvent(username, {
      type: "gift",
      displayName: user.nickname || user.uniqueId || "Gift",
      avatar,
      uniqueId: user.uniqueId || "",
      giftName,
      giftCount,
      timestamp: Date.now(),
    });
  });

  try {
    console.log(`[TikTokWS] Connecting to @${username}...`);
    await connection.connect();
    activeConnections.set(username, connection);
    console.log(`[TikTokWS] Connection established for @${username}`);
  } catch (e: any) {
    console.error(`[TikTokWS] Failed @${username}:`, e?.message || e);
    activeConnections.delete(username);
  }
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("user");
  if (!username) return new Response("User required", { status: 400 });

  const clean = username.replace("@", "").trim();

  if (!liveSubscribers.has(clean)) {
    liveSubscribers.set(clean, new Set());
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('data: {"connected": true}\n\n'));
      liveSubscribers.get(clean)!.add(controller);
      connectToLive(clean);

      request.signal.addEventListener("abort", () => {
        liveSubscribers.get(clean)?.delete(controller);
        try {
          controller.close();
        } catch (e) {}
        if (liveSubscribers.get(clean)?.size === 0) {
          const conn = activeConnections.get(clean);
          if (conn) {
            console.log(`[TikTokWS] No more subscribers for @${clean}, disconnecting`);
            conn.disconnect?.();
            activeConnections.delete(clean);
          }
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
