"use client";

import { useI18n } from "@/i18n/context";

export default function DocsPage() {
  const { t, locale } = useI18n();

  const sections = [
    {
      title: locale === "en" ? "Quick Start Guide" : "دليل البدء السريع",
      items: [
        { title: locale === "en" ? "1. Create Your Account" : "١. أنشئ حسابك", content: locale === "en" ? "Sign up with your TikTok account. Takes less than 30 seconds." : "سجّل بحسابك على تيك توك. أقل من ٣٠ ثانية." },
        { title: locale === "en" ? "2. Configure Sound Alerts" : "٢. كوّن التنبيهات الصوتية", content: locale === "en" ? "Upload your custom sounds and map them to gift types." : "ارفع أصواتك واربطها بأنواع الهدايا." },
        { title: locale === "en" ? "3. Add Browser Sources" : "٣. أضف مصادر المتصفح", content: locale === "en" ? "Copy URLs from your dashboard and add to OBS or TikTok LIVE Studio." : "انسخ الروابط من لوحة التحكم وأضفها إلى OBS أو TikTok LIVE Studio." },
      ],
    },
    {
      title: locale === "en" ? "OBS Studio Setup" : "إعداد OBS Studio",
      items: [
        { title: locale === "en" ? "Adding Browser Sources" : "إضافة مصادر المتصفح", content: locale === "en" ? 'Click "+" in Sources, select Browser, paste URL, set 1920x1080.' : 'اضغط "+" في المصادر، اختر Browser، الصق الرابط، عيّن ١٩٢٠x١٠٨٠.' },
      ],
    },
    {
      title: locale === "en" ? "Troubleshooting" : "حل المشاكل",
      items: [
        { title: locale === "en" ? "Alerts Not Working" : "التنبيهات لا تعمل", content: locale === "en" ? "Check your TikTok connection and browser source status." : "تحقق من اتصال تيك توك وحالة مصدر المتصفح." },
        { title: locale === "en" ? "TTS Not Playing" : "TTS لا يُشغّل", content: locale === "en" ? "Verify browser audio permissions and volume settings." : "تأكد من أذونات صوت المتصفح وإعدادات الصوت." },
      ],
    },
  ];

  return (
    <div style={{ padding: "80px 24px", backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#ffffff", letterSpacing: "-2px" }}>{t.docs.title}</h1>
          <p style={{ marginTop: "16px", fontSize: "18px", color: "#888" }}>{t.docs.subtitle}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {sections.map((section) => (
            <div key={section.title}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#ffffff", marginBottom: "20px" }}>{section.title}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {section.items.map((item) => (
                  <div key={item.title} style={{ padding: "24px", backgroundColor: "#111", border: "1px solid #222", borderRadius: "16px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>{item.title}</h3>
                    <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#888" }}>{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
