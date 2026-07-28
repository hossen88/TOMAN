import { NextRequest } from "next/server";

const tiktokSubscribers = new Map<string, Set<ReadableStreamDefaultController>>();

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("user");
  if (!username) {
    return new Response("User required", { status: 400 });
  }

  const cleanUsername = username.replace("@", "").trim();

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode("data: {\"connected\": true}\n\n"));

      if (!tiktokSubscribers.has(cleanUsername)) {
        tiktokSubscribers.set(cleanUsername, new Set());
      }
      tiktokSubscribers.get(cleanUsername)!.add(controller);

      const fetchLiveData = async () => {
        try {
          const res = await fetch(`https://tikwm.com/api/user/info?unique_id=${cleanUsername}`, {
            headers: { "Accept": "application/json" },
          });
          const data = await res.json();

          if (data.code === 0 && data.data) {
            const user = data.data.user;
            const stats = data.data.stats;

            const liveData = {
              isLive: user.verifyType === 1,
              title: user.nickname || cleanUsername,
              viewerCount: stats?.followerCount || 0,
              likeCount: stats?.heartCount || 0,
              totalFollowers: stats?.followerCount || 0,
              startedAt: user.createTime || Date.now(),
            };

            const sseData = `data: ${JSON.stringify(liveData)}\n\n`;
            controller.enqueue(encoder.encode(sseData));
          }
        } catch (e) {}
      };

      fetchLiveData();
      const interval = setInterval(fetchLiveData, 10000);

      request.signal.addEventListener("abort", () => {
        tiktokSubscribers.get(cleanUsername)?.delete(controller);
        clearInterval(interval);
        try { controller.close(); } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
