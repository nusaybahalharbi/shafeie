"use client";
import { useState } from "react";
import { AyahFields, isEmpty } from "@/lib/parser";

function Detail({ title, content, empty }: { title: string; content: string; empty: boolean }) {
  return (
    <div className={`mb-3 rounded-lg border-r-[3px] px-4 py-3 ${empty ? "border-nur-text-faint/40 bg-nur-text-faint/5" : "border-nur-gold/30 bg-nur-gold/[0.04]"}`}>
      <div className={`mb-1.5 font-body text-[11px] font-semibold ${empty ? "text-nur-text-faint" : "text-nur-gold"}`}>{title}</div>
      <div className={`font-body text-[13px] leading-relaxed ${empty ? "italic text-nur-text-faint" : "text-nur-text-dim"}`} dir="auto">{content || "غير متوفر"}</div>
    </div>
  );
}

export default function AyahCard({ fields }: { fields: AyahFields }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-nur-gold/[0.15] bg-gradient-to-br from-nur-surface to-[#0f2035] shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(195,166,113,0.1)]">
      <div className="border-b border-nur-gold/[0.12] bg-gradient-to-br from-nur-gold/[0.1] to-nur-gold/[0.03] px-6 pb-5 pt-6" dir="rtl">
        <p className="font-arabic text-[22px] leading-[2.2] text-nur-gold">{fields.arabic}</p>
      </div>
      {fields.translation && (
        <div className="border-b border-nur-gold/[0.08] px-6 py-4" dir="ltr">
          <p className="font-body text-[14px] italic leading-relaxed text-nur-text-dim">{fields.translation}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2 border-b border-nur-gold/[0.08] px-6 py-3">
        {[fields.surah && `السورة: ${fields.surah}`, fields.ayahNumber && `الآية: ${fields.ayahNumber}`, fields.makkiMadani, fields.location && `الموقع: ${fields.location}`]
          .filter(Boolean).map((l, i) => <span key={i} className="inline-block rounded-full bg-nur-gold/[0.07] px-3 py-1 font-body text-[11px] text-nur-text-dim">{l}</span>)}
      </div>
      {fields.tafsir && (
        <div className="border-b border-nur-gold/[0.08] px-6 py-4">
          <div className="mb-2 font-body text-[11px] font-semibold text-nur-gold">التفسير — ابن كثير</div>
          <p className="font-body text-sm leading-[1.8] text-nur-text-dim" dir="auto">{fields.tafsir}</p>
        </div>
      )}
      <div className="px-6 pb-1">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 py-3 font-body text-xs text-nur-gold/70 hover:text-nur-gold">
          <span className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}>◂</span>
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
