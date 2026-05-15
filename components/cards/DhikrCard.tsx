"use client";
import { DhikrFields } from "@/lib/parser";

export default function DhikrCard({ fields, index }: { fields: DhikrFields; index?: number }) {
  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-d-border [.light_&]:border-l-border bg-d-card [.light_&]:bg-l-card shadow-lg shadow-black/5">
      <div className="px-4 pb-4 pt-5 sm:px-6" dir="rtl">
        {index !== undefined && (
          <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-d-gold/10 [.light_&]:bg-l-gold/10 text-[12px] font-bold text-d-gold [.light_&]:text-l-gold">{index}</div>
        )}
        <p className="font-quran text-[17px] sm:text-[18px] leading-[2.4] text-d-text [.light_&]:text-l-text">{fields.text}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-t border-d-border [.light_&]:border-l-border px-4 py-2.5 sm:px-6 bg-d-gold-soft/50 [.light_&]:bg-l-gold-soft/50">
        <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] text-d-text-dim [.light_&]:text-l-text-dim font-body">
          <span className="text-d-gold [.light_&]:text-l-gold">↻</span> {fields.repetition}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] text-d-text-dim [.light_&]:text-l-text-dim font-body">
          <span className="text-d-gold [.light_&]:text-l-gold">☽</span> {fields.time}
        </span>
      </div>
    </div>
  );
}
