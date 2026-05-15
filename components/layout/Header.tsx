"use client";
import { useApp } from "@/lib/context";

export default function Header() {
  const { theme, lang, toggleTheme, setLang } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-d-border dark:border-d-border light:border-l-border backdrop-blur-xl bg-d-bg/80 dark:bg-d-bg/80 [.light_&]:bg-l-bg/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-d-gold/20 to-d-gold/5 text-xl [.light_&]:from-l-gold/15 [.light_&]:to-l-gold/5">
            ☽
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-d-gold [.light_&]:text-l-gold leading-tight">شفيع</h1>
            <p className="text-[10px] text-d-text-muted [.light_&]:text-l-text-muted tracking-wide">
              {lang === "ar" ? "مساعد إسلامي موثوق" : "Trusted Islamic Assistant"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div className="flex overflow-hidden rounded-lg border border-d-border [.light_&]:border-l-border">
            <button onClick={() => setLang("ar")} className={`px-2.5 py-1.5 text-[11px] font-body transition-all ${lang === "ar" ? "bg-d-gold/15 text-d-gold [.light_&]:bg-l-gold/10 [.light_&]:text-l-gold" : "text-d-text-muted [.light_&]:text-l-text-muted"}`}>عربي</button>
            <button onClick={() => setLang("en")} className={`px-2.5 py-1.5 text-[11px] font-en transition-all ${lang === "en" ? "bg-d-gold/15 text-d-gold [.light_&]:bg-l-gold/10 [.light_&]:text-l-gold" : "text-d-text-muted [.light_&]:text-l-text-muted"}`}>EN</button>
          </div>

          {/* Theme */}
          <button onClick={toggleTheme} className="flex h-8 w-8 items-center justify-center rounded-lg border border-d-border [.light_&]:border-l-border text-sm text-d-text-muted [.light_&]:text-l-text-muted hover:text-d-gold [.light_&]:hover:text-l-gold transition-colors">
            {theme === "dark" ? "☀" : "☾"}
          </button>

          {/* Trust badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-d-border [.light_&]:border-l-border px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            <span className="text-[10px] text-d-text-muted [.light_&]:text-l-text-muted font-body">
              {lang === "ar" ? "مصادر موثقة فقط" : "Verified Sources Only"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
