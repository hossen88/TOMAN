import { NextRequest } from "next/server";

const liveSubscribers = new Map<string, Set<ReadableStreamDefaultController>>();
const lastFollowers = new Map<string, number>();
const lastLikes = new Map<string, number>();

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

      if (!liveSubscribers.has(cleanUsername)) {
        liveSubscribers.set(cleanUsername, new Set());
      }
      liveSubscribers.get(cleanUsername)!.add(controller);

      const checkForEvents = async () => {
        try {
          const res = await fetch(`https://tikwm.com/api/user/info?unique_id=${cleanUsername}`, {
            headers: { "Accept": "application/json" },
          });
          const data = await res.json();

          if (data.code === 0 && data.data) {
            const stats = data.data.stats;
            const currentFollowers = stats?.followerCount || 0;
            const currentLikes = stats?.heartCount || 0;

            const prevFollowers = lastFollowers.get(cleanUsername) ?? currentFollowers;
            const prevLikes = lastLikes.get(cleanUsername) ?? currentLikes;

            if (currentFollowers > prevFollowers) {
              const diff = currentFollowers - prevFollowers;
              for (let i = 0; i < diff; i++) {
                sendEvent(cleanUsername, {
                  type: "follower",
                  displayName: "New Follower",
                  avatar: "",
                  timestamp: Date.now(),
                });
              }
            }

            if (currentLikes > prevLikes) {
              const diff = currentLikes - prevLikes;
              for (let i = 0; i < Math.min(diff, 3); i++) {
                sendEvent(cleanUsername, {
                  type: "like",
                  displayName: "New Like",
                  avatar: "",
                  timestamp: Date.now(),
                });
              }
            }

            lastFollowers.set(cleanUsername, currentFollowers);
            lastLikes.set(cleanUsername, currentLikes);
          }
        } catch (e) {}
      };

      const interval = setInterval(checkForEvents, 1000);
      checkForEvents();

      request.signal.addEventListener("abort", () => {
        liveSubscribers.get(cleanUsername)?.delete(controller);
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

function sendEvent(username: string, event: any) {
  const subs = liveSubscribers.get(username);
  if (subs) {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    for (const controller of subs) {
      try {
        controller.enqueue(new TextEncoder().encode(data));
      } catch (e) {
        subs.delete(controller);
      }
    }
  }
}

export { sendEvent };
