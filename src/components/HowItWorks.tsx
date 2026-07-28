"use client";

import { useI18n } from "@/i18n/context";
import { LinkIcon, SettingsIcon, RocketIcon } from "./Icons";

const steps = ["step1", "step2", "step3"] as const;
const stepIcons = [
  <LinkIcon key="link" size={32} color="#e81548" />,
  <SettingsIcon key="settings" size={32} color="#38bdf8" />,
  <RocketIcon key="rocket" size={32} color="#4ade80" />,
];

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section style={{ padding: "100px 20px", position: "relative" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 64px" }}>
          <h2 style={{ fontSize: "clamp(26px, 3.8vw, 42px)", fontWeight: "800", color: "#ffffff", lineHeight: "1.35", letterSpacing: "0px", marginBottom: "16px" }}>
            {t.howItWorks.title}
          </h2>
          <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: "1.7" }}>{t.howItWorks.subtitle}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px" }}>
          {steps.map((step, i) => {
            const data = t.howItWorks[step];
            return (
              <div
                key={step}
                className="glass-card"
                style={{
                  padding: "36px 28px",
                  borderRadius: "24px",
                  position: "relative",
                }}
              >
                {/* Step Pill */}
                <div
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(232, 21, 72, 0.12)",
                    border: "1px solid rgba(232, 21, 72, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "900",
                    color: "#ff4d79",
                  }}
                >
                  0{i + 1}
                </div>

                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                  }}
                >
                  {stepIcons[i]}
                </div>

                <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", marginBottom: "12px" }}>{data.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#94a3b8" }}>{data.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

