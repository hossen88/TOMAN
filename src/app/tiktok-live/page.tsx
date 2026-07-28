"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

interface TikTokLive {
  isLive: boolean;
  title: string;
  viewerCount: number;
  likeCount: number;
  totalFollowers: number;
  startedAt: number;
}

export default function TikTokLivePage() {
  const [username, setUsername] = useState("");
  const [liveData, setLiveData] = useState<TikTokLive | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamActive, setStreamActive] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    let user = "";
    const savedUser = localStorage.getItem("toman_user");
    if (savedUser) {
      try { const u = JSON.parse(savedUser); if (u.username) user = u.username; } catch (e) {}
    }
    if (!user) {
      const saved = localStorage.getItem("username");
      if (saved) user = saved;
    }
    if (user) {
      setUsername(user);
      checkLiveStatus(user);
    }
  }, []);

  const checkLiveStatus = async (user: string) => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/tiktok/live?user=${user.replace("@", "")}`);
      const data = await res.json();
      setLiveData(data);
      setStreamActive(data.isLive);
    } catch (e) {
      setError("Failed to check live status");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (startedAt: number) => {
    if (!startedAt) return "0h 0m";
    const diff = Math.floor((Date.now() / 1000) - startedAt);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "40px 20px", fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ width: "48px", height: "48px", background: "#000", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.01a4.85 4.85 0 0 1-3.84-1.77" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#fff", margin: 0 }}>TikTok Live</h1>
            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Monitor your TikTok live stream</p>
          </div>
        </div>

        {/* Username Input */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
          <input
            value={username}
            onChange={(e) => { setUsername(e.target.value); localStorage.setItem("username", e.target.value); }}
            placeholder="Enter TikTok username"
            style={{ flex: 1, padding: "16px 20px", backgroundColor: "#111", border: "1px solid #333", borderRadius: "14px", color: "#fff", fontSize: "16px", outline: "none", fontFamily: "inherit" }}
          />
          <button
            onClick={() => { localStorage.setItem("username", username); checkLiveStatus(username); }}
            disabled={!username || loading}
            style={{ padding: "16px 32px", background: "#a51538", border: "none", borderRadius: "14px", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: username && !loading ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: username && !loading ? 1 : 0.5 }}
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </div>

        {error && (
          <div style={{ padding: "16px", background: "#ef444420", border: "1px solid #ef4444", borderRadius: "12px", color: "#ef4444", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        {/* Live Status Card */}
        {liveData && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              padding: "32px",
              background: "#111",
              border: `2px solid ${liveData.isLive ? "#ef4444" : "#222"}`,
              borderRadius: "24px",
              boxShadow: liveData.isLive ? "0 0 40px #ef444430" : "none",
            }}>
              {/* Live Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div style={{
                  padding: "8px 20px",
                  background: liveData.isLive ? "#ef4444" : "#333",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  {liveData.isLive && (
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#fff", animation: "pulse 1s infinite" }} />
                  )}
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff", textTransform: "uppercase" }}>
                    {liveData.isLive ? "LIVE NOW" : "Offline"}
                  </span>
                </div>
                {liveData.isLive && (
                  <span style={{ fontSize: "14px", color: "#888" }}>
                    Duration: {formatDuration(liveData.startedAt)}
                  </span>
                )}
              </div>

              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                <div style={{ padding: "20px", background: "#1a1a1a", borderRadius: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#4ade80" }}>
                    {liveData.totalFollowers.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Total Followers</div>
                </div>
                <div style={{ padding: "20px", background: "#1a1aa1a", borderRadius: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#a51538" }}>
                    {liveData.likeCount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Total Likes</div>
                </div>
                <div style={{ padding: "20px", background: "#1a1a1a", borderRadius: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#f59e0b" }}>
                    {liveData.viewerCount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Viewers</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TikTok Live Setup */}
        <div style={{ padding: "28px", background: "#111", border: "1px solid #222", borderRadius: "20px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "16px" }}>📡 TikTok Live Integration</h2>
          
          <div style={{ display: "grid", gap: "16px" }}>
            {/* Step 1 */}
            <div style={{ padding: "20px", background: "#1a1a1a", borderRadius: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "32px", height: "32px", background: "#a51538", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#fff" }}>1</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>Go Live on TikTok</h3>
              </div>
              <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
                Start your live stream from the TikTok app. The system will automatically detect when you go live.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ padding: "20px", background: "#1a1a1a", borderRadius: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "32px", height: "32px", background: "#a51538", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#fff" }}>2</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>Add Browser Source in OBS</h3>
              </div>
              <p style={{ fontSize: "14px", color: "#888", marginBottom: "12px" }}>
                Add a Browser Source in OBS with this URL:
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  readOnly
                  value={`${window.location.origin}/overlay/tiktok-live?user=${username || "YOUR_USERNAME"}`}
                  style={{ flex: 1, padding: "12px 16px", background: "#0a0a0a", border: "1px solid #333", borderRadius: "8px", color: "#a51538", fontSize: "13px", fontFamily: "monospace" }}
                />
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/overlay/tiktok-live?user=${username || "YOUR_USERNAME"}`)}
                  style={{ padding: "12px 20px", background: "#a51538", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ padding: "20px", background: "#1a1a1a", borderRadius: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "32px", height: "32px", background: "#a51538", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#fff" }}>3</div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>Monitor Your Stream</h3>
              </div>
              <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
                The overlay will show your live status, viewer count, and alerts in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          <div style={{ padding: "24px", background: "#111", border: "1px solid #222", borderRadius: "16px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔴</div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>Live Detection</h3>
            <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>Automatically detects when you go live on TikTok</p>
          </div>
          <div style={{ padding: "24px", background: "#111", border: "1px solid #222", borderRadius: "16px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📊</div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>Real-time Stats</h3>
            <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>Viewers, likes, followers in real-time</p>
          </div>
          <div style={{ padding: "24px", background: "#111", border: "1px solid #222", borderRadius: "16px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔔</div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>Live Alerts</h3>
            <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>Alerts for gifts, comments, and new followers</p>
          </div>
          <div style={{ padding: "24px", background: "#111", border: "1px solid #222", borderRadius: "16px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📺</div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>OBS Overlay</h3>
            <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>Beautiful overlay for your streaming software</p>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}
