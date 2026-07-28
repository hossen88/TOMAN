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

      if (!res.ok || userData.error) {
        setError(userData.error || "حساب TikTok هذا غير موجود. يرجى التأكد من اسم الحساب.");
        setLoading(false);
        return;
      }

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
      setError("تعذر الاتصال بالحساب. يرجى التأكد من اليوزر وتكرار المحاولة.");
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

      if (!res.ok || userData.error) {
        setError(userData.error || "حساب Kick هذا غير موجود. يرجى التأكد من اسم القناة.");
        setLoading(false);
        return;
      }

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
      setError("تعذر الاتصال بالحساب. يرجى التأكد من اليوزر وتكرار المحاولة.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative" }}>
      {/* Background ambient glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(circle, rgba(232, 21, 72, 0.15) 0%, transparent 70%)", filter: "blur(90px)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "480px", position: "relative", zIndex: 1 }}>
        {/* Header Branding */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "16px" }}>
            <div style={{ position: "relative", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: "-4px", borderRadius: "12px", background: "radial-gradient(circle, rgba(232,21,72,0.6) 0%, transparent 70%)", filter: "blur(6px)" }} />
              <img src="/logo.png" alt="TOMAN Logo" style={{ width: "38px", height: "38px", objectFit: "contain", position: "relative", zIndex: 1 }} />
            </div>
            <span style={{ fontSize: "26px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
              TOMAN<span style={{ color: "#e81548" }}>.</span>
            </span>
          </Link>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", marginBottom: "8px" }}>ربط حساب البث المباشر</h1>
          <p style={{ fontSize: "15px", color: "#94a3b8" }}>أدخل اسم المستخدِم (اليوزر) للبدء في تشغيل البوت والأدوات</p>
        </div>

        {/* Step Choose */}
        {step === "choose" && (
          <div className="glass-card" style={{ padding: "32px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <button
              onClick={() => setStep("tiktok")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(232, 21, 72, 0.5)";
                e.currentTarget.style.backgroundColor = "rgba(232, 21, 72, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff2a5b">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.01a4.85 4.85 0 0 1-3.84-1.77" />
                </svg>
                <span>ربط حساب TikTok LIVE</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>

            <button
              onClick={() => setStep("kick")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(83, 252, 24, 0.5)";
                e.currentTarget.style.backgroundColor = "rgba(83, 252, 24, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="4" fill="#53FC18" />
                  <text x="12" y="15" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">K</text>
                </svg>
                <span>ربط حساب Kick</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        )}

        {/* Step TikTok Input */}
        {step === "tiktok" && (
          <div>
            <button
              onClick={() => { setStep("choose"); setError(""); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "16px",
                backgroundColor: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
              <span>الرجوع لاختيار المنصة</span>
            </button>

            <div className="glass-card" style={{ padding: "32px 28px", borderRadius: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(232, 21, 72, 0.12)", border: "1px solid rgba(232, 21, 72, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff2a5b">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.01a4.85 4.85 0 0 1-3.84-1.77" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#ffffff" }}>TikTok LIVE</h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>أدخل اليوزر الخاص بك بدون مسافات</p>
                </div>
              </div>

              {/* Input and Button Container */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#ff3b68", fontSize: "16px", fontWeight: "800" }}>@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={tiktokUsername}
                    onChange={(e) => { setTiktokUsername(e.target.value.replace("@", "")); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleConnectTikTok()}
                    style={{
                      width: "100%",
                      height: "52px",
                      padding: "0 16px 0 44px",
                      backgroundColor: "rgba(10, 10, 16, 0.9)",
                      border: error ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: "600",
                      outline: "none",
                      direction: "ltr",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s ease",
                    }}
                  />
                </div>

                {error && <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: "600", margin: "0" }}>{error}</p>}

                <button
                  onClick={handleConnectTikTok}
                  disabled={!tiktokUsername.trim() || loading}
                  className="gradient-btn-crimson"
                  style={{
                    width: "100%",
                    height: "52px",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: "800",
                    border: "none",
                    cursor: tiktokUsername.trim() && !loading ? "pointer" : "not-allowed",
                    opacity: tiktokUsername.trim() && !loading ? 1 : 0.6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    boxShadow: tiktokUsername.trim() && !loading ? "0 6px 20px rgba(232, 21, 72, 0.4)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "جاري الاتصال والتحقق..." : "تأكيد وربط الحساب"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step Kick Input */}
        {step === "kick" && (
          <div>
            <button
              onClick={() => { setStep("choose"); setError(""); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "16px",
                backgroundColor: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
              <span>الرجوع لاختيار المنصة</span>
            </button>

            <div className="glass-card" style={{ padding: "32px 28px", borderRadius: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(83, 252, 24, 0.12)", border: "1px solid rgba(83, 252, 24, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="4" fill="#53FC18" />
                    <text x="12" y="15" fill="#000" fontSize="10" fontWeight="900" textAnchor="middle">K</text>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#ffffff" }}>Kick Live</h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>أدخل اليوزر الخاص بك في منصة Kick</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#53FC18", fontSize: "16px", fontWeight: "800" }}>@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={kickUsername}
                    onChange={(e) => { setKickUsername(e.target.value.replace("@", "")); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleConnectKick()}
                    style={{
                      width: "100%",
                      height: "52px",
                      padding: "0 16px 0 44px",
                      backgroundColor: "rgba(10, 10, 16, 0.9)",
                      border: error ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: "600",
                      outline: "none",
                      direction: "ltr",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s ease",
                    }}
                  />
                </div>

                {error && <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: "600", margin: "0" }}>{error}</p>}

                <button
                  onClick={handleConnectKick}
                  disabled={!kickUsername.trim() || loading}
                  className="gradient-btn-crimson"
                  style={{
                    width: "100%",
                    height: "52px",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "15px",
                    fontWeight: "800",
                    border: "none",
                    cursor: kickUsername.trim() && !loading ? "pointer" : "not-allowed",
                    opacity: kickUsername.trim() && !loading ? 1 : 0.6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "جاري الاتصال والتحقق..." : "تأكيد وربط الحساب"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600", textDecoration: "none" }}>
            الرجوع للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

