"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [tiktokUsername, setTiktokUsername] = useState("");
  const [kickUsername, setKickUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"choose" | "tiktok" | "kick">("choose");
  const [error, setError] = useState("");

  const handleConnectTikTok = async () => {
    if (!tiktokUsername.trim()) return;
    setLoading(true);
    setError("");

    const cleanUsername = tiktokUsername.replace("@", "").trim();

    try {
      const res = await fetch(`/api/user/tiktok?username=${cleanUsername}`);
      const userData = await res.json();

      const user = {
        platform: "tiktok" as const,
        username: userData.username || cleanUsername,
        displayName: userData.displayName || cleanUsername,
        avatar: userData.avatar || "",
        followers: userData.followers || 0,
        following: userData.following || 0,
        likes: userData.likes || 0,
        videos: userData.videos || 0,
        isVerified: userData.isVerified || false,
        bio: userData.bio || "",
        isLive: userData.isLive || false,
        bitrate: userData.bitrate || 3000,
        accessToken: "connected",
        refreshToken: "",
      };

      localStorage.setItem("toman_user", JSON.stringify(user));
      window.location.href = "/dashboard";
    } catch {
      setError("Failed to connect. Please try again.");
      setLoading(false);
    }
  };

  const handleConnectKick = async () => {
    if (!kickUsername.trim()) return;
    setLoading(true);
    setError("");

    const cleanUsername = kickUsername.replace("@", "").trim();

    try {
      const res = await fetch(`/api/user/kick?username=${cleanUsername}`);
      const userData = await res.json();

      const user = {
        platform: "kick" as const,
        username: userData.username || cleanUsername,
        displayName: userData.displayName || cleanUsername,
        avatar: userData.avatar || "",
        followers: userData.followers || 0,
        following: userData.following || 0,
        likes: userData.likes || 0,
        videos: userData.videos || 0,
        isVerified: userData.isVerified || false,
        bio: userData.bio || "",
        isLive: userData.isLive || false,
        streamTitle: userData.streamTitle || "",
        viewerCount: userData.viewerCount || 0,
        bitrate: userData.bitrate || 0,
        streamCategory: userData.streamCategory || "",
        totalStreamTime: userData.totalStreamTime || 0,
        accessToken: "connected",
        refreshToken: "",
      };

      localStorage.setItem("toman_user", JSON.stringify(user));
      window.location.href = "/dashboard";
    } catch {
      setError("Failed to connect. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontSize: "28px", fontWeight: "800", textDecoration: "none", marginBottom: "16px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #a51538, #d4213d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span style={{ color: "#fff" }}>TOMAN</span>
          </Link>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#ffffff", marginBottom: "8px" }}>Connect Your Account</h1>
          <p style={{ fontSize: "15px", color: "#666" }}>Enter your username to get started</p>
        </div>

        {step === "choose" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <button onClick={() => setStep("tiktok")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", padding: "18px 24px", backgroundColor: "#111", border: "1px solid #262626", borderRadius: "14px", color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.01a4.85 4.85 0 0 1-3.84-1.77" />
              </svg>
              Connect TikTok Account
            </button>

            <button onClick={() => setStep("kick")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", padding: "18px 24px", backgroundColor: "#111", border: "1px solid #262626", borderRadius: "14px", color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="2" fill="#53FC18" />
                <text x="12" y="15" fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">K</text>
              </svg>
              Connect Kick Account
            </button>
          </div>
        )}

        {step === "tiktok" && (
          <div>
            <button onClick={() => { setStep("choose"); setError(""); }} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px", padding: "0", backgroundColor: "transparent", border: "none", color: "#666", fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              Back
            </button>

            <div style={{ padding: "24px", backgroundColor: "#111", border: "1px solid #262626", borderRadius: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.01a4.85 4.85 0 0 1-3.84-1.77" />
                </svg>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>TikTok</h3>
                  <p style={{ fontSize: "13px", color: "#666" }}>Enter your TikTok username</p>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: "16px", fontWeight: "600" }}>@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={tiktokUsername}
                  onChange={(e) => { setTiktokUsername(e.target.value.replace("@", "")); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleConnectTikTok()}
                  style={{ width: "100%", padding: "14px 14px 14px 36px", backgroundColor: "#1a1a1a", border: error ? "1px solid #a51538" : "1px solid #333", borderRadius: "12px", color: "#fff", fontSize: "16px", outline: "none", fontFamily: "inherit" }}
                />
              </div>

              {error && <p style={{ marginTop: "10px", fontSize: "13px", color: "#a51538" }}>{error}</p>}

              <button
                onClick={handleConnectTikTok}
                disabled={!tiktokUsername.trim() || loading}
                style={{ width: "100%", padding: "14px", marginTop: "16px", backgroundColor: tiktokUsername.trim() ? "#a51538" : "#333", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: tiktokUsername.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s" }}
              >
                {loading ? "Connecting..." : "Connect Account"}
              </button>
            </div>
          </div>
        )}

        {step === "kick" && (
          <div>
            <button onClick={() => { setStep("choose"); setError(""); }} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px", padding: "0", backgroundColor: "transparent", border: "none", color: "#666", fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              Back
            </button>

            <div style={{ padding: "24px", backgroundColor: "#111", border: "1px solid #262626", borderRadius: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" fill="#53FC18" />
                  <text x="12" y="15" fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">K</text>
                </svg>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>Kick</h3>
                  <p style={{ fontSize: "13px", color: "#666" }}>Enter your Kick username</p>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: "16px", fontWeight: "600" }}>@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={kickUsername}
                  onChange={(e) => { setKickUsername(e.target.value.replace("@", "")); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleConnectKick()}
                  style={{ width: "100%", padding: "14px 14px 14px 36px", backgroundColor: "#1a1a1a", border: error ? "1px solid #a51538" : "1px solid #333", borderRadius: "12px", color: "#fff", fontSize: "16px", outline: "none", fontFamily: "inherit" }}
                />
              </div>

              {error && <p style={{ marginTop: "10px", fontSize: "13px", color: "#a51538" }}>{error}</p>}

              <button
                onClick={handleConnectKick}
                disabled={!kickUsername.trim() || loading}
                style={{ width: "100%", padding: "14px", marginTop: "16px", backgroundColor: kickUsername.trim() ? "#a51538" : "#333", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: kickUsername.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s" }}
              >
                {loading ? "Connecting..." : "Connect Account"}
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
