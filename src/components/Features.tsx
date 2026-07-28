"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";
import { SoundAlertIcon, TTSIcon, OverlayIcon, ChatbotIcon, SongIcon, PointsIcon, BoltIcon, GameIcon } from "./Icons";

const featureIcons: Record<string, React.ReactNode> = {
  soundAlerts: <SoundAlertIcon size={30} color="#ff3b68" />,
  tts: <TTSIcon size={30} color="#38bdf8" />,
  overlays: <OverlayIcon size={30} color="#a855f7" />,
  chatbot: <ChatbotIcon size={30} color="#4ade80" />,
  songRequests: <SongIcon size={30} color="#f59e0b" />,
  points: <PointsIcon size={30} color="#ec4899" />,
  actions: <BoltIcon size={30} color="#e81548" />,
  gameIntegration: <GameIcon size={30} color="#6366f1" />,
};

const featureKeys = [
  "soundAlerts", "tts", "overlays", "chatbot",
  "songRequests", "points", "actions", "gameIntegration",
] as const;

export default function Features() {
  const { t } = useI18n();

  return (
    <section style={{ padding: "100px 20px", position: "relative" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 64px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: "700",
              color: "#ff3b68",
              backgroundColor: "rgba(232, 21, 72, 0.12)",
              border: "1px solid rgba(232, 21, 72, 0.35)",
              marginBottom: "16px",
            }}
          >
            تكاملات و أدوات متطورة
          </div>
          <h2 style={{ fontSize: "clamp(26px, 3.8vw, 42px)", fontWeight: "800", lineHeight: "1.35", letterSpacing: "0px", color: "#ffffff", marginBottom: "16px" }}>
            {t.features.title}
          </h2>
          <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: "1.8" }}>
            {t.features.subtitle}
          </p>
        </div>

        {/* Features Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {featureKeys.map((key) => {
            const feature = t.features[key];
            return (
              <Link
                key={key}
                href={`/features#${key}`}
                className="glass-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "32px",
                  borderRadius: "22px",
                  textDecoration: "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Icon Box */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                    boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.02)",
                  }}
                >
                  {featureIcons[key]}
                </div>

                {/* Content */}
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", marginBottom: "12px" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#94a3b8", flexGrow: 1 }}>
                  {feature.description}
                </p>

                {/* Arrow Link */}
                <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700", color: "#e81548" }}>
                  <span>استكشف المزيد</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

