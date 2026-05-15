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
    <section className="relative flex flex-col items-center overflow-hidden px-4 pb-8 pt-10 text-center sm:px-5 sm:pb-10 sm:pt-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[260px] w-[320px] -translate-x-1/2 rounded-full bg-d-gold/[0.04] blur-3xl [.light_&]:bg-l-gold/[0.06] sm:h-[360px] sm:w-[560px]" />

      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-d-gold/15 to-d-gold/5 text-3xl [.light_&]:from-l-gold/10 [.light_&]:to-l-gold/5 sm:mb-8 sm:h-20 sm:w-20 sm:text-4xl">
        ☽
      </div>

      <h1 className="relative mb-3 font-display text-4xl font-bold text-d-gold [.light_&]:text-l-gold sm:text-5xl">
        شفيع
      </h1>
      <p className="relative mb-7 max-w-md px-2 font-body text-sm leading-7 text-d-text-dim [.light_&]:text-l-text-dim sm:mb-10 sm:text-base">
        {lang === "ar"
          ? "مساعد إسلامي موثوق — ابحث في القرآن، التفسير، الحديث، والأذكار"
          : "Trusted Islamic Assistant — Search the Quran, Tafsir, Hadith, and Adhkar"}
      </p>

      <form onSubmit={handleSubmit} className="relative w-full max-w-xl" dir={lang === "ar" ? "rtl" : "ltr"}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={
            lang === "ar"
              ? "ابحث عن آية، موضوع، أذكار، أو اسأل سؤالاً..."
              : "Search for a verse, topic, adhkar, or ask a question..."
          }
          dir="auto"
          className="w-full rounded-2xl border border-d-border bg-d-surface/60 px-4 py-4 pe-14 font-body text-[16px] leading-6 text-d-text shadow-lg shadow-black/5 outline-none transition-colors placeholder:text-d-text-muted focus:border-d-gold/35 [.light_&]:border-l-border [.light_&]:bg-l-surface/90 [.light_&]:text-l-text [.light_&]:placeholder:text-l-text-muted [.light_&]:focus:border-l-gold/35 sm:px-6"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute end-2.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-d-gold/15 text-lg text-d-gold transition-colors hover:bg-d-gold/25 disabled:opacity-30 [.light_&]:bg-l-gold/10 [.light_&]:text-l-gold [.light_&]:hover:bg-l-gold/20"
          aria-label={lang === "ar" ? "بحث" : "Search"}
        >
          ↑
        </button>
      </form>

      <div className="relative mt-9 max-w-lg px-2 sm:mt-12">
        <p className="mb-2 font-body text-[10px] uppercase tracking-[0.2em] text-d-text-muted [.light_&]:text-l-text-muted">
          {lang === "ar" ? "آية اليوم" : "Verse of the Day"}
        </p>
        <p className="verse-glow font-quran text-xl leading-[2.2] text-d-gold/85 [.light_&]:text-l-gold sm:text-2xl">
          {verse.text}
        </p>
        <p className="mt-2 font-body text-xs text-d-text-muted [.light_&]:text-l-text-muted">
          سورة {verse.surah} — آية {verse.ayah}
        </p>
      </div>
    </section>
  );
}
