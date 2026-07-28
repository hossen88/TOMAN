"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface TopUser {
  name: string;
  score: number;
  avatar: string;
  uniqueId: string;
}

function isTikTokCdn(url: string): boolean {
  return url.includes("tiktokcdn") || url.includes("tiktok.com") || url.includes("bytedance");
}

function avatarSrc(url: string): string {
  if (!url) return "";
  if (isTikTokCdn(url)) return url;
  return "/api/avatar?url=" + encodeURIComponent(url);
}

const demoUsers: TopUser[] = [
  { name: "أحمد", score: 150, avatar: "", uniqueId: "ahmed" },
  { name: "سارة", score: 120, avatar: "", uniqueId: "sara" },
  { name: "عمر", score: 95, avatar: "", uniqueId: "omar" },
  { name: "ليلى", score: 80, avatar: "", uniqueId: "layla" },
  { name: "يوسف", score: 65, avatar: "", uniqueId: "yousef" },
  { name: "نور", score: 50, avatar: "", uniqueId: "noor" },
];

function getTop3(users: Map<string, TopUser>): TopUser[] {
  return Array.from(users.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default function TopRankersWidget() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [color, setColor] = useState("#eab308");
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState(15);
  const [preview, setPreview] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const usersMapRef = useRef<Map<string, TopUser>>(new Map());

  const updateTop = useCallback(() => {
    const top = getTop3(usersMapRef.current);
    setTopUsers(top);
    if (top.length > 0 && !show) {
      setWidgetKey((k) => k + 1);
      setShow(true);
    }
  }, [show]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("color");
    const d = params.get("duration");
    if (c) setColor(c);
    if (d) setDuration(parseInt(d));
    if (params.get("preview") === "true") setPreview(true);

    if (params.get("demo") === "true") {
      const dur = d ? parseInt(d) : 15;
      setTimeout(() => {
        setTopUsers(demoUsers);
        setWidgetKey((k) => k + 1);
        setShow(true);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => setShow(false), dur * 1000);
      }, 300);
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      try {
        const el = document.querySelector("[data-widget]") as HTMLElement;
        if (el && (window as any).obsstudio) {
          const rect = el.getBoundingClientRect();
          (window as any).obsstudio.resize(Math.ceil(rect.width) + 40, Math.ceil(rect.height) + 40);
        }
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [show]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    if (!username) return;
    const clean = username.replace("@", "").trim();
    let active = true;

    const poll = async () => {
      if (!active) return;
      try {
        const res = await fetch("/api/widgets/state?widget=top-rankers&_t=" + Date.now());
        const data = await res.json();
        if (data.demo) {
          setTopUsers(demoUsers);
          setWidgetKey((k) => k + 1);
          setShow(true);
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          hideTimerRef.current = setTimeout(() => setShow(false), duration * 1000);
          await fetch("/api/widgets/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ widget: "top-rankers", demo: false }),
          });
        }
      } catch (e) {}
    };

    const pollInterval = setInterval(poll, 200);

    let retryCount = 0;
    let evtSource: EventSource | null = null;

    const connect = () => {
      if (!active) return;
      try {
        const base = typeof window !== "undefined" ? window.location.origin : "";
        evtSource = new EventSource(base + "/api/tiktok/live-events?user=" + clean);
        evtSource.onopen = () => { retryCount = 0; };
        evtSource.onmessage = (event) => {
          if (!active) return;
          try {
            const data = JSON.parse(event.data);
            if (data.connected) return;

            if (data.type === "follower" || data.type === "like" || data.type === "chat" || data.type === "member" || data.type === "gift") {
              const uid = data.uniqueId || data.displayName;
              if (!uid) return;

              const existing = usersMapRef.current.get(uid);
              const points = data.type === "gift" ? (data.giftCount || 1) : 1;
              if (existing) {
                existing.score += points;
                if (data.avatar && !existing.avatar) existing.avatar = data.avatar;
              } else {
                usersMapRef.current.set(uid, {
                  name: data.displayName || uid,
                  score: points,
                  avatar: data.avatar || "",
                  uniqueId: uid,
                });
              }

              const top = getTop3(usersMapRef.current);
              setTopUsers(top);
              if (top.length > 0 && !show) {
                setWidgetKey((k) => k + 1);
                setShow(true);
              }
            }
          } catch (e) {}
        };
        evtSource.onerror = () => {
          if (!active) return;
          evtSource?.close();
          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
          retryCount++;
          setTimeout(connect, delay);
        };
      } catch (e) {
        if (active) setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      active = false;
      clearInterval(pollInterval);
      evtSource?.close();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [duration, show]);

  if (!show || topUsers.length === 0) return null;

  const widgetContent = (
    <>
      <style>{`
        @keyframes fade-in-${widgetKey} { 0% { opacity: 0; transform: scale(0.85) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes pulse-star-${widgetKey} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        @keyframes shimmer-${widgetKey} {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(400%) skewX(-15deg); }
        }
      `}</style>
      <div
        key={widgetKey}
        data-widget="top-rankers"
        style={{
          animation: `fade-in-${widgetKey} 0.3s ease-out`,
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
        }}
      >
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
              const user = topUsers[idx];
              if (!user) return null;
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
                  }}>
                    {user.avatar ? (
                      <img src={avatarSrc(user.avatar)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : null}
                  </div>
                  <div style={{ fontSize: "8px", fontWeight: "700", color: "#fff", maxWidth: "50px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
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
          <div style={{ fontFamily: "'Designer', 'Segoe UI', sans-serif", fontSize: "14px", color: `${color}cc`, lineHeight: "1", whiteSpace: "nowrap", letterSpacing: "1px" }}>Top 3 this stream</div>
        </div>
      </div>
    </>
  );

  if (preview) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", fontFamily: "'Cairo', 'Segoe UI', sans-serif" }}>
        {widgetContent}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", fontFamily: "'Cairo', 'Segoe UI', sans-serif" }}>
      {widgetContent}
    </div>
  );
}
