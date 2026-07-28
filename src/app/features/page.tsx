"use client";

import { useI18n } from "@/i18n/context";
import { SoundAlertIcon, TTSIcon, OverlayIcon, ChatbotIcon, SongIcon, PointsIcon, BoltIcon, GameIcon } from "@/components/Icons";

const featureDetails = [
  {
    key: "soundAlerts",
    icon: <SoundAlertIcon size={48} color="#a51538" />,
    details: {
      en: ["Upload custom sounds for each gift type", "Set volume and cooldown timers", "Queue system to prevent overlapping", "Support for MP3, WAV, and OGG formats", "Random sound selection from playlists"],
      ar: ["ارفع أصوات مخصصة لكل نوع هدية", "عيّن مستوى الصوت وأوقات الانتظار", "نظام طلور لمنع التداخل", "دعم صيغ MP3 و WAV و OGG", "اختيار عشوائي من قوائم التشغيل"],
    },
  },
  {
    key: "tts",
    icon: <TTSIcon size={48} color="#a51538" />,
    details: {
      en: ["Multiple TTS voices (Google, Amazon Polly, Azure)", "Adjustable speed, pitch, and volume", "Custom text filters and sanitization", "Priority queue for subscribers", "Min/max character limits"],
      ar: ["أصوات TTS متعددة", "سرعة وطبقة ومستوى صوت قابل للتعديل", "فلاتر نصية مخصصة وتنقية", "قائمة أولوية للمشتركين", "حدود أدنى/أعلى للأحرف"],
    },
  },
  {
    key: "overlays",
    icon: <OverlayIcon size={48} color="#a51538" />,
    details: {
      en: ["Pre-built overlay templates", "Custom CSS injection for full control", "Animated alerts and transitions", "Responsive design for any resolution", "Browser source links for easy setup"],
      ar: ["قوالب أوفراي جاهزة", "حقن CSS مخصص للتحكم الكامل", "تنبيهات وانتقالات متحركة", "تصميم متجاوب لأي دقة", "روابط مصدر المتصفح للإعداد السهل"],
    },
  },
  {
    key: "chatbot",
    icon: <ChatbotIcon size={48} color="#a51538" />,
    details: {
      en: ["Auto-respond to keywords", "Custom commands with parameters", "Anti-spam and flood protection", "Welcome messages for new viewers", "Scheduled messages and reminders"],
      ar: ["رد تلقائي على الكلمات المفتاحية", "أوامر مخصصة مع معايير", "حماية من السبام والفيضان", "رسائل ترحيب للمشاهدين الجدد", "رسائل وتنبيهات مجدولة"],
    },
  },
  {
    key: "songRequests",
    icon: <SongIcon size={48} color="#a51538" />,
    details: {
      en: ["Spotify integration", "Point-based request system", "Blacklist specific songs or artists", "Auto-DJ mode for continuous playback", "Now playing overlay"],
      ar: ["تكامل مع سبوتيفاي", "نظام طلبات مبني على النقاط", "قائمة سوداء لأغاني معينة", "وضع DJ تلقائي للتشغيل المستمر", "أوفراي يُشغّل الآن"],
    },
  },
  {
    key: "points",
    icon: <PointsIcon size={48} color="#a51538" />,
    details: {
      en: ["Earn points for watching time", "Bonus points for gifts and follows", "Redeem points for TTS, sounds, commands", "Leaderboard overlay", "Custom point currencies"],
      ar: ["اكسب نقاطاً لوقت المشاهدة", "نقاط إضافية للهدايا والمتابعين", "اصرف النقاط على TTS وأصوات وأوامر", "أوفراي لوحة المتصدرين", "عملات نقاط مخصصة"],
    },
  },
  {
    key: "actions",
    icon: <BoltIcon size={48} color="#a51538" />,
    details: {
      en: ["IFTTT-style trigger/action system", "Smart device integration (Philips Hue, etc.)", "Keystroke simulation on Windows", "Webhook support for custom integrations", "Event history and logging"],
      ar: ["نظام محفز/إجراء بأسلوب IFTTT", "دمج الأجهزة الذكية", "محاكاة الضغط على المفاتيح في ويندوز", "دعم Webhook للتكاملات المخصصة", "سجل الأحداث والتوثيق"],
    },
  },
  {
    key: "gameIntegration",
    icon: <GameIcon size={48} color="#a51538" />,
    details: {
      en: ["Minecraft: Spawn mobs, give items, weather control", "GTA 5: Spawn vehicles, change weather, NPC control", "Custom game integration via Events API", "Gift-to-action mapping dashboard", "Real-time game state monitoring"],
      ar: ["ماينكرافت: استدعاء كائنات، التحكم بالطقس", "GTA 5: استدعاء مركبات، التحكم بالـ NPC", "دمج ألعاب مخصص عبر Events API", "لوحة تحكم ربط الهدايا بالإجراءات", "مراقبة حالة اللعبة في الوقت الفعلي"],
    },
  },
];

export default function FeaturesPage() {
  const { t, locale } = useI18n();

  return (
    <div style={{ padding: "80px 24px", backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "900", color: "#ffffff", letterSpacing: "-2px" }}>{t.features.title}</h1>
          <p style={{ marginTop: "16px", fontSize: "18px", color: "#888" }}>{t.features.subtitle}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
          {featureDetails.map((feature, i) => (
            <div key={feature.key} id={feature.key} style={{ display: "flex", flexDirection: i % 2 === 0 ? "row" : "row-reverse", alignItems: "center", gap: "64px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "18px", backgroundColor: "rgba(165, 21, 56, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  {feature.icon}
                </div>
                <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#ffffff", marginBottom: "16px", letterSpacing: "-1px" }}>
                  {(t.features[feature.key as keyof typeof t.features] as { title: string }).title}
                </h2>
                <p style={{ fontSize: "16px", color: "#888", lineHeight: "1.8", marginBottom: "28px" }}>
                  {(t.features[feature.key as keyof typeof t.features] as { description: string }).description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {feature.details[locale].map((detail, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "15px", color: "#ccc" }}>
                      <svg style={{ width: "20px", height: "20px", color: "#a51538", flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ aspectRatio: "16/10", backgroundColor: "#111", border: "1px solid #222", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ opacity: 0.3 }}>{feature.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
