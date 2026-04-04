"use client";
const SUGGESTIONS = [
  { label: "آيات عن الرزق", q: "آيات قرآنية عن الرزق" },
  { label: "الصبر على البلاء", q: "آيات عن الصبر عند المصائب" },
  { label: "تفسير آية الكرسي", q: "تفسير سورة البقرة آية 255" },
  { label: "الشكر والحمد", q: "آيات قرآنية عن شكر الله" },
  { label: "التوكل على الله", q: "آيات عن التوكل على الله" },
  { label: "Patience", q: "Verses about patience during hardship" },
];

export default function EmptyState({ onSend }: { onSend: (q: string) => void }) {
  return (
    <div className="flex min-h-[60vh] animate-fade-in flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 animate-gentle-float items-center justify-center rounded-full border border-nur-gold/[0.12] bg-gradient-to-br from-nur-gold/[0.12] to-nur-gold/[0.04] text-4xl">☽</div>
      <h2 className="mb-2 font-arabic text-[30px] text-nur-gold">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</h2>
      <p className="mb-2 font-display text-2xl text-nur-gold/80">شفيع</p>
      <p className="mb-4 font-body text-base text-nur-text-muted">اسأل عن أي آية، موضوع، أو اطلب إرشاداً قرآنياً</p>
      <p className="mb-10 font-body text-sm text-nur-text-faint">كل إجابة موثقة ومسندة — يرد بلغتك تلقائياً</p>
      <div className="flex max-w-xl flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => onSend(s.q)} className="rounded-full border border-nur-gold/[0.12] bg-nur-gold/[0.05] px-4 py-2 font-body text-[13px] text-nur-text-dim transition-all hover:border-nur-gold/30 hover:bg-nur-gold/[0.12] hover:text-nur-gold">{s.label}</button>
        ))}
      </div>
    </div>
  );
}
