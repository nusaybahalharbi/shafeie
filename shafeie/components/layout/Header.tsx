"use client";

import { useApp } from "@/lib/context";

export default function Header() {
  const { theme, lang, toggleTheme, setLang } = useApp();

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-d-border bg-d-bg/90 backdrop-blur-xl [.light_&]:border-l-border [.light_&]:bg-l-bg/90">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-d-gold/20 to-d-gold/5 text-lg [.light_&]:from-l-gold/15 [.light_&]:to-l-gold/5 sm:h-10 sm:w-10 sm:text-xl">
            ☽
          </div>

          <div className="min-w-0">
            <h1 className="font-display text-lg font-bold leading-none text-d-gold [.light_&]:text-l-gold sm:text-xl">
              شفيع
            </h1>
            <p className="mt-1 truncate font-body text-[10px] leading-none tracking-wide text-d-text-muted [.light_&]:text-l-text-muted sm:text-[11px]">
              {lang === "ar" ? "مساعد إسلامي موثوق" : "Trusted Islamic Assistant"}
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

          <div className="hidden items-center gap-1.5 rounded-xl border border-d-border px-3 py-2 [.light_&]:border-l-border md:flex">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            <span className="font-body text-[10px] text-d-text-muted [.light_&]:text-l-text-muted">
              {lang === "ar" ? "مصادر موثقة فقط" : "Verified Sources Only"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
