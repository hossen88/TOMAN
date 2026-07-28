"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";

export default function CTA() {
  const { t } = useI18n();

  return (
    <section style={{ padding: "100px 24px", backgroundColor: "#0a0a0a" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ padding: "72px 48px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "24px", background: "linear-gradient(180deg, rgba(165,21,56,0.08) 0%, #111 100%)" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "900", color: "#ffffff", marginBottom: "20px", letterSpacing: "-1px" }}>{t.hero.title}</h2>
          <p style={{ maxWidth: "500px", margin: "0 auto 36px", fontSize: "16px", color: "#888", lineHeight: "1.7" }}>{t.hero.subtitle}</p>
          <Link href="/get-started" style={{ display: "inline-block", padding: "16px 36px", fontSize: "16px", fontWeight: "700", color: "#ffffff", backgroundColor: "#a51538", borderRadius: "12px", boxShadow: "0 8px 32px rgba(165, 21, 56, 0.35)", textDecoration: "none" }}>
            {t.hero.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
