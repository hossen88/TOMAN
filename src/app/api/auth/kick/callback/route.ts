import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  try {
    const clientId = process.env.KICK_CLIENT_ID || "";
    const clientSecret = process.env.KICK_CLIENT_SECRET || "";
    const redirectUri = `${request.nextUrl.origin}/api/auth/kick/callback`;

    const tokenResponse = await fetch("https://kick.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Kick token error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=token_failed", request.url));
    }

    const userResponse = await fetch("https://kick.com/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });

    const userData = await userResponse.json();

    const user = {
      platform: "kick",
      username: userData.username || "",
      displayName: userData.user?.username || userData.username || "",
      avatar: userData.profile_pic || "",
      followers: userData.follower_count || 0,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    };

    const redirectUrl = new URL("/dashboard", request.url);
    redirectUrl.searchParams.set("user", JSON.stringify(user));
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error("Kick auth error:", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }
}
