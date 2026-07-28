"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";
import { SoundAlertIcon, TTSIcon, OverlayIcon, ChatbotIcon, SongIcon, PointsIcon, BoltIcon, GameIcon } from "./Icons";

const featureIcons: Record<string, React.ReactNode> = {
  soundAlerts: <SoundAlertIcon size={32} color="#a51538" />,
  tts: <TTSIcon size={32} color="#a51538" />,
  overlays: <OverlayIcon size={32} color="#a51538" />,
  chatbot: <ChatbotIcon size={32} color="#a51538" />,
  songRequests: <SongIcon size={32} color="#a51538" />,
  points: <PointsIcon size={32} color="#a51538" />,
  actions: <BoltIcon size={32} color="#a51538" />,
  gameIntegration: <GameIcon size={32} color="#a51538" />,
};

const featureKeys = [
  "soundAlerts", "tts", "overlays", "chatbot",
  "songRequests", "points", "actions", "gameIntegration",
] as const;

export default function Features() {
  const { t } = useI18n();

  return (
    <section style={{ padding: "100px 24px", backgroundColor: "#0a0a0a" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px" }}>{t.features.title}</h2>
          <p style={{ marginTop: "16px", fontSize: "16px", color: "#888" }}>{t.features.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "20px" }}>
          {featureKeys.map((key) => {
            const feature = t.features[key];
            return (
              <Link
                key={key}
                href={`/features#${key}`}
                style={{
                  display: "block",
                  padding: "32px",
                  backgroundColor: "#111",
                  border: "1px solid #222",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#a51538";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(165, 21, 56, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#222";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(165, 21, 56, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  {featureIcons[key]}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", marginBottom: "10px" }}>{feature.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#888" }}>{feature.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
