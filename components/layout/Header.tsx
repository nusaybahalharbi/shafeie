"use client";

import { useApp } from "@/lib/context";

export default function Header() {
  const { theme, lang, toggleTheme, setLang } = useApp();

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-d-border bg-d-bg/75 backdrop-blur-2xl [.light_&]:border-l-border [.light_&]:bg-l-bg/80">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 shrink items-center gap-3">
          <div className="brand-seal flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-d-gold/35 text-lg text-d-gold [.light_&]:border-l-gold/30 [.light_&]:text-l-gold sm:h-11 sm:w-11">
            ش
          </div>

          <div className="min-w-0 whitespace-nowrap text-right">
            <h1 className="font-display text-xl font-bold leading-[1.15] text-d-gold [.light_&]:text-l-gold sm:text-2xl">
              شفيع
            </h1>
            <p className="mt-1.5 font-body text-[9px] leading-[1.35] tracking-normal text-d-text-muted [.light_&]:text-l-text-muted min-[390px]:text-[10px] sm:text-[11px]">
              {lang === "ar" ? "معرفة موثقة بهدوء" : "Verified knowledge with clarity"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex overflow-hidden rounded-xl border border-d-border [.light_&]:border-l-border">
            <button
              onClick={() => setLang("ar")}
              className={`min-h-9 px-2.5 font-body text-[11px] transition-colors sm:px-3 ${
                lang === "ar"
                  ? "bg-d-gold/15 text-d-gold [.light_&]:bg-l-gold/10 [.light_&]:text-l-gold"
                  : "text-d-text-muted [.light_&]:text-l-text-muted"
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLang("en")}
              className={`min-h-9 px-2.5 font-en text-[11px] transition-colors sm:px-3 ${
                lang === "en"
                  ? "bg-d-gold/15 text-d-gold [.light_&]:bg-l-gold/10 [.light_&]:text-l-gold"
                  : "text-d-text-muted [.light_&]:text-l-text-muted"
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-d-border text-sm text-d-text-muted transition-colors hover:text-d-gold [.light_&]:border-l-border [.light_&]:text-l-text-muted [.light_&]:hover:text-l-gold"
            aria-label={lang === "ar" ? "تغيير الوضع" : "Toggle theme"}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-d-border bg-d-surface/40 px-4 py-2 [.light_&]:border-l-border [.light_&]:bg-l-surface/70 md:flex">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.7)]" />
            <span className="font-body text-[10px] text-d-text-muted [.light_&]:text-l-text-muted">
              {lang === "ar" ? "مصادر موثقة فقط" : "Verified Sources Only"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
