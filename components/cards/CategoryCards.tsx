"use client";
import { useApp } from "@/lib/context";

const CATEGORIES = [
  { icon: "🤲", ar: "الدعاء", en: "Dua", query_ar: "اعرض أدعية من الكتاب والسنة", query_en: "Show me duas from the Quran and Sunnah" },
  { icon: "☀", ar: "أذكار الصباح", en: "Morning Adhkar", query_ar: "اعرض أذكار الصباح", query_en: "Show me the morning adhkar" },
  { icon: "🌙", ar: "أذكار المساء", en: "Evening Adhkar", query_ar: "اعرض أذكار المساء", query_en: "Show me the evening adhkar" },
  { icon: "🕊", ar: "الطمأنينة", en: "Tranquility", query_ar: "آيات عن الطمأنينة وراحة البال", query_en: "Verses about tranquility and peace of mind" },
  { icon: "✨", ar: "الرزق والبركة", en: "Provision", query_ar: "آيات قرآنية عن الرزق", query_en: "Quran verses about provision and rizq" },
  { icon: "🌿", ar: "الصبر", en: "Patience", query_ar: "آيات عن الصبر عند المصائب", query_en: "Verses about patience during hardship" },
  { icon: "💫", ar: "التوبة", en: "Repentance", query_ar: "آيات عن التوبة والاستغفار", query_en: "Verses about repentance and forgiveness" },
  { icon: "🔐", ar: "التوكل", en: "Trust in Allah", query_ar: "آيات عن التوكل على الله", query_en: "Verses about trusting in Allah" },
  { icon: "❤️", ar: "الشكر", en: "Gratitude", query_ar: "آيات قرآنية عن شكر الله", query_en: "Quran verses about gratitude" },
  { icon: "🌊", ar: "الخوف والقلق", en: "Fear & Anxiety", query_ar: "آيات عن التغلب على الخوف والقلق", query_en: "Verses about overcoming fear and anxiety" },
];

export default function CategoryCards({ onSelect }: { onSelect: (q: string) => void }) {
  const { lang } = useApp();

  return (
    <section className="mx-auto max-w-5xl px-5 pb-16">
      <h2 className="mb-6 text-center font-display text-lg text-d-text-dim [.light_&]:text-l-text-dim">
        {lang === "ar" ? "استكشف المواضيع" : "Explore Topics"}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {CATEGORIES.map((cat, i) => (
          <button
            key={i}
            onClick={() => onSelect(lang === "ar" ? cat.query_ar : cat.query_en)}
            className="card-hover group flex flex-col items-center gap-2.5 rounded-2xl border border-d-border [.light_&]:border-l-border bg-d-surface/30 [.light_&]:bg-l-surface/60 px-4 py-5 text-center transition-all hover:border-d-gold/20 [.light_&]:hover:border-l-gold/20 hover:bg-d-gold-soft [.light_&]:hover:bg-l-gold-soft"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-2xl transition-transform group-hover:scale-110">{cat.icon}</span>
            <span className="font-body text-[13px] text-d-text-dim [.light_&]:text-l-text-dim group-hover:text-d-gold [.light_&]:group-hover:text-l-gold transition-colors">
              {lang === "ar" ? cat.ar : cat.en}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
