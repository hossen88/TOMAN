import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  const cleanUsername = username.replace("@", "").trim();

  try {
    const res = await fetch(`https://tikwm.com/api/user/info?unique_id=${cleanUsername}`, {
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await res.json();

    if (data.code === 0 && data.data?.user) {
      const user = data.data.user;
      const stats = data.data.stats;

      return NextResponse.json({
        username: cleanUsername,
        displayName: user.nickname || cleanUsername,
        avatar: user.avatarLarger || user.avatarMedium || user.avatarThumb || "",
        followers: stats?.followerCount || 0,
        following: stats?.followingCount || 0,
        likes: stats?.heartCount || 0,
        videos: stats?.videoCount || 0,
        isVerified: user.verified || false,
        bio: user.signature || "",
        isLive: false,
        bitrate: 3000,
        createTime: user.createTime || 0,
      });
    }

    return NextResponse.json({
      username: cleanUsername,
      displayName: cleanUsername,
      avatar: "",
      followers: 0,
      following: 0,
      likes: 0,
      videos: 0,
      isVerified: false,
      bio: "",
      isLive: false,
      bitrate: 3000,
    });

  } catch (error) {
    console.error("TikTok fetch error:", error);
    return NextResponse.json({
      username: cleanUsername,
      displayName: cleanUsername,
      avatar: "",
      followers: 0,
      following: 0,
      likes: 0,
      videos: 0,
      isVerified: false,
      bio: "",
      isLive: false,
      bitrate: 3000,
    });
  }
}
