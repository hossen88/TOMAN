import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const cache = new Map<string, string>();

export async function GET(request: NextRequest) {
  const uniqueId = request.nextUrl.searchParams.get("id");
  if (!uniqueId) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const cached = cache.get(uniqueId);
  if (cached) {
    return NextResponse.json({ avatar: cached });
  }

  try {
    const res = await fetch(`https://tikwm.com/api/user/info?unique_id=${uniqueId}`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    if (data.code === 0 && data.data?.user) {
      const url = data.data.user.avatarThumb || data.data.user.avatarMedium || data.data.user.avatarLarger || "";
      if (url) {
        cache.set(uniqueId, url);
        return NextResponse.json({ avatar: url });
      }
    }
  } catch (e) {}

  return NextResponse.json({ avatar: "" });
}
