"use client";
import { useApp } from "@/lib/context";

export default function LoadingSkeleton() {
  const { lang } = useApp();
  return (
    <div className="mb-5 flex gap-3 animate-fade-in">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-d-gold/20 to-d-gold/5 text-sm">☽</div>
      <div className="flex-1 space-y-3">
        <div className="h-4 w-3/4 rounded-lg bg-d-gold-soft [.light_&]:bg-l-gold-soft shimmer-bg" />
        <div className="h-4 w-1/2 rounded-lg bg-d-gold-soft [.light_&]:bg-l-gold-soft shimmer-bg" />
        <div className="h-4 w-2/3 rounded-lg bg-d-gold-soft [.light_&]:bg-l-gold-soft shimmer-bg" />
        <p className="mt-2 text-xs text-d-text-muted [.light_&]:text-l-text-muted font-body">
          {lang === "ar" ? "شفيع يبحث في المصادر الموثقة..." : "Shafee is searching verified sources..."}
        </p>
      </div>
    </div>
  );
}
