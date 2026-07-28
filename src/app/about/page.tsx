"use client";

import { useI18n } from "@/i18n/context";
import { GlobeIcon, UsersIcon, ShieldIcon } from "@/components/Icons";

export default function AboutPage() {
  const { t, locale } = useI18n();

  return (
    <div style={{ padding: "80px 24px", backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#ffffff", letterSpacing: "-2px" }}>{t.about.title}</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ padding: "36px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "20px" }}>
            <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#ccc" }}>{t.about.description}</p>
          </div>

          <div style={{ padding: "36px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "20px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>
              {locale === "en" ? "Our Mission" : "مهمتنا"}
            </h2>
            <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#ccc" }}>{t.about.mission}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {[
              { icon: <GlobeIcon size={36} color="#a51538" />, title: locale === "en" ? "Open Source" : "مفتوح المصدر", desc: locale === "en" ? "All our code is available on GitHub." : "كل الكود لدينا متاح على GitHub." },
              { icon: <UsersIcon size={36} color="#a51538" />, title: locale === "en" ? "Community Driven" : "مدعوم بالمجتمع", desc: locale === "en" ? "Built by streamers, for streamers." : "صُنع من قبل الستريمرز، للستريمرز." },
              { icon: <ShieldIcon size={36} color="#a51538" />, title: locale === "en" ? "Privacy First" : "الخصوصية أولاً", desc: locale === "en" ? "We never store your credentials." : "لا نخزّن بيانات اعتمادك." },
            ].map((item) => (
              <div key={item.title} style={{ padding: "32px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "20px", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", margin: "0 auto 16px", borderRadius: "16px", backgroundColor: "rgba(165, 21, 56, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#888" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
