import { NextRequest } from "next/server";

const g = globalThis as any;
if (!g._alertSubscribers) g._alertSubscribers = new Map<string, Set<ReadableStreamDefaultController>>();
const subscribers: Map<string, Set<ReadableStreamDefaultController>> = g._alertSubscribers;

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("user");
  if (!username) {
    return new Response("User required", { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode("data: {\"connected\": true}\n\n"));

      if (!subscribers.has(username)) subscribers.set(username, new Set());
      subscribers.get(username)!.add(controller);

      request.signal.addEventListener("abort", () => {
        subscribers.get(username)?.delete(controller);
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
