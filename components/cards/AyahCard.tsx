"use client";
import { useState } from "react";
import { AyahFields, isEmpty } from "@/lib/parser";

function Detail({ title, content, empty }: { title: string; content: string; empty: boolean }) {
  return (
    <div className={`mb-3 rounded-xl px-4 py-3 ${empty ? "bg-d-surface/30 [.light_&]:bg-l-bg" : "bg-d-gold-soft [.light_&]:bg-l-gold-soft"} ${empty ? "border-r-2 border-d-text-muted/20 [.light_&]:border-l-text-muted/20" : "border-r-2 border-d-gold/30 [.light_&]:border-l-gold/30"}`}>
      <div className={`mb-1 font-body text-[11px] font-semibold ${empty ? "text-d-text-muted [.light_&]:text-l-text-muted" : "text-d-gold [.light_&]:text-l-gold"}`}>{title}</div>
      <div className={`font-body text-[13px] leading-relaxed ${empty ? "italic text-d-text-muted [.light_&]:text-l-text-muted" : "text-d-text-dim [.light_&]:text-l-text-dim"}`} dir="auto">{content || "غير متوفر"}</div>
    </div>
  );
}

export default function AyahCard({ fields }: { fields: AyahFields }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 overflow-hidden rounded-2xl sm:mb-5 border border-d-border [.light_&]:border-l-border bg-d-card [.light_&]:bg-l-card shadow-xl shadow-black/10 [.light_&]:shadow-black/5">
      {/* Quran verse - premium typography */}
      <div className="bg-gradient-to-br from-d-gold/[0.06] to-transparent [.light_&]:from-l-gold/[0.04] border-b border-d-border [.light_&]:border-l-border px-4 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-7" dir="rtl">
        <p className="font-quran text-[21px] sm:text-[24px] leading-[2.6] text-d-gold [.light_&]:text-l-gold verse-glow">{fields.arabic}</p>
      </div>

      {/* Translation */}
      {fields.translation && (
        <div className="border-b border-d-border [.light_&]:border-l-border px-4 py-4 sm:px-7" dir="ltr">
          <p className="font-en text-[14px] italic leading-relaxed text-d-text-dim [.light_&]:text-l-text-dim">{fields.translation}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-wrap gap-2 border-b border-d-border [.light_&]:border-l-border px-4 py-3 sm:px-7">
        {[fields.surah && `${fields.surah}`, fields.ayahNumber && `آية ${fields.ayahNumber}`, fields.makkiMadani, fields.location].filter(Boolean).map((l, i) => (
          <span key={i} className="rounded-lg bg-d-gold-soft [.light_&]:bg-l-gold-soft px-3 py-1 font-body text-[11px] text-d-text-dim [.light_&]:text-l-text-dim">{l}</span>
        ))}
      </div>

      {/* Tafsir */}
      {fields.tafsir && (
        <div className="border-b border-d-border [.light_&]:border-l-border px-4 py-4 sm:px-7 sm:py-5">
          <div className="mb-2 font-body text-[11px] font-semibold text-d-gold [.light_&]:text-l-gold tracking-wide">التفسير — ابن كثير</div>
          <p className="break-words font-body text-sm leading-[1.9] text-d-text-dim [.light_&]:text-l-text-dim" dir="auto">{fields.tafsir}</p>
        </div>
      )}

      {/* Expandable */}
      <div className="px-4 pb-2 sm:px-7">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 py-3 font-body text-xs text-d-gold/60 [.light_&]:text-l-gold/60 hover:text-d-gold [.light_&]:hover:text-l-gold transition-colors">
          <span className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}>◂</span>
          {open ? "إخفاء التفاصيل" : "سبب النزول · الحديث · الروايات"}
        </button>
        {open && (
          <div className="animate-fade-in pb-4">
            <Detail title="سبب النزول" content={fields.sababNuzul} empty={isEmpty(fields.sababNuzul)} />
            <Detail title="صحيح البخاري" content={fields.hadith} empty={isEmpty(fields.hadith)} />
            <Detail title="روايات ذات صلة" content={fields.narrations} empty={isEmpty(fields.narrations)} />
          </div>
        )}
      </div>
    </div>
  );
}
