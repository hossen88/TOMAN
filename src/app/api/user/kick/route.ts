import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "اسم المستخدم مطلوب" }, { status: 400 });
  }

  try {
    const cleanUsername = username.replace("@", "").trim();

    const channelRes = await fetch(`https://kick.com/api/v2/channels/${cleanUsername}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!channelRes.ok) {
      return NextResponse.json(
        { error: "حساب Kick هذا غير موجود. يرجى التأكد من اسم القناة والمحاولة مجدداً." },
        { status: 404 }
      );
    }

    const data = await channelRes.json();

    if (!data || !data.user) {
      return NextResponse.json(
        { error: "حساب Kick هذا غير موجود. يرجى التأكد من اسم القناة والمحاولة مجدداً." },
        { status: 404 }
      );
    }

    const userInfo = {
      username: cleanUsername,
      displayName: data.user?.username || data.slug || cleanUsername,
      avatar: data.profile_pic || "",
      followers: data.follower_count || 0,
      following: 0,
      likes: 0,
      videos: data.total_videos || 0,
      isVerified: data.verified || false,
      bio: data.user?.bio || "",
      isLive: data.livestream?.is_live || false,
      streamTitle: data.livestream?.session_title || "",
      viewerCount: data.livestream?.viewer_count || 0,
      bitrate: data.livestream?.bitrate || 0,
      streamCategory: data.livestream?.categories?.[0]?.name || "",
      totalStreamTime: data.livestream?.total_view_duration || 0,
    };

    return NextResponse.json(userInfo);

  } catch (error) {
    console.error("Kick fetch error:", error);
    return NextResponse.json(
      { error: "تعذر الاتصال بقناة Kick. يرجى التأكد من اسم الحساب وتكرار المحاولة." },
      { status: 500 }
    );
  }
}

