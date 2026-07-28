"use client";

export const dynamic = "force-dynamic";

import { useI18n } from "@/i18n/context";

export default function DocsPage() {
  const { t, locale } = useI18n();

  const sections = [
    {
      title: locale === "en" ? "Quick Start Guide" : "دليل البدء السريع",
      items: [
        { title: locale === "en" ? "1. Create Your Account" : "1. أنشئ حسابك", content: locale === "en" ? "Sign up with your TikTok account. Takes less than 30 seconds." : "سجّل بحسابك على تيك توك. العملية تستغرق أقل من 30 ثانية." },
        { title: locale === "en" ? "2. Configure Sound Alerts" : "2. كوّن التنبيهات الصوتية", content: locale === "en" ? "Upload your custom sounds and map them to gift types." : "ارفع أصواتك المخصصة واربطها بنوع الهدايا المناسب." },
        { title: locale === "en" ? "3. Add Browser Sources" : "3. أضف مصادر المتصفح", content: locale === "en" ? "Copy URLs from your dashboard and add to OBS or TikTok LIVE Studio." : "انسخ الرابط المخصص من لوحة التحكم وأضفه كمصدر متصفح إلى OBS أو TikTok LIVE Studio." },
      ],
    },
    {
      title: locale === "en" ? "OBS Studio Setup" : "إعداد OBS Studio",
      items: [
        { title: locale === "en" ? "Adding Browser Sources" : "إضافة مصادر المتصفح", content: locale === "en" ? 'Click "+" in Sources, select Browser, paste URL, set 1920x1080.' : 'اضغط "+" في قائمة المصادر، اختر Browser، الصق الرابط وعيّن الدقة إلى 1920x1080.' },
      ],
    },
    {
      title: locale === "en" ? "Troubleshooting" : "حل المشاكل وإصلاح الأخطاء",
      items: [
        { title: locale === "en" ? "Alerts Not Working" : "التنبيهات لا تعمل", content: locale === "en" ? "Check your TikTok connection and browser source status." : "تحقق من حالة الاتصال بحساب تيك توك وتأكد من استجابة رابط مصدر المتصفح." },
        { title: locale === "en" ? "TTS Not Playing" : "الصوت الصوتية TTS لا يشتغل", content: locale === "en" ? "Verify browser audio permissions and volume settings." : "تأكد من تفعيل إذن تشغيل الصوت التلقائي في المتصفح ومستوى الصوت." },
      ],
    },
  ];

  return (
    <div style={{ padding: "80px 20px 100px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: "50px", fontSize: "12px", fontWeight: "700", color: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.35)", marginBottom: "16px" }}>
            التوثيق والدعم الفني
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 50px)", fontWeight: "800", color: "#ffffff", lineHeight: "1.35", letterSpacing: "0px" }}>{t.docs.title}</h1>
          <p style={{ marginTop: "12px", fontSize: "17px", color: "#94a3b8", lineHeight: "1.7" }}>{t.docs.subtitle}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {sections.map((section) => (
            <div key={section.title}>
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", marginBottom: "20px", borderRight: "4px solid #e81548", paddingRight: "14px" }}>{section.title}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {section.items.map((item) => (
                  <div key={item.title} className="glass-card" style={{ padding: "28px", borderRadius: "20px" }}>
                    <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#ffffff", marginBottom: "10px" }}>{item.title}</h3>
                    <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#94a3b8" }}>{item.content}</p>
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

