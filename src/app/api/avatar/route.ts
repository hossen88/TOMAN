import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return new Response("url required", { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/avif,image/jxl,image/heif,image/heif-sequence,image/*;q=0.8,*/*;q=0.5",
        "Referer": "https://www.tiktok.com/",
        "Origin": "https://www.tiktok.com",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      console.log(`[AVATAR_PROXY] ${res.status} for ${url.slice(0, 80)}`);
      return new Response("fetch failed", { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "image/webp";
    const body = await res.arrayBuffer();

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e: any) {
    console.log(`[AVATAR_PROXY] error: ${e.message}`);
    return new Response("error", { status: 500 });
  }
}
