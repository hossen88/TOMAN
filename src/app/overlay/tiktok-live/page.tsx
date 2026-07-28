"use client";

import { useEffect, useState } from "react";

interface TikTokLive {
  isLive: boolean;
  title: string;
  viewerCount: number;
  likeCount: number;
  totalFollowers: number;
}

export default function TikTokLiveOverlay() {
  const [live, setLive] = useState<TikTokLive | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    if (!username) return;

    const eventSource = new EventSource(`/api/tiktok/live-stream?user=${username}`);

    eventSource.onopen = () => setConnected(true);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.connected) return;
        setLive(data);
      } catch (e) {}
    };

    eventSource.onerror = () => {
      setConnected(false);
      setTimeout(() => window.location.reload(), 5000);
    };

    return () => eventSource.close();
  }, []);

  if (!connected || !live) {
    return (
      <div style={{ padding: "20px", fontFamily: "'Segoe UI', sans-serif", background: "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 20px", background: "#0a0a0aee", borderRadius: "14px", border: "1px solid #333" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", animation: "pulse 1s infinite" }} />
          <span style={{ color: "#888", fontSize: "14px" }}>Connecting to TikTok...</span>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", fontFamily: "'Segoe UI', sans-serif", background: "transparent" }}>
      <div style={{
        padding: "20px",
        background: "#0a0a0aee",
        border: `2px solid ${live.isLive ? "#ef4444" : "#333"}`,
        borderRadius: "18px",
        boxShadow: live.isLive ? "0 0 30px #ef444430" : "none",
        backdropFilter: "blur(10px)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.01a4.85 4.85 0 0 1-3.84-1.77" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {live.isLive && (
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", animation: "pulse 1s infinite" }} />
              )}
              <span style={{ fontSize: "14px", fontWeight: "700", color: live.isLive ? "#ef4444" : "#666" }}>
                {live.isLive ? "LIVE" : "OFFLINE"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        {live.isLive && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            <div style={{ textAlign: "center", padding: "12px", background: "#111", borderRadius: "10px" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#4ade80" }}>
                {live.viewerCount.toLocaleString()}
              </div>
              <div style={{ fontSize: "10px", color: "#666" }}>Viewers</div>
            </div>
            <div style={{ textAlign: "center", padding: "12px", background: "#111", borderRadius: "10px" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#a51538" }}>
                {live.likeCount.toLocaleString()}
              </div>
              <div style={{ fontSize: "10px", color: "#666" }}>Likes</div>
            </div>
            <div style={{ textAlign: "center", padding: "12px", background: "#111", borderRadius: "10px" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#f59e0b" }}>
                {live.totalFollowers.toLocaleString()}
              </div>
              <div style={{ fontSize: "10px", color: "#666" }}>Followers</div>
            </div>
          </div>
        )}

        {!live.isLive && (
          <div style={{ textAlign: "center", padding: "12px", color: "#666", fontSize: "13px" }}>
            Stream is offline
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}
