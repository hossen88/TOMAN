"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { useAuth } from "@/i18n/auth";
import Link from "next/link";

export default function Navbar() {
  const { t, locale, toggleLocale } = useI18n();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/features", label: t.nav.features },
    { href: "/docs", label: t.nav.docs },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, padding: "12px 16px" }}>
      <nav
        className="glass-panel"
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          borderRadius: "16px",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ position: "relative", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: "-4px", borderRadius: "10px", background: "radial-gradient(circle, rgba(232,21,72,0.6) 0%, transparent 70%)", filter: "blur(6px)" }} />
            <img src="/logo.png" alt="TOMAN Logo" style={{ width: "32px", height: "32px", objectFit: "contain", position: "relative", zIndex: 1 }} />
          </div>
          <span style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "-0.5px", color: "#ffffff" }}>
            TOMAN<span style={{ color: "#e81548" }}>.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }} className="hidden-mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                fontWeight: "600",
                textDecoration: "none",
                transition: "all 0.2s ease",
                padding: "6px 14px",
                borderRadius: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions & Locale Cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            style={{
              height: "38px",
              padding: "0 14px",
              fontSize: "13px",
              fontWeight: "700",
              color: "#e2e8f0",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(232, 21, 72, 0.4)";
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e81548" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{locale === "en" ? "عربي" : "EN"}</span>
          </button>

          {/* User Logged In / Login CTA */}
          {user ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", direction: "ltr" }}>
              <Link
                href="/dashboard"
                style={{
                  height: "38px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 14px 0 6px",
                  backgroundColor: "rgba(232, 21, 72, 0.12)",
                  border: "1px solid rgba(232, 21, 72, 0.35)",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ width: "26px", height: "26px", borderRadius: "6px", backgroundColor: "#e81548", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "12px", fontWeight: "900", color: "#ffffff", lineHeight: 1 }}>
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>
                  {user.displayName}
                </span>
              </Link>

              <button
                onClick={logout}
                title={locale === "ar" ? "تسجيل الخروج" : "Logout"}
                style={{
                  height: "38px",
                  width: "38px",
                  padding: 0,
                  color: "#94a3b8",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ff4d4d";
                  e.currentTarget.style.borderColor = "rgba(255, 77, 77, 0.4)";
                  e.currentTarget.style.backgroundColor = "rgba(255, 77, 77, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="gradient-btn-crimson"
              style={{
                height: "38px",
                padding: "0 18px",
                fontSize: "13px",
                fontWeight: "700",
                color: "#ffffff",
                borderRadius: "10px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxSizing: "border-box",
              }}
            >
              <span>{t.nav.login}</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              height: "38px",
              width: "38px",
              padding: 0,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              color: "#ffffff",
              cursor: "pointer",
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
            className="mobile-toggle"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="glass-panel"
          style={{
            maxWidth: "1240px",
            margin: "8px auto 0",
            borderRadius: "14px",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ padding: "10px", fontSize: "15px", fontWeight: "600", color: "#e2e8f0", textDecoration: "none" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

