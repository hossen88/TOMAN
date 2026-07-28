"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";

export default function CTA() {
  const { t } = useI18n();

  return (
    <section style={{ padding: "80px 20px 100px", position: "relative" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div
          className="glass-card"
          style={{
            padding: "64px 32px",
            borderRadius: "32px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(232, 21, 72, 0.15) 0%, rgba(15, 15, 22, 0.8) 100%)",
            border: "1px solid rgba(232, 21, 72, 0.3)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(232, 21, 72, 0.15)",
          }}
        >
          <h2 style={{ fontSize: "clamp(26px, 3.8vw, 40px)", fontWeight: "800", color: "#ffffff", marginBottom: "16px", lineHeight: "1.35", letterSpacing: "0px" }}>
            جاهز لترقية بثك المباشر اليوم؟
          </h2>
          <p style={{ maxWidth: "560px", margin: "0 auto 36px", fontSize: "16px", color: "#94a3b8", lineHeight: "1.8" }}>
            انضم إلى مئات صناع المحتوى والستريمرز الذين يثقون بمنصة تومان لبناء بثوث تفاعلية احترافية ومجانية بالكامل.
          </p>
          <Link
            href="/login"
            className="gradient-btn-crimson"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 40px",
              fontSize: "16px",
              fontWeight: "800",
              color: "#ffffff",
              borderRadius: "14px",
              textDecoration: "none",
            }}
          >
            <span>{t.hero.cta}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

