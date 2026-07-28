import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("user");
  if (!username) {
    return Response.json({ error: "user required" }, { status: 400 });
  }
  const clean = username.replace("@", "").trim();

  const connected = !!(global as any).__tiktokConnections?.has?.(clean);
  const url = `/api/tiktok/status?user=${clean}`;
  return Response.json({ username: clean, url });
}
