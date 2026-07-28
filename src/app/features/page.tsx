"use client";

export const dynamic = "force-dynamic";

import { useI18n } from "@/i18n/context";
import { SoundAlertIcon, TTSIcon, OverlayIcon, ChatbotIcon, SongIcon, PointsIcon, BoltIcon, GameIcon } from "@/components/Icons";

const featureDetails = [
  {
    key: "soundAlerts",
    icon: <SoundAlertIcon size={40} color="#ff3b68" />,
    details: {
      en: ["Upload custom sounds for each gift type", "Set volume and cooldown timers", "Queue system to prevent overlapping", "Support for MP3, WAV, and OGG formats", "Random sound selection from playlists"],
      ar: ["ارفع أصوات مخصصة لكل نوع هدية", "عيّن مستوى الصوت وأوقات الانتظار", "نظام طابور مخصص لمنع التداخل", "دعم صيغ MP3 و WAV و OGG", "اختيار عشوائي من قوائم التشغيل"],
    },
  },
  {
    key: "tts",
    icon: <TTSIcon size={40} color="#38bdf8" />,
    details: {
      en: ["Multiple TTS voices (Google, Amazon Polly, Azure)", "Adjustable speed, pitch, and volume", "Custom text filters and sanitization", "Priority queue for subscribers", "Min/max character limits"],
      ar: ["أصوات قراءة ذكية متعددة", "سرعة وطبقة ومستوى صوت قابل للتعديل", "فلاتر نصية مخصصة وتنقية الكلمات", "قائمة أولوية للمشتركين", "حدود أدنى وأعلى للأحرف"],
    },
  },
  {
    key: "overlays",
    icon: <OverlayIcon size={40} color="#a855f7" />,
    details: {
      en: ["Pre-built overlay templates", "Custom CSS injection for full control", "Animated alerts and transitions", "Responsive design for any resolution", "Browser source links for easy setup"],
      ar: ["قوالب أوفراي احترافية جاهزة", "حقن CSS مخصص للتحكم الكامل", "تنبيهات وانتقالات متحركة", "تصميم متجاوب لأي دقة شاشة", "روابط مصدر متصفح سهلة الإعداد"],
    },
  },
  {
    key: "chatbot",
    icon: <ChatbotIcon size={40} color="#4ade80" />,
    details: {
      en: ["Auto-respond to keywords", "Custom commands with parameters", "Anti-spam and flood protection", "Welcome messages for new viewers", "Scheduled messages and reminders"],
      ar: ["رد تلقائي على الكلمات المفتاحية", "أوامر شات مخصصة مع معايير", "حماية ذكية من السبام والفيضان", "رسائل ترحيب للمشاهدين الجدد", "رسائل وتنبيهات مجدولة تلقائياً"],
    },
  },
  {
    key: "songRequests",
    icon: <SongIcon size={40} color="#f59e0b" />,
    details: {
      en: ["Spotify integration", "Point-based request system", "Blacklist specific songs or artists", "Auto-DJ mode for continuous playback", "Now playing overlay"],
      ar: ["تكامل مباشر مع Spotify", "نظام طلبات مبني على النقاط", "قائمة حظر لأغاني أو فنانين معينين", "وضع DJ تلقائي للتشغيل المستمر", "أوفراي يُشغّل الآن ذكي"],
    },
  },
  {
    key: "points",
    icon: <PointsIcon size={40} color="#ec4899" />,
    details: {
      en: ["Earn points for watching time", "Bonus points for gifts and follows", "Redeem points for TTS, sounds, commands", "Leaderboard overlay", "Custom point currencies"],
      ar: ["تجميع نقاط تلقائياً مع مدة المشاهدة", "نقاط إضافية للهدايا والمتابعين الجدد", "استبدال النقاط بأصوات وTTS وأوامر", "أوفراي متصدرين بث مباشر", "تخصيص اسم وعملة النقاط"],
    },
  },
  {
    key: "actions",
    icon: <BoltIcon size={40} color="#e81548" />,
    details: {
      en: ["IFTTT-style trigger/action system", "Smart device integration (Philips Hue, etc.)", "Keystroke simulation on Windows", "Webhook support for custom integrations", "Event history and logging"],
      ar: ["نظام محفز/إجراء ذكي متكامل", "ربط مع الأجهزة والأنوار الذكية", "محاكاة الضغط على مفاتيح الكيبورد في ويندوز", "دعم Webhook لتطبيقاتك المخصصة", "سجل كامل للأحداث والعمليات"],
    },
  },
  {
    key: "gameIntegration",
    icon: <GameIcon size={40} color="#6366f1" />,
    details: {
      en: ["Minecraft: Spawn mobs, give items, weather control", "GTA 5: Spawn vehicles, change weather, NPC control", "Custom game integration via Events API", "Gift-to-action mapping dashboard", "Real-time game state monitoring"],
      ar: ["ماينكرافت: استدعاء وحوش والتحكم بالطقس عبر الهدايا", "GTA 5: استدعاء سيارات والتحكم بالطقس للشخصية", "ربط أي لعبة مخصصة عبر Events API", "لوحة ربط الهدايا بالأحداث داخل اللعبة", "مراقبة حالة اللعبة في الوقت الفعلي"],
    },
  },
];

export default function FeaturesPage() {
  const { t, locale } = useI18n();

  return (
    <div style={{ padding: "80px 20px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div className="badge-crimson" style={{ display: "inline-block", padding: "6px 18px", borderRadius: "50px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "16px" }}>
            دليل الميزات والأدوات الشامل
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "900", color: "#ffffff", letterSpacing: "-1.5px" }}>{t.features.title}</h1>
          <p style={{ marginTop: "16px", fontSize: "18px", color: "#94a3b8", maxWidth: "600px", margin: "16px auto 0" }}>{t.features.subtitle}</p>
        </div>

        {/* Feature Cards List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
          {featureDetails.map((feature, i) => (
            <div
              key={feature.key}
              id={feature.key}
              className="glass-card"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                alignItems: "center",
                gap: "48px",
                padding: "48px",
                borderRadius: "32px",
              }}
            >
              <div>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  {feature.icon}
                </div>

                <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", marginBottom: "16px", letterSpacing: "-0.5px" }}>
                  {(t.features[feature.key as keyof typeof t.features] as { title: string }).title}
                </h2>
                <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: "1.8", marginBottom: "28px" }}>
                  {(t.features[feature.key as keyof typeof t.features] as { description: string }).description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {feature.details[locale].map((detail, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#e2e8f0", fontWeight: "600" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "6px", backgroundColor: "rgba(232, 21, 72, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e81548" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic Box */}
              <div>
                <div
                  style={{
                    aspectRatio: "16/10",
                    borderRadius: "24px",
                    backgroundColor: "rgba(10, 10, 16, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "inset 0 0 40px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  <div style={{ transform: "scale(1.4)", filter: "drop-shadow(0 0 30px rgba(232, 21, 72, 0.3))" }}>{feature.icon}</div>
                  <div style={{ marginTop: "20px", fontSize: "13px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
                    TOMAN Interactive Engine
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

