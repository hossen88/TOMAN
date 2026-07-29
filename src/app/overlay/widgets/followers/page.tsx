"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";

const demoNames = ["أحمد", "سارة", "عمر", "ليلى", "يوسف", "نور", "محمد", "خالد", "ريما", "حسن", "مريم", "يوسف"];

function isTikTokCdn(url: string): boolean {
  return url.includes("tiktokcdn") || url.includes("tiktok.com") || url.includes("bytedance");
}

function avatarSrc(url: string): string {
  if (!url) return "";
  if (isTikTokCdn(url)) return url;
  return "/api/avatar?url=" + encodeURIComponent(url);
}

export default function FollowerWidget() {
  const [follower, setFollower] = useState("");
  const [avatar, setAvatar] = useState("");
  const [color, setColor] = useState("#a855f7");
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState(10);
  const [widgetKey, setWidgetKey] = useState(0);
  const [preview, setPreview] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hideAfter = useCallback((seconds: number) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShow(false), seconds * 1000);
  }, []);

  const showWidget = useCallback((name: string, rawAvatar: string) => {
    setFollower(name);
    setAvatar(rawAvatar);
    setShow(true);
    setWidgetKey((k) => k + 1);
    hideAfter(duration);
  }, [duration, hideAfter]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("color");
    const d = params.get("duration");
    if (c) setColor(c);
    if (d) setDuration(parseInt(d));
    if (params.get("preview") === "true") setPreview(true);

    if (params.get("demo") === "true") {
      const dur = d ? parseInt(d) : 10;
      const showDemo = () => {
        setFollower(demoNames[Math.floor(Math.random() * demoNames.length)]);
        setAvatar("");
        setShow(true);
        setWidgetKey((k) => k + 1);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => {
          setShow(false);
          setTimeout(showDemo, 1500);
        }, dur * 1000);
      };
      setTimeout(showDemo, 300);
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
    const username = params.get("user") || (typeof window !== "undefined" ? localStorage.getItem("username") || "" : "");
    if (!username) return;
    const clean = username.replace("@", "").trim();
    let active = true;

    // Stat polling backup
    let lastFollowerCount = 0;
    const checkFollowerStat = () => {
      fetch("/api/user/tiktok?username=" + clean + "&_t=" + Date.now())
        .then((r) => r.json())
        .then((d) => {
          if (!active) return;
          if (d.followers && d.followers > 0) {
            if (lastFollowerCount > 0 && d.followers > lastFollowerCount) {
              showWidget("متابع جديد!", d.avatar || "");
            }
            lastFollowerCount = d.followers;
          }
        })
        .catch(() => {});
    };

    checkFollowerStat();
    const statInterval = setInterval(checkFollowerStat, 10000);

    const poll = async () => {
      if (!active) return;
      try {
        const res = await fetch("/api/widgets/state?widget=followers&_t=" + Date.now());
        const data = await res.json();
        if (data.demo) {
          showWidget(demoNames[Math.floor(Math.random() * demoNames.length)], "");
          await fetch("/api/widgets/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ widget: "followers", demo: false }),
          });
        }
      } catch (e) {}
    };
    const pollInterval = setInterval(poll, 1000);

    let retryCount = 0;
    let evtSource: EventSource | null = null;

    const connect = () => {
      if (!active) return;
      try {
        const base = typeof window !== "undefined" ? window.location.origin : "";
        if (evtSource) evtSource.close();
        evtSource = new EventSource(base + "/api/tiktok/live-events?user=" + clean);
        evtSource.onopen = () => {
          retryCount = 0;
        };
        evtSource.onmessage = (event) => {
          if (!active) return;
          try {
            const data = JSON.parse(event.data);
            if (data.connected) return;
            if (data.type === "follower") {
              showWidget(data.displayName || "متابع جديد", data.avatar || "");
            }
          } catch (e) {}
        };
        evtSource.onerror = () => {
          if (!active) return;
          evtSource?.close();
          const delay = Math.min(1000 * Math.pow(2, retryCount), 15000);
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
      clearInterval(statInterval);
      clearInterval(pollInterval);
      evtSource?.close();
    };
  }, [showWidget]);

  if (!show) return null;

  const widgetContent = (
    <>
      <style>{`
        @keyframes fade-in-${widgetKey} { 0% { opacity: 0; transform: scale(0.85) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes ring-spin-${widgetKey} { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes shimmer-${widgetKey} {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(400%) skewX(-15deg); }
        }
      `}</style>
      <div
        key={widgetKey}
        data-widget="followers"
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
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 70%, transparent 100%)`,
            animation: `shimmer-${widgetKey} 3s ease-in-out infinite`,
            pointerEvents: "none",
          }} />
        </div>
        <div style={{ position: "relative", width: "42px", height: "40px", flexShrink: 0, marginLeft: "10px" }}>
          <svg
            style={{
              position: "absolute",
              inset: "-2px",
              animation: `ring-spin-${widgetKey} 3s linear infinite`,
            }}
            width="44"
            height="44"
            viewBox="0 0 44 44"
          >
            <defs>
              <linearGradient id={`rg-${widgetKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="50%" stopColor="transparent" />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            </defs>
            <circle cx="22" cy="22" r="20" fill="none" stroke={`url(#rg-${widgetKey})`} strokeWidth="2" strokeDasharray="12 6" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: "2px",
              top: "2px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              overflow: "hidden",
              background: `linear-gradient(135deg, ${color}20, ${color}08)`,
              border: `1.5px solid ${color}50`,
            }}
          >
            {avatar ? (
              <img
                key={widgetKey + "-img"}
                src={avatarSrc(avatar)}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
          </div>
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
          <div
            style={{
              fontSize: "18px",
              fontWeight: "900",
              color: "#fff",
              textShadow: `0 0 10px ${color}30`,
              lineHeight: "1",
              marginTop: "2px",
            }}
          >
            {follower}
          </div>
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
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        fontFamily: "'Cairo', 'Segoe UI', sans-serif",
      }}
    >
      {widgetContent}
    </div>
  );
}
