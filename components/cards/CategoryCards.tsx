"use client";

import { useApp } from "@/lib/context";

const CATEGORIES = [
  { icon: "دع", ar: "الدعاء", en: "Dua", query_ar: "اعرض أدعية من الكتاب والسنة", query_en: "Show me duas from the Quran and Sunnah" },
  { icon: "ص", ar: "أذكار الصباح", en: "Morning Adhkar", query_ar: "اعرض أذكار الصباح", query_en: "Show me the morning adhkar" },
  { icon: "م", ar: "أذكار المساء", en: "Evening Adhkar", query_ar: "اعرض أذكار المساء", query_en: "Show me the evening adhkar" },
  { icon: "سك", ar: "الطمأنينة", en: "Tranquility", query_ar: "آيات عن الطمأنينة وراحة البال", query_en: "Verses about tranquility and peace of mind" },
  { icon: "رز", ar: "الرزق والبركة", en: "Provision", query_ar: "آيات قرآنية عن الرزق", query_en: "Quran verses about provision and rizq" },
  { icon: "صب", ar: "الصبر", en: "Patience", query_ar: "آيات عن الصبر عند المصائب", query_en: "Verses about patience during hardship" },
  { icon: "تو", ar: "التوبة", en: "Repentance", query_ar: "آيات عن التوبة والاستغفار", query_en: "Verses about repentance and forgiveness" },
  { icon: "وك", ar: "التوكل", en: "Trust in Allah", query_ar: "آيات عن التوكل على الله", query_en: "Verses about trusting in Allah" },
  { icon: "شك", ar: "الشكر", en: "Gratitude", query_ar: "آيات قرآنية عن شكر الله", query_en: "Quran verses about gratitude" },
  { icon: "أم", ar: "الخوف والقلق", en: "Fear & Anxiety", query_ar: "آيات عن التغلب على الخوف والقلق", query_en: "Verses about overcoming fear and anxiety" },
];

export default function CategoryCards({ onSelect }: { onSelect: (q: string) => void }) {
  const { lang } = useApp();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6 sm:pb-24">
      <div className="mb-7 flex items-end justify-between gap-4 border-b border-d-border pb-4 [.light_&]:border-l-border">
      <h2 className="font-display text-2xl text-d-text [.light_&]:text-l-text sm:text-3xl">
        {lang === "ar" ? "استكشف المواضيع" : "Explore Topics"}
      </h2>
      <span className="font-body text-xs text-d-text-muted [.light_&]:text-l-text-muted">{lang === "ar" ? "اختر لتبدأ" : "Choose to begin"}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {CATEGORIES.map((category, index) => (
          <button
            key={index}
            onClick={() => onSelect(lang === "ar" ? category.query_ar : category.query_en)}
            style={{ animationDelay: `${index * 55}ms` }}
            className="topic-card topic-enter group flex min-h-[118px] flex-col items-start justify-between rounded-[24px] border border-d-border bg-d-surface/35 p-4 text-start backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-d-gold/35 hover:bg-d-card/80 [.light_&]:border-l-border [.light_&]:bg-white/65 [.light_&]:hover:border-l-gold/25 sm:min-h-[140px] sm:p-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-d-gold/20 bg-d-gold/[0.06] font-display text-sm leading-none text-d-gold transition-transform group-hover:scale-105 [.light_&]:border-l-gold/20 [.light_&]:bg-l-gold/[0.06] [.light_&]:text-l-gold sm:h-12 sm:w-12 sm:text-base">
              {category.icon}
            </span>
            <span className="font-body text-sm leading-5 text-d-text-dim transition-colors group-hover:text-d-gold [.light_&]:text-l-text-dim [.light_&]:group-hover:text-l-gold sm:text-base">
              {lang === "ar" ? category.ar : category.en}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
