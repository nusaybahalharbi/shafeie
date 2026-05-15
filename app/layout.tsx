import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "شفيع — مساعد إسلامي موثوق",
  description: "مساعد ذكاء اصطناعي موثوق للبحث الإسلامي. مصادر موثقة فقط: القرآن الكريم، تفسير ابن كثير، صحيح البخاري.",
  openGraph: {
    title: "شفيع — مساعد إسلامي موثوق",
    description: "مساعد ذكاء اصطناعي موثوق للبحث الإسلامي من مصادر موثقة",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Scheherazade+New:wght@400;700&family=Tajawal:wght@300;400;500;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
