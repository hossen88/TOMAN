"use client";

import { I18nProvider, useI18n } from "@/i18n/context";
import { AuthProvider } from "@/i18n/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { locale } = useI18n();
  const pathname = usePathname();
  const isOverlay = pathname.startsWith("/overlay");

  useEffect(() => {
    const hideDevTools = () => {
      document.querySelectorAll("nextjs-portal").forEach(el => (el as HTMLElement).style.display = "none");
    };
    hideDevTools();
    const observer = new MutationObserver(hideDevTools);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Cairo:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          @font-face {
            font-family: 'Stranger';
            src: url('/fonts/Stranger-back-in-the-Night.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Designer';
            src: url('/fonts/Designer.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Chopsic';
            src: url('/fonts/Chopsic.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}</style>
      </head>
      <body style={{ fontFamily: "'Cairo', 'Inter', sans-serif", margin: 0, padding: 0, background: isOverlay ? "transparent" : "#0a0a0a" }}>
        {!isOverlay && <Navbar />}
        <main>{children}</main>
        {!isOverlay && <Footer />}
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <I18nProvider>
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </I18nProvider>
  );
}
