"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";

export default function TotalFollowersWidget() {
  const [count, setCount] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [color, setColor] = useState("#06b6d4");
  const [show, setShow] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);
  const [bump, setBump] = useState(false);
  const targetRef = useRef(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("color");
    if (c) setColor(c);

    if (params.get("demo") === "true") {
      setTimeout(() => {
        const val = Math.floor(Math.random() * 50000) + 1000;
        targetRef.current = val;
        setCount(val);
        setWidgetKey((k) => k + 1);
        setShow(true);
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

    fetch("/api/user/tiktok?username=" + clean + "&_t=" + Date.now())
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (d.avatar) setAvatar(d.avatar);
        if (d.followers > 0) {
          targetRef.current = d.followers;
          setCount(d.followers);
        }
        setShow(true);
      })
      .catch(() => { setShow(true); });

    const poll = async () => {
      if (!active) return;
      try {
        const res = await fetch("/api/widgets/state?widget=total-followers&_t=" + Date.now());
        const data = await res.json();
        if (data.demo) {
          targetRef.current = Math.floor(Math.random() * 50000) + 1000;
          setCount(targetRef.current);
          setWidgetKey((k) => k + 1);
          setShow(true);
          await fetch("/api/widgets/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ widget: "total-followers", demo: false }),
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
            if (data.type === "follower") {
              targetRef.current += 1;
              setCount(targetRef.current);
              setBump(true);
              setTimeout(() => setBump(false), 200);
              setShow(true);
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
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  if (!show) return null;

  const avatarSrc = avatar ? (avatar.includes("tiktokcdn") || avatar.includes("tiktok.com") ? avatar : "/api/avatar?url=" + encodeURIComponent(avatar)) : "";

  const widgetContent = (
    <>
      <style>{`
        @keyframes fade-in-${widgetKey} { 0% { opacity: 0; transform: scale(0.85) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes shimmer-${widgetKey} {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(400%) skewX(-15deg); }
        }
      `}</style>
      <div
        key={widgetKey}
        data-widget="total-followers"
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
        }}>
          {avatarSrc ? (
            <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          )}
        </div>
        <div style={{
          fontFamily: "'Designer', sans-serif",
          marginLeft: "10px",
          fontSize: "10px",
          color: `${color}cc`,
          fontWeight: "600",
          lineHeight: "1",
          whiteSpace: "nowrap",
        }}>Followers</div>
        <div style={{ flex: 1 }} />
        <div style={{
          fontSize: "28px",
          fontWeight: "900",
          color,
          textShadow: `0 0 12px ${color}40`,
          padding: "0 20px 0 10px",
          whiteSpace: "nowrap",
          transform: bump ? "scale(1.15)" : "scale(1)",
          transition: "transform 0.2s ease",
        }}>
          {count.toLocaleString()}
        </div>
      </div>
    </>
  );

  const wrapperStyle = { display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", fontFamily: "'Cairo', 'Segoe UI', sans-serif" } as const;

  if (false) {
    return <div style={wrapperStyle}>{widgetContent}</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh", ...wrapperStyle }}>
      {widgetContent}
    </div>
  );
}
