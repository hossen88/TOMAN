"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GiftIcon, TTSIcon, StarIcon, SongIcon } from "./Icons";

export default function Hero() {
  const { t, locale } = useI18n();

  const [activeAlertIndex, setActiveAlertIndex] = useState(0);

  const sampleAlerts = [
    { type: "gift", user: "Gamer_King", action: "أرسل 500x هدية ممتازة", icon: <GiftIcon size={22} color="#ff2a5b" />, color: "#ff2a5b" },
    { type: "tts", user: "Sara_Live", action: "قراءة صوتية: 'أفضل منصة للبث'", icon: <TTSIcon size={22} color="#38bdf8" />, color: "#38bdf8" },
    { type: "follow", user: "Ahmed_Stream", action: "قام بمتابعة البث المباشر!", icon: <StarIcon size={22} color="#4ade80" />, color: "#4ade80" },
    { type: "song", user: "DJ_Pro", action: "طلب أغنية: 'Desert Rose'", icon: <SongIcon size={22} color="#a855f7" />, color: "#a855f7" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % sampleAlerts.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentAlert = sampleAlerts[activeAlertIndex];

  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "70px 20px 90px", minHeight: "85vh", display: "flex", alignItems: "center" }}>
      {/* Ambient Radial Background Glows */}
      <div style={{ position: "absolute", top: "-5%", left: "50%", transform: "translateX(-50%)", width: "900px", height: "550px", background: "radial-gradient(circle, rgba(232, 21, 72, 0.22) 0%, rgba(120, 10, 36, 0.05) 55%, transparent 75%)", filter: "blur(90px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "40%", right: "5%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1240px", margin: "0 auto", width: "100%" }}>
        {/* Main Content Box */}
        <div style={{ textAlign: "center", maxWidth: "880px", margin: "0 auto 50px" }}>
          {/* Top Pill Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 18px",
              borderRadius: "50px",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "24px",
              backgroundColor: "rgba(232, 21, 72, 0.12)",
              border: "1px solid rgba(232, 21, 72, 0.35)",
              color: "#ff3b68",
              boxShadow: "0 0 20px rgba(232, 21, 72, 0.15)",
            }}
          >
            <span className="live-indicator-dot" />
            <span>{t.hero.badge}</span>
          </div>

          {/* High-Impact Heading with Clean Arabic Typography */}
          <h1
            style={{
              fontSize: "clamp(34px, 5.5vw, 62px)",
              fontWeight: "800",
              lineHeight: "1.35",
              letterSpacing: "0px",
              marginBottom: "20px",
              color: "#ffffff",
            }}
          >
            {locale === "ar" ? (
              <>
                طوّر بثك على <span style={{ color: "#ff3b68", textShadow: "0 0 25px rgba(232, 21, 72, 0.5)" }}>تيك توك لايف</span> الاحترافي
              </>
            ) : (
              <>
                Supercharge Your <span style={{ color: "#ff3b68", textShadow: "0 0 25px rgba(232, 21, 72, 0.5)" }}>TikTok LIVE</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(16px, 1.8vw, 19px)",
              lineHeight: "1.8",
              color: "#94a3b8",
              maxWidth: "660px",
              margin: "0 auto 36px",
              fontWeight: "500",
            }}
          >
            {t.hero.subtitle}
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link
              href="/login"
              className="gradient-btn-crimson"
              style={{
                height: "52px",
                padding: "0 36px",
                fontSize: "15px",
                fontWeight: "700",
                color: "#ffffff",
                borderRadius: "12px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 6px 25px rgba(232, 21, 72, 0.4)",
              }}
            >
              <span>{t.hero.cta}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: locale === "ar" ? "rotate(180deg)" : "none" }}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <Link
              href="/docs"
              style={{
                height: "52px",
                padding: "0 32px",
                fontSize: "15px",
                fontWeight: "700",
                color: "#f1f5f9",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "12px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <span>{t.hero.ctaSecondary}</span>
            </Link>
          </div>
        </div>

        {/* Live Stream Overlay Interactive Mockup Widget */}
        <div style={{ maxWidth: "840px", margin: "0 auto 60px" }}>
          <div
            className="glass-card"
            style={{
              borderRadius: "22px",
              padding: "20px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "linear-gradient(180deg, rgba(18, 18, 28, 0.85) 0%, rgba(10, 10, 16, 0.95) 100%)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(232, 21, 72, 0.12)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Window Bar Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "14px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
                </div>
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700" }}>TOMAN Live Stream Engine</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "4px 12px", borderRadius: "20px" }}>
                <span className="live-indicator-dot" />
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#ef4444" }}>LIVE ON AIR</span>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div
              style={{
                height: "200px",
                borderRadius: "14px",
                backgroundColor: "#06060a",
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 0)",
                backgroundSize: "18px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ position: "absolute", top: "16px", left: "16px", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.3)" }}>
                OBS / Stream Studio Live Feed
              </div>

              {/* Animated Alert Box */}
              <div
                key={activeAlertIndex}
                className="glass-panel animate-float"
                style={{
                  padding: "14px 24px",
                  borderRadius: "16px",
                  border: `1px solid ${currentAlert.color}66`,
                  boxShadow: `0 10px 30px ${currentAlert.color}25`,
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  maxWidth: "92%",
                  background: "rgba(14, 14, 22, 0.92)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    backgroundColor: `${currentAlert.color}22`,
                    border: `1px solid ${currentAlert.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0,
                  }}
                >
                  {currentAlert.icon}
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    تنبيه بث مباشر لحظي
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginTop: "2px" }}>
                    <span style={{ color: currentAlert.color }}>@{currentAlert.user}</span> {currentAlert.action}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - High Contrast */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", maxWidth: "860px", margin: "0 auto" }}>
          {[
            { value: t.hero.stats.users, label: t.hero.stats.usersLabel, desc: "لا شروط أو قيود مادية" },
            { value: t.hero.stats.streams, label: t.hero.stats.streamsLabel, desc: "خوادم سحابية عالية الأداء" },
            { value: t.hero.stats.gifts, label: t.hero.stats.giftsLabel, desc: "بدون أي رسوم أو اشتراك" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: "24px 20px",
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(18, 18, 28, 0.5)",
              }}
            >
              <div style={{ fontSize: "36px", fontWeight: "800", color: "#ff3b68", lineHeight: "1.2", letterSpacing: "0px" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginTop: "6px" }}>{stat.label}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


