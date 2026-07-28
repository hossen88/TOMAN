"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/i18n/auth";
import Link from "next/link";
import { SoundAlertIcon, TTSIcon, OverlayIcon, ChatbotIcon, SongIcon, PointsIcon, BoltIcon, GameIcon, MonitorIcon, StreamIcon, TikTokIcon, WidgetIcon } from "@/components/Icons";

interface User {
  platform: "tiktok" | "kick";
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  isVerified: boolean;
  bio: string;
  isLive: boolean;
  bitrate: number;
  streamTitle?: string;
  viewerCount?: number;
  streamCategory?: string;
  totalStreamTime?: number;
  accessToken: string;
  refreshToken: string;
}

export default function DashboardContent() {
  const { user, setUser, logout } = useAuth();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userParam = searchParams.get("user");
    if (userParam) {
      try {
        const parsedUser: User = JSON.parse(userParam);
        setUser(parsedUser);
        window.history.replaceState({}, "", "/dashboard");
      } catch {}
    }
  }, [searchParams, setUser]);

  if (!mounted) return null;

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", marginBottom: "16px" }}>Not Connected</h1>
          <p style={{ color: "#888", marginBottom: "24px" }}>Connect your account to access the dashboard</p>
          <Link href="/login" style={{ display: "inline-block", padding: "14px 32px", backgroundColor: "#a51538", color: "#fff", borderRadius: "12px", fontWeight: "700", textDecoration: "none", fontSize: "15px" }}>
            Connect Account
          </Link>
        </div>
      </div>
    );
  }

  const u = user as User;

  const tools = [
    { key: "tiktoklive", icon: <TikTokIcon size={28} color="#a51538" />, title: "TikTok Live", subtitle: "Monitor your TikTok live stream" },
    { key: "widgets", icon: <WidgetIcon size={28} color="#a51538" />, title: "Widgets", subtitle: "Beautiful stream overlays" },
    { key: "alerts", icon: <SoundAlertIcon size={28} color="#a51538" />, title: "Alerts", subtitle: "Follower, Sub, Donation alerts" },
    { key: "monitor", icon: <MonitorIcon size={28} color="#a51538" />, title: "Stream Monitor", subtitle: "Real-time health monitoring" },
    { key: "streaming", icon: <StreamIcon size={28} color="#a51538" />, title: "Streaming Apps", subtitle: "Connect OBS, Streamlabs, etc." },
    { key: "tts", icon: <TTSIcon size={28} color="#a51538" />, title: "Text-to-Speech", subtitle: "Read chat messages aloud" },
    { key: "overlays", icon: <OverlayIcon size={28} color="#a51538" />, title: "Overlays", subtitle: "Custom stream overlays" },
    { key: "chatbot", icon: <ChatbotIcon size={28} color="#a51538" />, title: "Chatbot", subtitle: "Auto replies & commands" },
    { key: "songrequests", icon: <SongIcon size={28} color="#a51538" />, title: "Song Requests", subtitle: "Let viewers request songs" },
    { key: "points", icon: <PointsIcon size={28} color="#a51538" />, title: "Points System", subtitle: "Reward loyal viewers" },
    { key: "actions", icon: <BoltIcon size={28} color="#a51538" />, title: "Actions & Events", subtitle: "Trigger actions on events" },
    { key: "game", icon: <GameIcon size={28} color="#a51538" />, title: "Game Integration", subtitle: "Connect with games" },
  ];

  const stats = [
    { label: "Followers", value: u.followers?.toLocaleString() || "0" },
    { label: "Following", value: u.following?.toLocaleString() || "0" },
    { label: "Likes", value: u.likes?.toLocaleString() || "0" },
    { label: "Videos", value: u.videos?.toLocaleString() || "0" },
    { label: "Bitrate", value: `${u.bitrate || 0} kbps` },
    { label: "Status", value: u.isLive ? "LIVE" : "Offline", color: u.isLive ? "#4ade80" : "#666" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Profile Header */}
        <div style={{ padding: "32px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "20px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "20px", backgroundColor: "#222", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px solid #333" }}>
                {u.avatar ? (
                  <img src={u.avatar} alt={u.displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "32px", fontWeight: "800", color: "#a51538" }}>{u.displayName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#ffffff" }}>{u.displayName}</h1>
                  {u.isVerified && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#a51538">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                  {u.isLive && (
                    <span style={{ padding: "3px 10px", backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444", borderRadius: "6px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}>LIVE</span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: u.platform === "tiktok" ? "#fff" : "#53FC18", backgroundColor: u.platform === "tiktok" ? "#1a1a1a" : "rgba(83, 252, 24, 0.1)", padding: "3px 10px", borderRadius: "6px", textTransform: "uppercase" }}>
                    {u.platform}
                  </span>
                  <span style={{ fontSize: "14px", color: "#888" }}>@{u.username}</span>
                </div>
                {u.bio && <p style={{ marginTop: "8px", fontSize: "13px", color: "#666", maxWidth: "400px" }}>{u.bio}</p>}
              </div>
            </div>
            <button onClick={logout} style={{ padding: "10px 20px", backgroundColor: "transparent", border: "1px solid #333", borderRadius: "10px", color: "#888", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
              Sign Out
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #222" }}>
            {stats.map((stat) => (
              <div key={stat.label} style={{ padding: "16px", backgroundColor: "#161616", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: stat.color || "#ffffff" }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px", fontWeight: "500" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>Your Tools</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {tools.map((tool) => (
              <div
                key={tool.key}
                onClick={() => {
                  if (tool.key === "tiktoklive") window.location.href = "/tiktok-live";
                  else if (tool.key === "widgets") window.location.href = "/widgets";
                  else if (tool.key === "alerts") window.location.href = "/alerts/settings";
                  else if (tool.key === "monitor") window.location.href = "/monitor";
                  else if (tool.key === "streaming") window.location.href = "/streaming";
                  else if (tool.key === "chatbot") window.location.href = "/chatbot";
                  else if (tool.key === "songrequests") window.location.href = "/songrequests";
                  else if (tool.key === "tts") window.location.href = "/tts";
                  else if (tool.key === "overlays") window.location.href = "/overlays";
                  else if (tool.key === "points") window.location.href = "/points";
                  else if (tool.key === "actions") window.location.href = "/actions";
                  else if (tool.key === "game") window.location.href = "/game";
                }}
                style={{ padding: "24px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "16px", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(165, 21, 56, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {tool.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginBottom: "2px" }}>{tool.title}</h3>
                  {tool.subtitle && <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>{tool.subtitle}</p>}
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
