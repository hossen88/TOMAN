"use client";

import { useI18n } from "@/i18n/context";
import { TikTokIcon, OBSIcon, StreamlabsIcon, MeldIcon } from "./Icons";

const software = [
  { name: "tiktokStudio" as const, icon: <TikTokIcon size={28} color="#a51538" /> },
  { name: "obs" as const, icon: <OBSIcon size={28} color="#a51538" /> },
  { name: "streamlabs" as const, icon: <StreamlabsIcon size={28} color="#a51538" /> },
  { name: "meld" as const, icon: <MeldIcon size={28} color="#a51538" /> },
];

export default function Compatibility() {
  const { t } = useI18n();

  return (
    <section style={{ padding: "100px 24px", backgroundColor: "#0a0a0a" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "40px", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px" }}>{t.compatibility.title}</h2>
        <p style={{ marginTop: "16px", fontSize: "16px", color: "#888" }}>{t.compatibility.subtitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginTop: "48px" }}>
          {software.map((sw) => (
            <div key={sw.name} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "18px 28px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "14px" }}>
              {sw.icon}
              <span style={{ fontWeight: "600", color: "#ddd", fontSize: "15px" }}>{t.compatibility[sw.name]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
