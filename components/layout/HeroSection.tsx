"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";

const VERSES_OF_DAY = [
  { text: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", surah: "الرعد", ayah: "٢٨" },
  { text: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ", surah: "الطلاق", ayah: "٣" },
  { text: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", surah: "الشرح", ayah: "٥" },
  { text: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", surah: "الضحى", ayah: "٥" },
  { text: "إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ", surah: "البقرة", ayah: "١٥٣" },
];

export default function HeroSection({ onSearch }: { onSearch: (q: string) => void }) {
  const { lang } = useApp();
  const [input, setInput] = useState("");
  const [verse] = useState(() => VERSES_OF_DAY[Math.floor(Math.random() * VERSES_OF_DAY.length)]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;

    onSearch(value);
    setInput("");
  };

  return (
    <section className="hero-field relative overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pb-16 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 mashrabiya opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-d-gold/10 [.light_&]:border-l-gold/10" />
      <div className="pointer-events-none absolute left-1/2 top-[-115px] h-[390px] w-[390px] -translate-x-1/2 rounded-full border border-d-gold/10 [.light_&]:border-l-gold/10" />

      <div className="relative mx-auto max-w-6xl text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-d-gold/20 bg-d-gold/[0.06] px-4 py-2 font-body text-[11px] tracking-[0.16em] text-d-gold [.light_&]:border-l-gold/20 [.light_&]:bg-l-gold/[0.06] [.light_&]:text-l-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          {lang === "ar" ? "القرآن · التفسير · الحديث · الأذكار" : "QURAN · TAFSIR · HADITH · ADHKAR"}
        </div>

        <p className="mb-2 font-display text-xl text-d-gold/70 [.light_&]:text-l-gold/70 sm:text-2xl">
          {lang === "ar" ? "اسأل، وابحث، وتدبّر" : "Ask, discover, reflect"}
        </p>
        <h1 className="hero-wordmark relative mx-auto mb-5 max-w-4xl font-display text-[72px] font-bold leading-none text-d-gold [.light_&]:text-l-gold sm:text-[116px]">
          شفيع
        </h1>
        <p className="relative mx-auto mb-9 max-w-2xl px-2 font-body text-base leading-8 text-d-text-dim [.light_&]:text-l-text-dim sm:mb-12 sm:text-lg">
          {lang === "ar"
            ? "مساحة هادئة للمعرفة الإسلامية الموثقة. إجابات واضحة من مصادر محددة، بلا ادّعاء ولا تخمين."
            : "A calm space for verified Islamic knowledge. Clear answers from defined sources, without invention or guesswork."}
        </p>

      <form onSubmit={handleSubmit} className="search-shell relative mx-auto w-full max-w-3xl" dir={lang === "ar" ? "rtl" : "ltr"}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={
            lang === "ar"
              ? "ابحث عن آية، موضوع، أذكار، أو اسأل سؤالاً..."
              : "Search for a verse, topic, adhkar, or ask a question..."
          }
          dir="auto"
          className="w-full rounded-[26px] border border-d-gold/25 bg-d-surface/80 px-5 py-5 pe-20 font-body text-[16px] leading-6 text-d-text shadow-2xl shadow-black/20 outline-none backdrop-blur-xl transition-colors placeholder:text-d-text-muted focus:border-d-gold/55 [.light_&]:border-l-gold/20 [.light_&]:bg-white/90 [.light_&]:text-l-text [.light_&]:placeholder:text-l-text-muted [.light_&]:focus:border-l-gold/45 sm:px-7 sm:py-6 sm:text-lg"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute end-2.5 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-[20px] bg-d-gold text-xl text-d-bg shadow-lg shadow-d-gold/10 transition-all hover:scale-[1.03] disabled:opacity-30 [.light_&]:bg-l-gold [.light_&]:text-white sm:end-3"
          aria-label={lang === "ar" ? "بحث" : "Search"}
        >
          {lang === "ar" ? "اسأل" : "Ask"}
        </button>
      </form>

      <div className="relative mx-auto mt-12 max-w-2xl border-t border-d-gold/15 px-2 pt-9 sm:mt-16">
        <p className="mb-3 font-body text-[11px] uppercase tracking-[0.28em] text-d-text-muted [.light_&]:text-l-text-muted">
          {lang === "ar" ? "آية اليوم" : "Verse of the Day"}
        </p>
        <p className="verse-glow font-quran text-2xl leading-[2.2] text-d-gold/90 [.light_&]:text-l-gold sm:text-3xl">
          {verse.text}
        </p>
        <p className="mt-2 font-body text-xs text-d-text-muted [.light_&]:text-l-text-muted">
          سورة {verse.surah} — آية {verse.ayah}
        </p>
      </div>
      </div>
    </section>
  );
}
