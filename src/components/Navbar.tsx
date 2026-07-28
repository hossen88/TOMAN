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
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid #262626",
        backgroundColor: "rgba(10, 10, 10, 0.95)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #a51538, #d4213d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span style={{ color: "#ffffff" }}>TOMAN</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: "14px", color: "#a3a3a3", transition: "color 0.2s", fontWeight: "500", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a3a3a3")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={toggleLocale}
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              fontWeight: "500",
              color: "#a3a3a3",
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {locale === "en" ? "عربي" : "EN"}
          </button>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 12px", backgroundColor: "#161616", border: "1px solid #262626", borderRadius: "10px", textDecoration: "none" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "7px", backgroundColor: "#222", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#a51538" }}>{user.displayName.charAt(0)}</span>
                  )}
                </div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#ccc" }}>{user.displayName}</span>
              </Link>
              <button
                onClick={logout}
                style={{ padding: "8px 14px", fontSize: "13px", fontWeight: "500", color: "#888", backgroundColor: "transparent", border: "1px solid #333", borderRadius: "8px", cursor: "pointer" }}
              >
                {t.nav.login === "تسجيل الدخول" ? "خروج" : "Logout"}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                backgroundColor: "#a51538",
                borderRadius: "10px",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
            >
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div style={{ borderTop: "1px solid #262626", padding: "16px 24px", backgroundColor: "#0a0a0a" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ display: "block", padding: "12px 0", fontSize: "15px", color: "#a3a3a3", textDecoration: "none" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
