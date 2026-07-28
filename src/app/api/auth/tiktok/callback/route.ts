import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  try {
    const clientId = process.env.TIKTOK_CLIENT_KEY || "";
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET || "";
    const redirectUri = `${request.nextUrl.origin}/api/auth/tiktok/callback`;

    const codeVerifier = request.cookies.get("tiktok_code_verifier")?.value || "";

    const tokenParams: Record<string, string> = {
      client_key: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    };

    if (codeVerifier) {
      tokenParams.code_verifier = codeVerifier;
    }

    const tokenResponse = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(tokenParams),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("TikTok token error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=token_failed", request.url));
    }

    const userResponse = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url,username,follower_count", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    const user = {
      platform: "tiktok",
      username: userData.data?.user?.username || "",
      displayName: userData.data?.user?.display_name || "",
      avatar: userData.data?.user?.avatar_url || "",
      followers: userData.data?.user?.follower_count || 0,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    };

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("toman_user", JSON.stringify(user), {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.error("TikTok auth error:", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }
}
