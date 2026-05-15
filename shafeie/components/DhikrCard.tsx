"use client";
import { DhikrFields } from "@/lib/parser";

export default function DhikrCard({ fields, index }: { fields: DhikrFields; index?: number }) {
  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-nur-gold/[0.15] bg-gradient-to-br from-[#0d1f2d] to-[#0a1628] shadow-[0_2px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(195,166,113,0.08)]">
      {/* Dhikr text */}
      <div className="px-6 pb-4 pt-5" dir="rtl">
        {index !== undefined && (
          <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-nur-gold/10 text-[11px] font-bold text-nur-gold">
            {index}
          </div>
        )}
        <p className="font-arabic text-[18px] leading-[2.2] text-nur-gold/90">
          {fields.text}
        </p>
      </div>

      {/* Repetition & time */}
      <div className="flex items-center gap-3 border-t border-nur-gold/[0.08] px-6 py-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-nur-gold/[0.08] px-3 py-1 text-[11px] text-nur-text-dim">
          <span className="text-nur-gold">↻</span> {fields.repetition}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-nur-gold/[0.08] px-3 py-1 text-[11px] text-nur-text-dim">
          <span className="text-nur-gold">☽</span> {fields.time}
        </span>
      </div>
    </div>
  );
}
