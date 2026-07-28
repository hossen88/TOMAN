"use client";

import { useI18n } from "@/i18n/context";
import { TikTokIcon, OBSIcon, StreamlabsIcon, MeldIcon } from "./Icons";

const software = [
  { name: "tiktokStudio" as const, icon: <TikTokIcon size={28} color="#ff3b68" /> },
  { name: "obs" as const, icon: <OBSIcon size={28} color="#38bdf8" /> },
  { name: "streamlabs" as const, icon: <StreamlabsIcon size={28} color="#4ade80" /> },
  { name: "meld" as const, icon: <MeldIcon size={28} color="#a855f7" /> },
];

export default function Compatibility() {
  const { t } = useI18n();

  return (
    <section style={{ padding: "80px 20px", position: "relative" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: "800", color: "#ffffff", lineHeight: "1.35", letterSpacing: "0px", marginBottom: "12px" }}>
          {t.compatibility.title}
        </h2>
        <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: "1.7" }}>{t.compatibility.subtitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "44px" }}>
          {software.map((sw) => (
            <div
              key={sw.name}
              className="glass-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "20px 32px",
                borderRadius: "18px",
              }}
            >
              {sw.icon}
              <span style={{ fontWeight: "800", color: "#ffffff", fontSize: "16px" }}>{t.compatibility[sw.name]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

