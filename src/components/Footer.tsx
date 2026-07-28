"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "#050508", position: "relative" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "64px 20px 36px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "48px" }}>
          {/* Brand Col */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{ position: "relative", width: "32px", height: "32px" }}>
                <img src="/logo.png" alt="TOMAN Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
              </div>
              <span style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "-0.5px", color: "#ffffff" }}>
                TOMAN<span style={{ color: "#e81548" }}>.</span>
              </span>
            </Link>
            <p style={{ marginTop: "16px", fontSize: "14px", color: "#94a3b8", lineHeight: "1.7", maxWidth: "280px" }}>
              {t.footer.description}
            </p>

            {/* Live System Online Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "20px", padding: "6px 14px", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", borderRadius: "20px" }}>
              <span className="live-indicator-dot" />
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#10b981" }}>جميع الخوادم تعمل بنسبة 100%</span>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 style={{ marginBottom: "20px", fontSize: "13px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "1px", textTransform: "uppercase" }}>
              {t.footer.product}
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link href="/features" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}>
                  {t.footer.features}
                </Link>
              </li>
              <li>
                <Link href="/docs" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}>
                  {t.footer.docs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 style={{ marginBottom: "20px", fontSize: "13px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "1px", textTransform: "uppercase" }}>
              {t.footer.resources}
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link href="/docs" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none" }}>
                  دليل البدء السريع
                </Link>
              </li>
              <li>
                <Link href="/features#overlays" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none" }}>
                  روابط أوفراي OBS
                </Link>
              </li>
              <li>
                <Link href="/features#tts" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none" }}>
                  إعدادات الـ TTS
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h3 style={{ marginBottom: "20px", fontSize: "13px", fontWeight: "800", color: "#f1f5f9", letterSpacing: "1px", textTransform: "uppercase" }}>
              {t.footer.company}
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link href="/about" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none" }}>
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none" }}>
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "none" }}>
                  {t.footer.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ marginTop: "56px", paddingTop: "28px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", fontSize: "13px", color: "#64748b" }}>
          <div>&copy; 2026 TOMAN Engine. {t.footer.copyright}</div>
          <div style={{ display: "flex", gap: "20px" }}>
            <span>Crafted for TikTok Streamers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

