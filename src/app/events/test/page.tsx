"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

const demoNames = ["أحمد", "سارة", "عمر", "ليلى", "يوسف", "نور", "علي", "فاطمة", "محمد", "خالد", "ريم", "حسن"];

export default function TestEventsPage() {
  const [username, setUsername] = useState("");
  const [duration, setDuration] = useState(5);
  const [color, setColor] = useState("#a855f7");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("toman_user");
    if (savedUser) { try { const u = JSON.parse(savedUser); if (u.username) setUsername(u.username); } catch (e) {} }
    const saved = localStorage.getItem("username");
    if (saved && !username) setUsername(saved);
    const savedDuration = localStorage.getItem("eventTestDuration");
    if (savedDuration) setDuration(parseInt(savedDuration));
    const savedColor = localStorage.getItem("eventTestColor");
    if (savedColor) setColor(savedColor);
  }, []);

  const updateUsername = (v: string) => {
    setUsername(v);
    localStorage.setItem("username", v);
  };

  const updateDuration = (v: number) => {
    setDuration(v);
    localStorage.setItem("eventTestDuration", String(v));
  };

  const updateColor = (v: string) => {
    setColor(v);
    localStorage.setItem("eventTestColor", v);
  };

  const triggerWidget = async (widgetId: string) => {
    await fetch("/api/widgets/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widget: widgetId, demo: true, duration }),
    });
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "40px 20px", fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "24px" }}>Test Widgets</h1>

        <div style={{ marginBottom: "20px", padding: "16px", background: "#111", border: "1px solid #222", borderRadius: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "6px" }}>Your TikTok Username</label>
          <input value={username} onChange={(e) => updateUsername(e.target.value)} placeholder="e.g. _00DV" style={{ width: "100%", padding: "12px 16px", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", color: "#fff", fontSize: "15px", outline: "none" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div style={{ padding: "16px", background: "#111", border: "1px solid #222", borderRadius: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "6px" }}>Duration (seconds)</label>
            <input type="number" value={duration} onChange={(e) => updateDuration(parseInt(e.target.value))} style={{ width: "100%", padding: "12px 16px", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", color: "#fff", fontSize: "15px", outline: "none" }} />
          </div>
          <div style={{ padding: "16px", background: "#111", border: "1px solid #222", borderRadius: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "6px" }}>Color</label>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              {["#a855f7", "#ec4899", "#f59e0b", "#a51538", "#4ade80", "#3b82f6"].map(c => (
                <button key={c} onClick={() => updateColor(c)} style={{ width: "30px", height: "30px", borderRadius: "50%", background: c, border: color === c ? "3px solid #fff" : "2px solid #444", cursor: "pointer", padding: 0 }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px", padding: "16px", background: "#111", border: "1px solid #222", borderRadius: "14px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>Widget URLs (add in OBS)</h3>
          <div style={{ display: "grid", gap: "8px" }}>
            {[
              { name: "New Follower", path: "/overlay/widgets/followers" },
              { name: "New Like", path: "/overlay/widgets/likes" },
              { name: "Top 3", path: "/overlay/widgets/top-rankers" },
              { name: "Total Followers", path: "/overlay/widgets/total-followers" },
            ].map(w => (
              <div key={w.name} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#aaa", width: "100px" }}>{w.name}</span>
                <input readOnly value={`${w.path}?user=${username || "YOUR"}&color=${encodeURIComponent(color)}&duration=${duration}`} style={{ flex: 1, padding: "8px 12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color, fontSize: "11px", fontFamily: "monospace" }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <button onClick={() => triggerWidget("followers")} style={{ padding: "16px", background: "#a855f7", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
            ▶ Test Follower
          </button>
          <button onClick={() => triggerWidget("likes")} style={{ padding: "16px", background: "#ec4899", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
            ▶ Test Like
          </button>
          <button onClick={() => triggerWidget("top-rankers")} style={{ padding: "16px", background: "#f59e0b", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
            ▶ Test Top 3
          </button>
          <button onClick={() => triggerWidget("total-followers")} style={{ padding: "16px", background: "#a51538", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
            ▶ Test Total
          </button>
        </div>

        {sent && (
          <div style={{ marginTop: "16px", padding: "14px", background: "#1a5c1a", border: "1px solid #27ae60", borderRadius: "12px", color: "#27ae60", textAlign: "center", fontWeight: "600" }}>
            ✓ Widget Triggered!
          </div>
        )}
      </div>
    </div>
  );
}
