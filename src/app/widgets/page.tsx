"use client";

import { useState, useEffect } from "react";

const widgets = [
  { id: "followers", title: "المتابعة", desc: "يظهر اسم newest متابع مع صورته", defaultColor: "#a855f7", path: "/overlay-widgets/followers.html" },
  { id: "likes", title: "آخر إعجاب", desc: "يظهر إشعار عند كل إعجاب جديد", defaultColor: "#ec4899", path: "/overlay-widgets/likes.html" },
  { id: "top-rankers", title: "أفضل 3 في البث الحالي", desc: "يعرض أفضل 3 متابعين حسب التفاعل في البث", defaultColor: "#f59e0b", path: "/overlay-widgets/top-rankers.html" },
  { id: "total-followers", title: "إجمالي المتابعين", desc: "يعرض العدد الكلي للمتابعين مع تحديث لحظي", defaultColor: "#a51538", path: "/overlay-widgets/total-followers.html" },
];

const presetColors = ["#a855f7", "#ec4899", "#f59e0b", "#a51538", "#4ade80", "#3b82f6", "#06b6d4", "#f97316", "#ef4444", "#8b5cf6"];

const demoNames = ["أحمد", "سارة", "عمر", "ليلى", "يوسف", "نور", "محمد", "خالد", "ريما", "حسن"];

