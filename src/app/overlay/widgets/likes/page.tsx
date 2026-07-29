"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback } from "react";

function isTikTokCdn(url: string): boolean {
  return url.includes("tiktokcdn") || url.includes("tiktok.com") || url.includes("bytedance");
}

function avatarSrc(url: string): string {
  if (!url) return "";
  if (isTikTokCdn(url)) return url;
  return "/api/avatar?url=" + encodeURIComponent(url);
}

export default function LikesWidget() {
  const [likes, setLikes] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [color, setColor] = useState("#ef4444");
  const [show, setShow] = useState(false);
  const [duration, setDuration] = useState(10);
  const [widgetKey, setWidgetKey] = useState(0);
  const [preview, setPreview] = useState(false);
  const [likeThreshold, setLikeThreshold] = useState(0);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hideAfter = useCallback((seconds: number) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShow(false), seconds * 1000);
  }, []);

  const userLikesMapRef = useRef<{ [key: string]: number }>({});

  const processLike = useCallback((displayName: string, rawAvatar: string, batchCount: number, uniqueId: string) => {
    const targetThreshold = likeThreshold > 0 ? likeThreshold : 1;
    const id = uniqueId || displayName || "guest";
    const current = (userLikesMapRef.current[id] || 0) + (batchCount || 1);

    if (current >= targetThreshold) {
      userLikesMapRef.current[id] = current % targetThreshold;
      setLikes(targetThreshold);
      setAvatar(rawAvatar);
      setShow(true);
      setWidgetKey((k) => k + 1);
      hideAfter(duration);
    } else {
      userLikesMapRef.current[id] = current;
    }
  }, [duration, hideAfter, likeThreshold]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("color");
    const d = params.get("duration");
    const t = params.get("threshold");
    if (c) setColor(c);
    if (d) setDuration(parseInt(d));
    if (t) setLikeThreshold(parseInt(t));
    if (params.get("preview") === "true") setPreview(true);

    if (params.get("demo") === "true") {
      const dur = d ? parseInt(d) : 10;
      const targetThreshold = t ? parseInt(t) : 250;
      const showDemo = () => {
        setLikes(targetThreshold);
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
    let lastLikeCount = 0;
    const checkLikeStat = () => {
      fetch("/api/user/tiktok?username=" + clean + "&_t=" + Date.now())
        .then((r) => r.json())
        .then((d) => {
          if (!active) return;
          if (d.likes && d.likes > 0) {
            if (lastLikeCount > 0 && d.likes > lastLikeCount) {
              const diff = d.likes - lastLikeCount;
              processLike("تكبيس الجماعة", "", diff, "group");
            }
            lastLikeCount = d.likes;
          }
        })
        .catch(() => {});
    };

    checkLikeStat();
    const statInterval = setInterval(checkLikeStat, 10000);

    const poll = async () => {
      if (!active) return;
      try {
        const res = await fetch("/api/widgets/state?widget=likes&_t=" + Date.now());
        const data = await res.json();
        if (data.demo) {
          const targetThreshold = likeThreshold > 0 ? likeThreshold : 250;
          setLikes(targetThreshold);
          setShow(true);
          setWidgetKey((k) => k + 1);
          await fetch("/api/widgets/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ widget: "likes", demo: false }),
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
            if (data.type === "like") {
              processLike(data.displayName || data.uniqueId || "المكبس", data.avatar || "", data.likeCount || 1, data.uniqueId || data.displayName);
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
  }, [processLike, likeThreshold]);

  if (!show) return null;

  const widgetContent = (
    <>
      <style>{`
        @keyframes pulse-heart-${widgetKey} { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        @keyframes fade-in-${widgetKey} { 0% { opacity: 0; transform: scale(0.85) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes shimmer-${widgetKey} {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(400%) skewX(-15deg); }
        }
      `}</style>
      <div
        key={widgetKey}
        data-widget="likes"
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
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              width: "40px",
              height: "40px",
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
        <div style={{ marginLeft: "10px" }}>
          <div style={{ fontFamily: "'Designer', sans-serif", fontSize: "10px", color: `${color}cc`, fontWeight: "600", marginTop: "-4px" }}>New Like!</div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "900",
              color: "#fff",
              textShadow: `0 0 10px ${color}30`,
              lineHeight: "1.1",
            }}
          >
            +{likes}
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
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", fontFamily: "'Cairo', 'Segoe UI', sans-serif" }}>
      {widgetContent}
    </div>
  );
}
