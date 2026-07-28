"use client";

export const dynamic = "force-dynamic";

import { useI18n } from "@/i18n/context";
import { GlobeIcon, UsersIcon, ShieldIcon } from "@/components/Icons";

export default function AboutPage() {
  const { t, locale } = useI18n();

  return (
    <div style={{ padding: "80px 20px 100px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: "50px", fontSize: "12px", fontWeight: "700", color: "#ff3b68", backgroundColor: "rgba(232, 21, 72, 0.12)", border: "1px solid rgba(232, 21, 72, 0.35)", marginBottom: "16px" }}>
            من نحن
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 50px)", fontWeight: "800", color: "#ffffff", lineHeight: "1.35", letterSpacing: "0px" }}>{t.about.title}</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="glass-card" style={{ padding: "40px", borderRadius: "24px" }}>
            <p style={{ fontSize: "17px", lineHeight: "1.8", color: "#94a3b8" }}>{t.about.description}</p>
          </div>

          <div className="glass-card" style={{ padding: "40px", borderRadius: "24px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", marginBottom: "16px" }}>
              {locale === "en" ? "Our Mission" : "مهمتنا"}
            </h2>
            <p style={{ fontSize: "17px", lineHeight: "1.8", color: "#94a3b8" }}>{t.about.mission}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {[
              { icon: <GlobeIcon size={32} color="#ff3b68" />, title: locale === "en" ? "Open Source" : "مفتوح المصدر", desc: locale === "en" ? "All our code is available on GitHub." : "كل الكود لدينا متاح على GitHub." },
              { icon: <UsersIcon size={32} color="#38bdf8" />, title: locale === "en" ? "Community Driven" : "مدعوم بالمجتمع", desc: locale === "en" ? "Built by streamers, for streamers." : "صُنع من قبل الستريمرز، للستريمرز." },
              { icon: <ShieldIcon size={32} color="#4ade80" />, title: locale === "en" ? "Privacy First" : "الخصوصية أولاً", desc: locale === "en" ? "We never store your credentials." : "لا نخزّن بيانات اعتمادك." },
            ].map((item) => (
              <div key={item.title} className="glass-card" style={{ padding: "32px 24px", borderRadius: "20px", textAlign: "center" }}>
                <div style={{ width: "60px", height: "60px", margin: "0 auto 20px", borderRadius: "16px", backgroundColor: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ffffff", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#94a3b8" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

