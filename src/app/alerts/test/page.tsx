"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";

const alertTypes = [
  { type: "like", labelAr: "\u0625\u0639\u062C\u0627\u0628\u0627\u062A", label: "New Like", color: "#ef4444" },
  { type: "donation", labelAr: "\u062A\u0628\u0631\u0639\u0627\u062A", label: "Donation", color: "#10b981" },
];

function AlertIcon({ type, color, size = 24 }: { type: string; color: string; size?: number }) {
  if (type === "donation") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

export default function TestAlertsPage() {
  const [username, setUsername] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("toman_user");
    if (savedUser) { try { const u = JSON.parse(savedUser); if (u.username) setUsername(u.username); } catch (e) {} }
    const saved = localStorage.getItem("username");
    if (saved && !username) setUsername(saved);
  }, []);

  const updateUsername = (v: string) => {
    setUsername(v);
    localStorage.setItem("username", v);
  };

  const sendAlert = async (type: string) => {
    if (!username) return;
    const names = ["Ahmad", "Sara", "Omar", "Layla", "Yusuf", "Noor", "Ali", "Fatima", "Mohammed", "Nora"];
    const randomName = names[Math.floor(Math.random() * names.length)];

    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username, type,
        alertUsername: randomName,
        message: type === "donation" ? "\u0634\u0643\u0631\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u062F\u0639\u0645!" : "",
        amount: type === "donation" ? Math.floor(Math.random() * 50) + 5 : 0,
      }),
    });

    setSent(type);
    setTimeout(() => setSent(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "32px 20px", fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "linear-gradient(135deg, #a51538, #d4174e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0 }}>{"\u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A"}</h1>
            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>{"\u0627\u062E\u062A\u0628\u0631 \u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0642\u0628\u0644 \u0627\u0644\u0628\u062B"}</p>
          </div>
        </div>

        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "6px" }}>{"\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0639\u0644\u0649 \u062A\u064A\u0643 \u062A\u0648\u0643"}</label>
          <input value={username} onChange={(e) => updateUsername(e.target.value)} placeholder="@username"
            style={{ width: "100%", padding: "12px 16px", background: "#111", border: "1px solid #222", borderRadius: "10px", color: "#fff", fontSize: "15px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>

        {username && (
          <div style={{ marginBottom: "20px", padding: "16px", background: "#111", border: "1px solid #222", borderRadius: "12px" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>{"\u0631\u0627\u0628\u0637 \u0627\u0644\u0648\u064A\u062C\u062A \u0641\u064A OBS:"}</div>
            <div style={{ display: "flex", gap: "6px" }}>
              <code style={{ flex: 1, padding: "8px 10px", background: "#1a1a1a", borderRadius: "6px", color: "#a51538", fontSize: "11px", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {`${typeof window !== "undefined" ? window.location.origin : ""}/overlay/alerts?user=`}{username}
              </code>
              <button onClick={() => navigator.clipboard.writeText(`${typeof window !== "undefined" ? window.location.origin : ""}/overlay/alerts?user=${username}`)}
                style={{ padding: "8px 12px", background: "#a51538", border: "none", borderRadius: "6px", color: "#fff", fontSize: "11px", fontWeight: "600", cursor: "pointer", flexShrink: 0 }}>
                {"\u0646\u0633\u062E"}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: "10px" }}>
          {alertTypes.map((a) => (
            <button key={a.type} onClick={() => sendAlert(a.type)} disabled={!username}
              style={{
                display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px",
                background: sent === a.type ? `${a.color}20` : "#111",
                border: `1px solid ${sent === a.type ? a.color : "#222"}`,
                borderRadius: "14px", color: username ? "#fff" : "#444",
                fontSize: "15px", fontWeight: "600", cursor: username ? "pointer" : "not-allowed",
                fontFamily: "inherit", transition: "all 0.2s",
              }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: `${a.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <AlertIcon type={a.type} color={a.color} size={20} />
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <div>{a.labelAr}</div>
                <div style={{ fontSize: "11px", color: "#555" }}>{a.label}</div>
              </div>
              {sent === a.type && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
