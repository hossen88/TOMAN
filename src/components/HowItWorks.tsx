"use client";

import { useI18n } from "@/i18n/context";
import { LinkIcon, SettingsIcon, RocketIcon } from "./Icons";

const steps = ["step1", "step2", "step3"] as const;
const stepIcons = [<LinkIcon key="link" size={32} color="#a51538" />, <SettingsIcon key="settings" size={32} color="#a51538" />, <RocketIcon key="rocket" size={32} color="#a51538" />];

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section style={{ padding: "100px 24px", backgroundColor: "#0e0e0e", borderTop: "1px solid #1a1a1a" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px" }}>{t.howItWorks.title}</h2>
          <p style={{ marginTop: "16px", fontSize: "16px", color: "#888" }}>{t.howItWorks.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
          {steps.map((step, i) => {
            const data = t.howItWorks[step];
            return (
              <div key={step} style={{ textAlign: "center" }}>
                <div style={{ width: "88px", height: "88px", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#161616", border: "1px solid #262626", borderRadius: "22px" }}>
                  {stepIcons[i]}
                </div>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#a51538", marginBottom: "10px", letterSpacing: "3px" }}>
                  STEP {i + 1}
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", marginBottom: "12px" }}>{data.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#888" }}>{data.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
