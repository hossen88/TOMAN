import { NextRequest, NextResponse } from "next/server";

interface TikTokLive {
  isLive: boolean;
  title: string;
  viewerCount: number;
  likeCount: number;
  totalFollowers: number;
  startedAt: number;
  room_id: string;
  stream_url: string;
}

const liveCache = new Map<string, TikTokLive>();
const liveSubscribers = new Map<string, Set<ReadableStreamDefaultController>>();

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("user");
  if (!username) {
    return NextResponse.json({ error: "User required" }, { status: 400 });
  }

  const cleanUsername = username.replace("@", "").trim();

  try {
    const res = await fetch(`https://tikwm.com/api/user/info?unique_id=${cleanUsername}`, {
      headers: { "Accept": "application/json" },
    });
    const data = await res.json();

    if (data.code === 0 && data.data) {
      const user = data.data.user;
      const stats = data.data.stats;

      const liveData: TikTokLive = {
        isLive: user.verifyType === 1 || (user.signature && user.signature.includes("LIVE")),
        title: user.nickname || cleanUsername,
        viewerCount: stats?.followerCount || 0,
        likeCount: stats?.heartCount || 0,
        totalFollowers: stats?.followerCount || 0,
        startedAt: user.createTime || Date.now(),
        room_id: "",
        stream_url: "",
      };

      liveCache.set(cleanUsername, liveData);

      const subs = liveSubscribers.get(cleanUsername);
      if (subs) {
        const sseData = `data: ${JSON.stringify(liveData)}\n\n`;
        for (const controller of subs) {
          try {
            controller.enqueue(new TextEncoder().encode(sseData));
          } catch (e) {
            subs.delete(controller);
          }
        }
      }

      return NextResponse.json(liveData);
    }

    return NextResponse.json({
      isLive: false,
      title: cleanUsername,
      viewerCount: 0,
      likeCount: 0,
      totalFollowers: 0,
      startedAt: 0,
      room_id: "",
      stream_url: "",
    });

  } catch (error) {
    return NextResponse.json({
      isLive: false,
      title: cleanUsername,
      viewerCount: 0,
      likeCount: 0,
      totalFollowers: 0,
      startedAt: 0,
      room_id: "",
      stream_url: "",
    });
  }
}
