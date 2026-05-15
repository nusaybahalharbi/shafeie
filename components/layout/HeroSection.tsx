"use client";
import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) { onSearch(input); setInput(""); }
  };

  return (
    <section className="relative flex flex-col items-center px-5 pt-16 pb-10 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-d-gold/[0.03] blur-[120px] [.light_&]:bg-l-gold/[0.05]" />

      {/* Icon */}
      <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-d-gold/15 to-d-gold/5 text-4xl animate-float [.light_&]:from-l-gold/10 [.light_&]:to-l-gold/5 ${mounted ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}>
        ☽
      </div>

      {/* Title */}
      <h1 className={`mb-3 font-display text-4xl font-bold text-d-gold [.light_&]:text-l-gold ${mounted ? "animate-slide-up" : "opacity-0"}`}>
        شفيع
      </h1>
      <p className={`mb-10 font-body text-base text-d-text-dim [.light_&]:text-l-text-dim max-w-md ${mounted ? "animate-slide-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
        {lang === "ar"
          ? "مساعد إسلامي موثوق — ابحث في القرآن، التفسير، الحديث، والأذكار"
          : "Trusted Islamic Assistant — Search the Quran, Tafsir, Hadith, and Adhkar"}
      </p>

      {/* Search */}
      <form onSubmit={handleSubmit} className={`relative w-full max-w-xl ${mounted ? "animate-slide-up" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={lang === "ar" ? "ابحث عن آية، موضوع، أذكار، أو اسأل سؤالاً..." : "Search for a verse, topic, adhkar, or ask a question..."}
          dir="auto"
          className="w-full rounded-2xl border border-d-border [.light_&]:border-l-border bg-d-surface/50 [.light_&]:bg-l-surface/80 px-6 py-4 pr-14 font-body text-sm text-d-text [.light_&]:text-l-text outline-none placeholder:text-d-text-muted [.light_&]:placeholder:text-l-text-muted focus:border-d-gold/30 [.light_&]:focus:border-l-gold/30 transition-all shadow-lg shadow-black/5 [.light_&]:shadow-black/3"
        />
        <button type="submit" disabled={!input.trim()} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-d-gold/15 text-d-gold [.light_&]:bg-l-gold/10 [.light_&]:text-l-gold text-lg transition-all hover:bg-d-gold/25 disabled:opacity-30">
          ↑
        </button>
      </form>

      {/* Verse of the day */}
      <div className={`mt-12 max-w-lg ${mounted ? "animate-slide-up" : "opacity-0"}`} style={{ animationDelay: "0.4s" }}>
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-d-text-muted [.light_&]:text-l-text-muted font-body">
          {lang === "ar" ? "آية اليوم" : "Verse of the Day"}
        </p>
        <p className="font-quran text-xl leading-[2.4] text-d-gold/80 [.light_&]:text-l-gold verse-glow">
          {verse.text}
        </p>
        <p className="mt-2 text-xs text-d-text-muted [.light_&]:text-l-text-muted font-body">
          سورة {verse.surah} — آية {verse.ayah}
        </p>
      </div>
    </section>
  );
}
