"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section style={{ position: "relative", overflow: "hidden", backgroundColor: "#0a0a0a" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(165, 21, 56, 0.12) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)", width: "900px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(165, 21, 56, 0.15) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div style={{ position: "relative", maxWidth: "1280px", margin: "0 auto", padding: "120px 24px 100px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 18px", backgroundColor: "rgba(165, 21, 56, 0.12)", border: "1px solid rgba(165, 21, 56, 0.25)", borderRadius: "50px", fontSize: "13px", fontWeight: "500", color: "#e8335a", marginBottom: "32px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t.hero.badge}
        </div>

        <h1 style={{ fontSize: "68px", fontWeight: "900", lineHeight: "1.05", letterSpacing: "-3px", marginBottom: "28px", color: "#ffffff", maxWidth: "900px", margin: "0 auto 28px" }}>
          {t.hero.title}
        </h1>

        <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "18px", lineHeight: "1.8", color: "#888", marginBottom: "44px" }}>
          {t.hero.subtitle}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "100px" }}>
          <Link
            href="/get-started"
            style={{
              padding: "16px 36px",
              fontSize: "16px",
              fontWeight: "700",
              color: "#ffffff",
              backgroundColor: "#a51538",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(165, 21, 56, 0.35)",
              transition: "all 0.3s",
              textDecoration: "none",
            }}
          >
            {t.hero.cta}
          </Link>
          <Link
            href="/docs"
            style={{
              padding: "16px 36px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#a3a3a3",
              backgroundColor: "#141414",
              border: "1px solid #333",
              borderRadius: "12px",
              textDecoration: "none",
            }}
          >
            {t.hero.ctaSecondary}
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px", maxWidth: "600px", margin: "0 auto" }}>
          {[
            { value: t.hero.stats.users, label: t.hero.stats.usersLabel },
            { value: t.hero.stats.streams, label: t.hero.stats.streamsLabel },
            { value: t.hero.stats.gifts, label: t.hero.stats.giftsLabel },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: "36px", fontWeight: "900", color: "#a51538" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#555", marginTop: "4px", fontWeight: "500" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