function WidgetPreview({ id, color }: { id: string; color: string }) {
  const [widgetKey, setWidgetKey] = useState(0);

  useEffect(() => {
    setWidgetKey((k) => k + 1);
  }, [color]);

  if (id === "followers") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0" }}>
        <style>{`
          @keyframes fi-${widgetKey} { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
          @keyframes rp-${widgetKey} { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes shimmer-${widgetKey} { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(400%) skewX(-15deg); } }
        `}</style>
        <div key={widgetKey} style={{
          animation: `fi-${widgetKey} 0.3s ease-out`,
          display: "flex",
          alignItems: "center",
          gap: "0",
          padding: "8px 0",
          background: "rgba(10,10,10,0.92)",
          borderRadius: "30px",
          border: `1px solid ${color}30`,
          boxShadow: `0 0 40px ${color}20`,
          minWidth: "260px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "30px",
            pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute",
              top: "0",
              left: "-100%",
              width: "40%",
              height: "100%",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 70%, transparent 100%)",
              animation: `shimmer-${widgetKey} 3s ease-in-out infinite`,
              pointerEvents: "none",
            }} />
          </div>
          <div style={{ position: "relative", width: "42px", height: "40px", flexShrink: 0, marginLeft: "10px" }}>
            <svg
              style={{ position: "absolute", inset: "-2px", animation: `rp-${widgetKey} 3s linear infinite` }}
              width="44"
              height="44"
              viewBox="0 0 44 44"
            >
              <defs>
                <linearGradient id={`rgp-${widgetKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color} />
                  <stop offset="50%" stopColor="transparent" />
                  <stop offset="100%" stopColor={color} />
                </linearGradient>
              </defs>
              <circle cx="22" cy="22" r="20" fill="none" stroke={`url(#rgp-${widgetKey})`} strokeWidth="2" strokeDasharray="12 6" />
            </svg>
            <div style={{
              position: "absolute",
              left: "2px",
              top: "2px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${color}20, ${color}08)`,
              border: `1.5px solid ${color}50`,
            }} />
            <svg
              style={{
                position: "absolute",
                right: "-4px",
                bottom: "-2px",
                filter: `drop-shadow(0 0 6px ${color}80)`,
              }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div style={{ marginLeft: "10px", marginTop: "-2px" }}>
            <div style={{ fontFamily: "'Designer', sans-serif", fontSize: "10px", color: `${color}cc`, fontWeight: "600", lineHeight: "1", marginTop: "-4px" }}>New Follower!</div>
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#fff", lineHeight: "1", marginTop: "2px" }}>{demoNames[widgetKey % demoNames.length]}</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            fontFamily: "'Stranger', cursive",
            fontSize: "28px",
            fontWeight: "700",
            color: "#fff",
            padding: "0 20px 0 10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            textShadow: `0 0 12px ${color}60`,
            whiteSpace: "nowrap",
          }}>
            Thank you
          </div>
        </div>
      </div>
    );
  }

  if (id === "likes") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0" }}>
        <style>{`
          @keyframes fi-${widgetKey} { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
          @keyframes shimmer-${widgetKey} { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(400%) skewX(-15deg); } }
          @keyframes pulse-heart-${widgetKey} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        `}</style>
        <div key={widgetKey} style={{
          animation: `fi-${widgetKey} 0.3s ease-out`,
          display: "flex",
          alignItems: "center",
          gap: "0",
          padding: "8px 0",
          background: "rgba(10,10,10,0.92)",
          borderRadius: "30px",
          border: `1px solid ${color}30`,
          boxShadow: `0 0 40px ${color}20`,
          minWidth: "260px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "30px",
            pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute",
              top: "0",
              left: "-100%",
              width: "40%",
              height: "100%",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 70%, transparent 100%)",
              animation: `shimmer-${widgetKey} 3s ease-in-out infinite`,
              pointerEvents: "none",
            }} />
          </div>
          <div style={{ position: "relative", width: "42px", height: "40px", flexShrink: 0, marginLeft: "10px" }}>
            <div style={{
              position: "absolute",
              left: "0",
              top: "0",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              overflow: "hidden",
              background: `linear-gradient(135deg, ${color}20, ${color}08)`,
              border: `1.5px solid ${color}50`,
            }} />
            <svg
              style={{
                position: "absolute",
                right: "-4px",
                bottom: "-2px",
                animation: `pulse-heart-${widgetKey} 1.5s ease-in-out infinite`,
                filter: `drop-shadow(0 0 6px ${color}80)`,
              }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={color}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div style={{ marginLeft: "10px", marginTop: "-2px" }}>
            <div style={{ fontFamily: "'Designer', sans-serif", fontSize: "10px", color: `${color}cc`, fontWeight: "600", lineHeight: "1", marginTop: "-4px" }}>New Like!</div>
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#fff", lineHeight: "1", marginTop: "2px" }}>+{Math.floor(Math.random() * 50) + 1}</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            fontFamily: "'Stranger', cursive",
            fontSize: "28px",
            fontWeight: "700",
            color: "#fff",
            padding: "0 20px 0 10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            textShadow: `0 0 12px ${color}60`,
            whiteSpace: "nowrap",
          }}>
            Thank you
          </div>
        </div>
      </div>
    );
  }

  if (id === "top-rankers") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0" }}>
        <style>{`
          @keyframes fi-${widgetKey} { 0% { opacity: 0; transform: scale(0.85) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
          @keyframes pulse-star-${widgetKey} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
          @keyframes shimmer-${widgetKey} { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(400%) skewX(-15deg); } }
        `}</style>
        <div key={widgetKey} style={{
          animation: `fi-${widgetKey} 0.3s ease-out`,
          display: "flex",
          alignItems: "center",
          gap: "0",
          padding: "8px 0",
          background: "rgba(10,10,10,0.92)",
          borderRadius: "30px",
          border: `1px solid ${color}30`,
          boxShadow: `0 0 40px ${color}20`,
          minWidth: "260px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "30px",
            pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute",
              top: "0",
              left: "-100%",
              width: "40%",
              height: "100%",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 70%, transparent 100%)",
              animation: `shimmer-${widgetKey} 3s ease-in-out infinite`,
              pointerEvents: "none",
            }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, marginLeft: "14px", marginTop: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {[1, 0, 2].map((idx) => {
                const names = ["أحمد", "سارة", "عمر"];
                const isFirst = idx === 0;
                return (
                  <div key={idx} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                    {isFirst && (
                      <svg style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", zIndex: 2, filter: `drop-shadow(0 0 4px ${color}80)` }} width="14" height="14" viewBox="0 0 24 24" fill={color}><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z M3 20h18v2H3z" /></svg>
                    )}
                    {!isFirst && (
                      <svg style={{ position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%)", zIndex: 2, animation: `pulse-star-${widgetKey} 1.5s ease-in-out infinite`, filter: `drop-shadow(0 0 4px ${color}80)` }} width="12" height="12" viewBox="0 0 24 24" fill={color}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    )}
                    <div style={{
                      width: isFirst ? "28px" : "24px",
                      height: isFirst ? "28px" : "24px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${color}${isFirst ? "30" : "15"}, ${color}08)`,
                      border: `1.5px solid ${color}${isFirst ? "70" : "40"}`,
                      overflow: "hidden",
                    }} />
                    <div style={{ fontSize: "8px", fontWeight: "700", color: "#fff", maxWidth: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{names[idx]}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", paddingRight: "20px" }}>
            <div style={{
              fontFamily: "'Stranger', cursive",
              fontSize: "28px",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textShadow: `0 0 12px ${color}60`,
              whiteSpace: "nowrap",
              lineHeight: "1",
            }}>
              Thank you
            </div>
            <div style={{ fontFamily: "'Designer', sans-serif", fontSize: "14px", color: `${color}cc`, lineHeight: "1", whiteSpace: "nowrap", letterSpacing: "1px" }}>Top 3 this stream</div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "total-followers") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0" }}>
        <style>{`
          @keyframes fi-${widgetKey} { 0% { opacity: 0; transform: scale(0.85) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
          @keyframes pulse-glow-${widgetKey} { 0%, 100% { filter: drop-shadow(0 0 6px ${color}50); } 50% { filter: drop-shadow(0 0 12px ${color}80); } }
          @keyframes shimmer-${widgetKey} { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(400%) skewX(-15deg); } }
        `}</style>
        <div key={widgetKey} style={{
          animation: `fi-${widgetKey} 0.3s ease-out`,
          display: "flex",
          alignItems: "center",
          gap: "0",
          padding: "8px 0",
          background: "rgba(10,10,10,0.92)",
          borderRadius: "30px",
          border: `1px solid ${color}30`,
          boxShadow: `0 0 40px ${color}20`,
          minWidth: "260px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "30px",
            pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute",
              top: "0",
              left: "-100%",
              width: "40%",
              height: "100%",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 70%, transparent 100%)",
              animation: `shimmer-${widgetKey} 3s ease-in-out infinite`,
              pointerEvents: "none",
            }} />
          </div>
          <div style={{
            position: "relative",
            flexShrink: 0,
            marginLeft: "10px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${color}50`,
            boxShadow: `0 0 10px ${color}40`,
            background: `linear-gradient(135deg, ${color}20, ${color}08)`,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div style={{ fontFamily: "'Designer', sans-serif", marginLeft: "10px", fontSize: "10px", color: `${color}cc`, fontWeight: "600", lineHeight: "1", whiteSpace: "nowrap" }}>Followers</div>
          <div style={{ flex: 1 }} />
          <div style={{
            fontSize: "28px",
            fontWeight: "900",
            color,
            textShadow: `0 0 12px ${color}40`,
            padding: "0 20px 0 10px",
            whiteSpace: "nowrap",
          }}>
            12.5K
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function WidgetIcon({ id, color }: { id: string; color: string }) {
  if (id === "followers") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  if (id === "likes") return <svg width="22" height="22" viewBox="0 0 24 24" fill={color}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
  if (id === "top-rankers") return <svg width="22" height="22" viewBox="0 0 24 24" fill={color}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}

export default function WidgetsPage() {
  const [username, setUsername] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [widgetColors, setWidgetColors] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<{ avatar: string; nickname: string; followers: number; likes: number } | null>(null);
  const [durations, setDurations] = useState<Record<string, number>>({ followers: 10, likes: 10, "top-rankers": 10, "total-followers": 10 });
  const [thresholds, setThresholds] = useState<Record<string, number>>({ likes: 0 });
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("toman_user");
    if (savedUser) { try { const u = JSON.parse(savedUser); if (u.username) setUsername(u.username); } catch (e) {} }
    const saved = localStorage.getItem("username");
    if (saved && !username) setUsername(saved);
    const savedColors = localStorage.getItem("widgetColors");
    if (savedColors) setWidgetColors(JSON.parse(savedColors));
    const savedDurations = localStorage.getItem("widgetDurations");
    if (savedDurations) setDurations(JSON.parse(savedDurations));
    const savedThresholds = localStorage.getItem("widgetThresholds");
    if (savedThresholds) setThresholds(JSON.parse(savedThresholds));
  }, []);

  useEffect(() => {
    if (!username) return;
    fetch(`/api/user/tiktok?username=${username}`).then(r => r.json()).then(data => {
      if (data.nickname) setProfile({ avatar: data.avatar || "", nickname: data.nickname, followers: data.followers || 0, likes: data.likes || 0 });
    }).catch(() => {});
  }, [username]);

  const getColor = (w: typeof widgets[0]) => widgetColors[w.id] || w.defaultColor;

  const getUrl = (w: typeof widgets[0]) => {
    if (typeof window === "undefined") return "";
    const t = thresholds[w.id] || 0;
    return `${window.location.origin}${w.path}?user=${username || "YOUR"}&color=${encodeURIComponent(getColor(w))}&duration=${durations[w.id] || 10}${t > 0 ? `&threshold=${t}` : ""}`;
  };

  const copyUrl = (w: typeof widgets[0]) => {
    navigator.clipboard.writeText(getUrl(w));
    setCopiedId(w.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const setColor = (id: string, c: string) => {
    const n = { ...widgetColors, [id]: c };
    setWidgetColors(n);
    localStorage.setItem("widgetColors", JSON.stringify(n));
  };

  const setDuration = (id: string, d: number) => {
    const n = { ...durations, [id]: d };
    setDurations(n);
    localStorage.setItem("widgetDurations", JSON.stringify(n));
  };

  const setThreshold = (id: string, t: number) => {
    const n = { ...thresholds, [id]: t };
    setThresholds(n);
    localStorage.setItem("widgetThresholds", JSON.stringify(n));
  };

  const triggerDemo = async (id: string) => {
    setTesting(id);
    await fetch("/api/widgets/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widget: id, demo: true, duration: durations[id] || 10 }),
    });
    setTimeout(() => setTesting(null), (durations[id] || 10) * 1000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "32px 20px", fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ maxWidth: "900px", width: "100%", marginInline: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a51538" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#fff", margin: 0 }}>Widgets</h1>
        </div>

        {profile && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px", background: "#111", border: "1px solid #222", borderRadius: "12px", marginBottom: "16px" }}>
            {profile.avatar ? <img src={profile.avatar} alt="" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid #333" }} /> : <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#222" }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>{profile.nickname}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>@{username}</div>
              <div style={{ display: "flex", gap: "14px", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", color: "#a51538", fontWeight: "600" }}>{profile.followers.toLocaleString()} متابع</span>
                <span style={{ fontSize: "11px", color: "#ec4899", fontWeight: "600" }}>{profile.likes.toLocaleString()} إعجاب</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: "14px 18px", background: "#111", border: "1px solid #222", borderRadius: "12px", marginBottom: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "6px" }}>كيف تشتغل؟</div>
          <div style={{ fontSize: "12px", color: "#999", lineHeight: "1.8" }}>
            <span style={{ color: "#a51538", fontWeight: "600" }}>1.</span> انسخ الرابط والصقه في OBS → Browser Source<br/>
            <span style={{ color: "#a51538", fontWeight: "600" }}>2.</span> اضغط <span style={{ color: "#fff" }}>▶</span> لتجربة الودجت في OBS<br/>
            <span style={{ color: "#a51538", fontWeight: "600" }}>3.</span> أثناء البث مباشرة: يظهر تلقائياً مع اسم المتابع وصورته
          </div>
        </div>

        {testing && (
          <div style={{ marginBottom: "16px", background: "#111", border: "1px solid #222", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: "600" }}>● معاينة حية</span>
              <button onClick={() => setTesting(null)} style={{ fontSize: "11px", color: "#888", background: "none", border: "none", cursor: "pointer" }}>✕ إغلاق</button>
            </div>
            <WidgetPreview id={testing} color={getColor(widgets.find((w) => w.id === testing) || widgets[0])} />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" }}>
          {widgets.map((widget) => {
            const color = getColor(widget);
            return (
              <div key={widget.id} style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <WidgetIcon id={widget.id} color={color} />
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#fff", margin: 0 }}>{widget.title}</h3>
                    {testing === widget.id && <span style={{ fontSize: "10px", color: "#4ade80", fontWeight: "600" }}>● جاري التجربة...</span>}
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "#777" }}>{widget.desc}</div>

                <div style={{ display: "flex", gap: "5px" }}>
                  {presetColors.map((c) => (
                    <button key={c} onClick={() => setColor(widget.id, c)} style={{ width: "18px", height: "18px", borderRadius: "50%", background: c, border: color === c ? "2px solid #fff" : "2px solid #333", cursor: "pointer", padding: 0 }} />
                  ))}
                </div>

                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  {widget.id !== "total-followers" && (
                    <select value={durations[widget.id] || 10} onChange={(e) => setDuration(widget.id, parseInt(e.target.value))} style={{ padding: "3px 6px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#fff", fontSize: "11px", cursor: "pointer" }}>
                      <option value={5}>5 ث</option>
                      <option value={10}>10 ث</option>
                      <option value={15}>15 ث</option>
                      <option value={20}>20 ث</option>
                      <option value={30}>30 ث</option>
                    </select>
                  )}
                  {widget.id === "likes" && (
                    <input
                      type="number"
                      min={0}
                      value={thresholds.likes || 0}
                      onChange={(e) => setThreshold("likes", parseInt(e.target.value) || 0)}
                      placeholder="0"
                      style={{ width: "50px", padding: "3px 6px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#fff", fontSize: "11px", outline: "none" }}
                    />
                  )}
                </div>

                <div style={{ display: "flex", gap: "4px", marginTop: "auto" }}>
                  <button onClick={() => copyUrl(widget)} style={{ flex: 1, padding: "6px 10px", background: copiedId === widget.id ? "#a51538" : "#222", border: "none", borderRadius: "6px", color: "#fff", fontSize: "11px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {copiedId === widget.id ? "✓ تم النسخ" : "نسخ الرابط"}
                  </button>
                  <button onClick={() => triggerDemo(widget.id)} style={{ padding: "6px 12px", background: testing === widget.id ? "#4ade80" : color, border: "none", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", flexShrink: 0 }}>
                    ▶
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
