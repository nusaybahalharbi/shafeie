import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "شفيع — مساعد بحث قرآني",
  description: "مساعد ذكاء اصطناعي موثوق للبحث القرآني والتفسير والإرشاد",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-nur-bg font-body text-nur-text antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
