"use client";

import { useEffect, useState, useRef } from "react";

interface Alert {
  id: string;
  type: "donation" | "like";
  username: string;
  message?: string;
  amount?: number;
  timestamp: number;
  connected?: boolean;
}

const alertStyles: Record<string, { color: string; colorLight: string; title: string; bg: string }> = {
  donation: { color: "#10b981", colorLight: "#6ee7b7", title: "NEW DONATION!", bg: "radial-gradient(ellipse at 50% 60%, #064e3b 0%, #022c22 40%, #000 100%)" },
  like: { color: "#ef4444", colorLight: "#fca5a5", title: "NEW LIKE!", bg: "radial-gradient(ellipse at 50% 60%, #7f1d1d 0%, #450a0a 40%, #000 100%)" },
};

export default function OverlayPage() {
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [phase, setPhase] = useState<"none" | "enter" | "show" | "exit">("none");
  const [displayCount, setDisplayCount] = useState(0);
  const queueRef = useRef<Alert[]>([]);
  const processingRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    if (!username) return;

    const eventSource = new EventSource(`/api/alerts/stream?user=${username}`);
    eventSource.onmessage = (event) => {
      try {
        const alert: Alert = JSON.parse(event.data);
        if (alert.connected) return;
        const cfgStr = localStorage.getItem("alertConfig");
        if (cfgStr) {
          try {
            const cfg = JSON.parse(cfgStr);
            const alertCfg = cfg[alert.type];
            if (alertCfg && !alertCfg.enabled) return;
            if (alertCfg && alertCfg.threshold && (alert.amount || 0) < alertCfg.threshold) return;
          } catch (e) {}
        }
        queueRef.current.push(alert);
        processQueue();
      } catch (e) {}
    };
    eventSource.onerror = () => setTimeout(() => window.location.reload(), 3000);
    return () => eventSource.close();
  }, []);

  const processQueue = () => {
    if (processingRef.current || queueRef.current.length === 0) return;
    processingRef.current = true;
    const alert = queueRef.current.shift()!;
    setCurrentAlert(alert);
    setPhase("enter");
    setDisplayCount(alert.amount || 0);
    playAlertSound(alert.type);

    setTimeout(() => setPhase("show"), 200);
    setTimeout(() => {
      setPhase("exit");
      setTimeout(() => {
        setCurrentAlert(null);
        setPhase("none");
        processingRef.current = false;
        processQueue();
      }, 800);
    }, 5000);
  };

  const playAlertSound = (type: string) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = type === "donation" ? [261, 329, 392, 523, 659] : [440, 554, 659];
      let t = ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, t + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.4);
        osc.start(t + i * 0.15);
        osc.stop(t + i * 0.15 + 0.4);
      });
    } catch (e) {}
  };

  if (!currentAlert || phase === "none") {
    return <div style={{ width: "100vw", height: "100vh", background: "transparent" }} />;
  }

  const cfg = alertStyles[currentAlert.type] || alertStyles.like;
  const amount = currentAlert.amount || 0;

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "transparent", fontFamily: "'Stranger', 'Cairo', sans-serif", position: "relative" }}>
      <style jsx global>{`
        @keyframes bgFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes bgFadeOut { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes numberScale {
          0% { transform: scale(0.2); opacity: 0; filter: blur(30px); }
          40% { transform: scale(1.15); opacity: 1; filter: blur(0); }
          60% { transform: scale(0.95); }
          80% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes numberGlow {
          0%, 100% { text-shadow: 0 0 40px ${cfg.color}80, 0 0 80px ${cfg.color}40, 0 0 120px ${cfg.color}20; }
          50% { text-shadow: 0 0 60px ${cfg.color}a0, 0 0 100px ${cfg.color}60, 0 0 160px ${cfg.color}30; }
        }
        @keyframes ghostNumber {
          0% { opacity: 0.6; transform: scale(1) translateY(0); filter: blur(2px); }
          100% { opacity: 0; transform: scale(1.8) translateY(-60px); filter: blur(8px); }
        }
        @keyframes titleSlide {
          0% { opacity: 0; transform: translateY(30px) scaleX(0.8); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0) scaleX(1); filter: blur(0); }
        }
        @keyframes smoke {
          0% { transform: translateX(-10%) translateY(5%) scale(1); opacity: 0.15; }
          50% { transform: translateX(5%) translateY(-3%) scale(1.1); opacity: 0.25; }
          100% { transform: translateX(-10%) translateY(5%) scale(1); opacity: 0.15; }
        }
        @keyframes rayRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes vignettePulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.9; }
        }
        @keyframes barGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div style={{
        position: "absolute", inset: 0,
        background: cfg.bg,
        animation: phase === "exit" ? "bgFadeOut 0.8s ease-in forwards" : "bgFadeIn 0.5s ease-out forwards",
      }}>
        {/* Rays */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: "200vw", height: "200vh",
          background: `repeating-conic-gradient(from 0deg, ${cfg.color}08 0deg 5deg, transparent 5deg 10deg)`,
          transform: "translate(-50%, -50%)",
          animation: "rayRotate 30s linear infinite",
          opacity: 0.5,
        }} />

        {/* Light burst */}
        <div style={{
          position: "absolute", top: "35%", left: "50%",
          width: "800px", height: "800px", borderRadius: "50%",
          background: `radial-gradient(circle, ${cfg.color}30 0%, ${cfg.color}10 30%, transparent 60%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
          animation: "numberGlow 3s ease-in-out infinite",
        }} />

        {/* Smoke 1 */}
        <div style={{
          position: "absolute", bottom: 0, left: "-10%",
          width: "120%", height: "60%",
          background: `radial-gradient(ellipse at 30% 80%, ${cfg.color}15 0%, transparent 60%)`,
          animation: "smoke 8s ease-in-out infinite",
          filter: "blur(30px)",
        }} />

        {/* Smoke 2 */}
        <div style={{
          position: "absolute", bottom: 0, right: "-10%",
          width: "120%", height: "50%",
          background: `radial-gradient(ellipse at 70% 90%, ${cfg.color}10 0%, transparent 50%)`,
          animation: "smoke 10s ease-in-out 2s infinite",
          filter: "blur(40px)",
        }} />

        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
          animation: "vignettePulse 4s ease-in-out infinite",
        }} />

        {/* Sparkles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            borderRadius: "50%",
            background: "#fff",
            animation: `sparkle ${1 + Math.random() * 2}s ease-in-out ${Math.random() * 3}s infinite`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        zIndex: 10,
      }}>
        {/* Ghost numbers behind */}
        {amount > 0 && phase !== "exit" && (
          <>
            <div style={{
              position: "absolute", fontSize: "180px", fontWeight: "900",
              color: `${cfg.colorLight}15`, fontFamily: "'Stranger', 'Cairo', sans-serif",
              animation: "ghostNumber 2s ease-out 0.5s forwards",
              letterSpacing: "-4px",
            }}>{amount}</div>
            <div style={{
              position: "absolute", fontSize: "180px", fontWeight: "900",
              color: `${cfg.colorLight}10`, fontFamily: "'Stranger', 'Cairo', sans-serif",
              animation: "ghostNumber 2s ease-out 0.8s forwards",
              letterSpacing: "-4px",
            }}>{amount}</div>
          </>
        )}

        {/* Title */}
        <div style={{
          fontSize: "28px", fontWeight: "800", color: cfg.colorLight,
          letterSpacing: "12px", textTransform: "uppercase", marginBottom: "20px",
          animation: phase === "exit" ? "bgFadeOut 0.6s ease-in forwards" : "titleSlide 0.8s ease-out 0.3s both",
          textShadow: `0 0 30px ${cfg.color}80`,
          fontFamily: "'Designer', 'Cairo', sans-serif",
        }}>
          {cfg.title}
        </div>

        {/* Main number / username */}
        <div style={{
          fontSize: amount > 0 ? "200px" : "90px", fontWeight: "900", color: "#fff",
          lineHeight: 1, letterSpacing: amount > 0 ? "-6px" : "normal",
          animation: phase === "exit" ? "bgFadeOut 0.6s ease-in forwards" : "numberScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both",
          textShadow: amount > 0
            ? `0 0 40px ${cfg.color}80, 0 0 80px ${cfg.color}40, 0 0 120px ${cfg.color}20`
            : `0 0 40px ${cfg.color}80, 0 0 80px ${cfg.color}40`,
          fontFamily: amount > 0 ? "'Stranger', 'Cairo', sans-serif" : "'Chopsic', 'Cairo', sans-serif",
          position: "relative",
        }}>
          {amount > 0 && phase !== "exit" && <div style={{
            position: "absolute", inset: 0,
            animation: "numberGlow 2s ease-in-out infinite",
          }} />}
          {amount > 0 ? amount.toLocaleString() : currentAlert.username}
        </div>

        {/* Username under amount */}
        {amount > 0 && (
          <div style={{
            fontSize: "36px", fontWeight: "700", color: cfg.colorLight,
            marginTop: "16px",
            animation: phase === "exit" ? "bgFadeOut 0.6s ease-in forwards" : "titleSlide 0.6s ease-out 0.6s both",
            textShadow: `0 0 20px ${cfg.color}60`,
            fontFamily: "'Chopsic', 'Cairo', sans-serif",
          }}>
            {currentAlert.username}
          </div>
        )}

        {/* Message */}
        {currentAlert.message && (
          <div style={{
            fontSize: "20px", color: `${cfg.colorLight}cc`,
            marginTop: "12px",
            animation: phase === "exit" ? "bgFadeOut 0.6s ease-in forwards" : "titleSlide 0.6s ease-out 0.8s both",
          }}>
            {currentAlert.message}
          </div>
        )}

        {/* Bottom bars */}
        <div style={{
          position: "absolute", bottom: "8%", left: "15%", right: "15%",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${cfg.color}60, transparent)`,
          animation: "barGlow 3s ease-in-out infinite",
        }} />
      </div>
    </div>
  );
}
