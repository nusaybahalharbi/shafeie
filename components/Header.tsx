"use client";

export default function Header({ lang, onLangChange }: { lang: "ar" | "en"; onLangChange: (l: "ar" | "en") => void }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-nur-gold/[0.08] bg-nur-bg/95 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-nur-gold to-[#8a6e3e] text-lg shadow-lg shadow-nur-gold-glow">☽</div>
        <div>
          <h1 className="font-display text-xl font-bold text-nur-gold">شفيع</h1>
          <p className="text-[10px] text-nur-text-faint">{lang === "ar" ? "مساعد بحث قرآني" : "Quran Research Assistant"}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex rounded-full border border-nur-gold/[0.15] overflow-hidden">
          <button onClick={() => onLangChange("ar")} className={`px-3 py-1.5 text-[11px] font-body transition-all ${lang === "ar" ? "bg-nur-gold/20 text-nur-gold" : "text-nur-text-faint hover:text-nur-text-dim"}`}>عربي</button>
          <button onClick={() => onLangChange("en")} className={`px-3 py-1.5 text-[11px] font-body transition-all ${lang === "en" ? "bg-nur-gold/20 text-nur-gold" : "text-nur-text-faint hover:text-nur-text-dim"}`}>EN</button>
        </div>
        <div className="hidden rounded-full border border-nur-gold/[0.12] px-3 py-1.5 text-[10px] text-nur-text-faint sm:block">
          {lang === "ar" ? "القرآن · ابن كثير · صحيح البخاري" : "Quran · Ibn Kathir · Sahih al-Bukhari"}
        </div>
      </div>
    </header>
  );
}
