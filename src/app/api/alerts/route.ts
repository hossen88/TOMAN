import { NextRequest, NextResponse } from "next/server";

const g = globalThis as any;
if (!g._alertSubscribers) g._alertSubscribers = new Map<string, Set<ReadableStreamDefaultController>>();
const subscribers: Map<string, Set<ReadableStreamDefaultController>> = g._alertSubscribers;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, type, alertUsername, message, amount } = body;

  if (!username || !type || !alertUsername) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const alert = {
    type,
    username: alertUsername,
    message: message || "",
    amount: amount || 0,
    timestamp: Date.now(),
  };

  const subs = subscribers.get(username);
  if (subs) {
    const data = `data: ${JSON.stringify(alert)}\n\n`;
    for (const controller of subs) {
      try {
        controller.enqueue(new TextEncoder().encode(data));
      } catch (e) {
        subs.delete(controller);
      }
    }
  }

  return NextResponse.json({ success: true });
}
