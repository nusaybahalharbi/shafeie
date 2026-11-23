"use client";

export default function ResponseCard({
  content,
  index,
  streaming = false,
  refusal = false,
}: {
  content: string;
  index?: number;
  streaming?: boolean;
  refusal?: boolean;
}) {
  const refusalMatch = content.match(/\[REFUSAL:(QURAN|HADITH|DUA|GENERAL)\]/);
  const refusalKind = refusalMatch?.[1];
  const displayContent = content.replace(/\[REFUSAL:(?:QURAN|HADITH|DUA|GENERAL)\]\s*/g, "");
  const isRefusal = refusal || Boolean(refusalKind);

  const refusalLabel =
    refusalKind === "QURAN"
      ? "القرآن والتفسير"
      : refusalKind === "HADITH"
        ? "صحيح البخاري"
        : refusalKind === "DUA"
          ? "الأدعية والأذكار"
          : "المصادر المعتمدة";

  return (
    <article
      className={`mb-3 overflow-hidden rounded-2xl border shadow-lg shadow-black/5 ${
        isRefusal
          ? "border-red-400/20 bg-red-400/[0.04]"
          : "border-d-border bg-d-card [.light_&]:border-l-border [.light_&]:bg-l-card"
      }`}
    >
      <div className="px-5 pb-5 pt-5 sm:px-7 sm:pb-6" dir="auto">
        {index !== undefined && (
          <div className="mb-4 flex justify-end">
            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-d-gold/10 px-2 text-xs font-bold text-d-gold [.light_&]:bg-l-gold/10 [.light_&]:text-l-gold">
              {index}
            </span>
          </div>
        )}
        <p
          className={`whitespace-pre-wrap break-words font-body text-[16px] leading-[2.05] sm:text-[17px] ${
            isRefusal ? "text-red-300 [.light_&]:text-red-600" : "text-d-text [.light_&]:text-l-text"
          }`}
        >
          {displayContent}
          {streaming && <span className="ms-1 inline-block h-4 w-[2px] animate-pulse bg-d-gold/60 align-middle" />}
        </p>
      </div>

      <footer className={`flex items-center justify-between gap-3 border-t px-5 py-3 font-body text-[11px] sm:px-7 ${
        isRefusal
          ? "border-red-400/15 bg-red-400/[0.06] text-red-200/80 [.light_&]:text-red-700"
          : "border-d-border bg-d-gold-soft/50 text-d-text-dim [.light_&]:border-l-border [.light_&]:bg-l-gold-soft/60 [.light_&]:text-l-text-dim"
      }`}>
        <span className="inline-flex items-center gap-1.5">
          <span className={isRefusal ? "text-red-300 [.light_&]:text-red-600" : "text-d-gold [.light_&]:text-l-gold"}>{isRefusal ? "!" : "✦"}</span>
          {isRefusal ? "تعذّر التوثيق" : "إجابة شفيع"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className={isRefusal ? "text-red-300 [.light_&]:text-red-600" : "text-d-gold [.light_&]:text-l-gold"}>{isRefusal ? "◌" : "✓"}</span>
          {isRefusal ? refusalLabel : "مصادر موثقة"}
        </span>
      </footer>
    </article>
  );
}
