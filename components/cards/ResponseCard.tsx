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
  return (
    <article
      className={`mb-3 overflow-hidden rounded-2xl border shadow-lg shadow-black/5 ${
        refusal
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
            refusal ? "text-red-300 [.light_&]:text-red-600" : "text-d-text [.light_&]:text-l-text"
          }`}
        >
          {content}
          {streaming && <span className="ms-1 inline-block h-4 w-[2px] animate-pulse bg-d-gold/60 align-middle" />}
        </p>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-d-border bg-d-gold-soft/50 px-5 py-3 font-body text-[11px] text-d-text-dim [.light_&]:border-l-border [.light_&]:bg-l-gold-soft/60 [.light_&]:text-l-text-dim sm:px-7">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-d-gold [.light_&]:text-l-gold">✦</span>
          إجابة شفيع
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-d-gold [.light_&]:text-l-gold">✓</span>
          مصادر موثقة
        </span>
      </footer>
    </article>
  );
}
