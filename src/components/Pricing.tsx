"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";

export default function Pricing() {
  const { t } = useI18n();
  const data = t.pricing.free;

  return (
    <section style={{ padding: "100px 24px", backgroundColor: "#0e0e0e" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px" }}>{t.pricing.title}</h2>
          <p style={{ marginTop: "16px", fontSize: "16px", color: "#888" }}>{t.pricing.subtitle}</p>
        </div>

        <div style={{ position: "relative", padding: "48px", backgroundColor: "#111", border: "2px solid #a51538", borderRadius: "24px", boxShadow: "0 20px 60px rgba(165, 21, 56, 0.15)" }}>
          <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", padding: "6px 24px", background: "linear-gradient(135deg, #a51538, #d4213d)", borderRadius: "50px", fontSize: "12px", fontWeight: "800", color: "#ffffff", letterSpacing: "1px" }}>
            FREE FOREVER
          </div>

          <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>{data.name}</h3>

          <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "36px" }}>
            <span style={{ fontSize: "64px", fontWeight: "900", color: "#ffffff" }}>{data.price}</span>
            <span style={{ fontSize: "16px", color: "#666" }}>{data.period}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "40px" }}>
            {data.features.map((feature, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#ccc" }}>
                <svg style={{ width: "18px", height: "18px", color: "#4ade80", flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                {feature}
              </div>
            ))}
          </div>

          <Link href="/get-started" style={{ display: "block", width: "100%", padding: "16px", textAlign: "center", fontSize: "16px", fontWeight: "700", color: "#ffffff", backgroundColor: "#a51538", borderRadius: "12px", textDecoration: "none" }}>
            {data.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
