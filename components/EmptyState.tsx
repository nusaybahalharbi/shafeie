"use client";
import QuranBrowser from "./QuranBrowser";

const SUGGESTIONS_AR = [
  { label: "آيات عن الرزق", q: "آيات قرآنية عن الرزق" },
  { label: "تفسير آية الكرسي", q: "تفسير سورة البقرة آية 255" },
  { label: "أذكار الصباح", q: "اعرض أذكار الصباح" },
  { label: "أذكار المساء", q: "اعرض أذكار المساء" },
  { label: "أدعية من السنة", q: "اعرض أدعية من الكتاب والسنة" },
  { label: "الصبر على البلاء", q: "آيات عن الصبر عند المصائب" },
];

const SUGGESTIONS_EN = [
  { label: "Verses about rizq", q: "Quran verses about provision and rizq" },
  { label: "Ayat al-Kursi tafsir", q: "Give me the tafsir of Surah Al-Baqarah ayah 255" },
  { label: "Morning Adhkar", q: "Show me the morning adhkar" },
  { label: "Evening Adhkar", q: "Show me the evening adhkar" },
  { label: "Duas from Sunnah", q: "Show me duas from the Quran and Sunnah" },
  { label: "Patience in hardship", q: "Verses about patience during hardship" },
];

export default function EmptyState({ onSend, lang }: { onSend: (q: string) => void; lang: "ar" | "en" }) {
  const suggestions = lang === "ar" ? SUGGESTIONS_AR : SUGGESTIONS_EN;
  return (
    <div className="flex min-h-[60vh] animate-fade-in flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 animate-gentle-float items-center justify-center rounded-full border border-nur-gold/[0.12] bg-gradient-to-br from-nur-gold/[0.12] to-nur-gold/[0.04] text-4xl">☽</div>
      <h2 className="mb-2 font-arabic text-[30px] text-nur-gold">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</h2>
      <p className="mb-2 font-display text-2xl text-nur-gold/80">شفيع</p>
      <p className="mb-4 font-body text-base text-nur-text-muted">
        {lang === "ar" ? "اسأل عن أي آية، موضوع، أذكار، أدعية، أو اطلب إرشاداً قرآنياً" : "Ask about any verse, topic, adhkar, duas, or seek Quranic guidance"}
      </p>
      <p className="mb-8 font-body text-sm text-nur-text-faint">
        {lang === "ar" ? "كل إجابة موثقة ومسندة" : "Every answer is verified and sourced"}
      </p>

      <div className="mb-6 w-full max-w-xl">
        <QuranBrowser onSelect={onSend} lang={lang} />
      </div>

      <div className="flex max-w-xl flex-wrap justify-center gap-2">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => onSend(s.q)} className="rounded-full border border-nur-gold/[0.12] bg-nur-gold/[0.05] px-4 py-2 font-body text-[13px] text-nur-text-dim transition-all hover:border-nur-gold/30 hover:bg-nur-gold/[0.12] hover:text-nur-gold">{s.label}</button>
        ))}
      </div>
    </div>
  );
}
