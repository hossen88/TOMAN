"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function DiscordWidgetOverlay() {
  const [inviteLink, setInviteLink] = useState("discord.gg/gEPzAVkv4E");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const link = params.get("link") || "https://discord.gg/gEPzAVkv4E";
    const clean = link.replace("https://", "").replace("http://", "");
    setInviteLink(clean);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", overflow: "hidden", fontFamily: "'Alexandria', sans-serif" }}>
      <style>{`
        @keyframes logoMove {
          0%, 22% {
            opacity: 1;
            transform: translateX(145px) scale(1);
            filter: drop-shadow(0 0 20px rgba(232, 21, 72, 0.8));
          }
          24% {
            opacity: 1;
            transform: translateX(145px) scale(1.08);
            filter: drop-shadow(0 0 28px rgba(232, 21, 72, 1));
          }
          44% {
            opacity: 1;
            transform: translateX(-148px) scale(1);
            filter: drop-shadow(0 0 18px rgba(232, 21, 72, 0.8));
          }
          75% {
            opacity: 1;
            transform: translateX(-148px) scale(1);
            filter: drop-shadow(0 0 18px rgba(232, 21, 72, 0.8));
          }
          77% {
            opacity: 1;
            transform: translateX(-148px) scale(1.05);
            filter: drop-shadow(0 0 28px rgba(232, 21, 72, 1));
          }
          94% {
            opacity: 1;
            transform: translateX(145px) scale(1);
            filter: drop-shadow(0 0 20px rgba(232, 21, 72, 0.8));
          }
          100% {
            opacity: 1;
            transform: translateX(145px) scale(1);
            filter: drop-shadow(0 0 20px rgba(232, 21, 72, 0.8));
          }
        }

        @keyframes textRevealFromBehind {
          0%, 23% {
            opacity: 0;
            clip-path: inset(-20px -20px -20px 100%);
          }
          24% {
            opacity: 1;
            clip-path: inset(-20px -20px -20px 100%);
          }
          44% {
            opacity: 1;
            clip-path: inset(-20px -20px -20px 0%);
          }
          75% {
            opacity: 1;
            clip-path: inset(-20px -20px -20px 0%);
          }
          94% {
            opacity: 1;
            clip-path: inset(-20px -20px -20px 100%);
          }
          95%, 100% {
            opacity: 0;
            clip-path: inset(-20px -20px -20px 100%);
          }
        }
      `}</style>
      <div style={{ position: "relative", width: "460px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
        
        {/* TEXT REVEAL LAYER (Positioned closer to logo, clean crisp font without background glow) */}
        <div style={{
          position: "absolute",
          left: "108px",
          width: "270px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "4px",
          background: "transparent",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          animation: "textRevealFromBehind 9.5s cubic-bezier(0.25, 1, 0.5, 1) infinite",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 15px, #000 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, #000 15px, #000 100%)",
        }}>
          <span style={{
            fontSize: "24px",
            fontWeight: "900",
            color: "#ffffff",
            letterSpacing: "-0.2px",
            background: "transparent",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)",
          }}>
            Toman Community
          </span>
          <span style={{
            fontSize: "18px",
            fontWeight: "800",
            color: "#ff2a5b",
            direction: "ltr",
            textAlign: "left",
            background: "transparent",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)",
          }}>
            {inviteLink}
          </span>
        </div>

        {/* LOGO LAYER (Permanently visible) */}
        <div style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          zIndex: 2,
          animation: "logoMove 9.5s cubic-bezier(0.25, 1, 0.5, 1) infinite",
        }}>
          <img src="/logo.png" alt="TOMAN" style={{ width: "85px", height: "85px", objectFit: "contain" }} />
        </div>

      </div>
    </div>
  );
}
