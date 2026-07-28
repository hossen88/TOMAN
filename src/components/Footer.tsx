"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer style={{ borderTop: "1px solid #1a1a1a", backgroundColor: "#0a0a0a" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: "800", textDecoration: "none" }}>
              <img src="/logo.png" alt="TOMAN Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
              <span style={{ color: "#fff" }}>TOMAN</span>
            </Link>
            <p style={{ marginTop: "16px", fontSize: "14px", color: "#555", lineHeight: "1.7" }}>{t.footer.description}</p>
          </div>
          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "13px", fontWeight: "700", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>{t.footer.product}</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              <li><Link href="/features" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>{t.footer.features}</Link></li>
              <li><Link href="/docs" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>{t.footer.docs}</Link></li>
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "13px", fontWeight: "700", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>{t.footer.resources}</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              <li><Link href="/blog" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>{t.footer.blog}</Link></li>
              <li><Link href="/changelog" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>{t.footer.changelog}</Link></li>
              <li><Link href="/community" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>{t.footer.community}</Link></li>
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "13px", fontWeight: "700", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>{t.footer.company}</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
              <li><Link href="/about" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>{t.footer.about}</Link></li>
              <li><Link href="/contact" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>{t.footer.contact}</Link></li>
              <li><Link href="/privacy" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>{t.footer.privacy}</Link></li>
              <li><Link href="/terms" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>{t.footer.terms}</Link></li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #1a1a1a", textAlign: "center", fontSize: "13px", color: "#333" }}>
          &copy; 2026 TOMAN. {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
