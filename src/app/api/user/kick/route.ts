import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    const cleanUsername = username.replace("@", "");

    const channelRes = await fetch(`https://kick.com/api/v2/channels/${cleanUsername}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      },
    });

    if (!channelRes.ok) {
      throw new Error("Channel not found");
    }

    const data = await channelRes.json();

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
    return NextResponse.json({
      username: username.replace("@", ""),
      displayName: username.replace("@", ""),
      avatar: "",
      followers: 0,
      following: 0,
      likes: 0,
      videos: 0,
      isVerified: false,
      bio: "",
      isLive: false,
      streamTitle: "",
      viewerCount: 0,
      bitrate: 0,
      streamCategory: "",
      totalStreamTime: 0,
    });
  }
}
