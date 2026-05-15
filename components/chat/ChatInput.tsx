"use client";
import { useState } from "react";
import { useApp } from "@/lib/context";

export default function ChatInput({ onSend, isLoading, onStop }: { onSend: (t: string) => void; isLoading: boolean; onStop: () => void }) {
  const [input, setInput] = useState("");
  const { lang } = useApp();

  return (
    <div className="border-t border-d-border [.light_&]:border-l-border bg-d-bg/90 [.light_&]:bg-l-bg/90 backdrop-blur-xl px-5 pb-5 pt-4">
      <div className="mx-auto max-w-3xl">
        <form onSubmit={e => { e.preventDefault(); if (input.trim() && !isLoading) { onSend(lang === "en" ? input + "\n\n[RESPOND IN ENGLISH]" : input); setInput(""); } }} className="flex items-center gap-3">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder={lang === "ar" ? "اسأل عن آية، موضوع، أذكار، أو أي سؤال إسلامي..." : "Ask about a verse, topic, adhkar, or any Islamic question..."}
            disabled={isLoading} dir="auto"
            className="flex-1 rounded-2xl border border-d-border [.light_&]:border-l-border bg-d-surface/50 [.light_&]:bg-l-surface px-5 py-3.5 font-body text-sm text-d-text [.light_&]:text-l-text outline-none placeholder:text-d-text-muted [.light_&]:placeholder:text-l-text-muted focus:border-d-gold/25 [.light_&]:focus:border-l-gold/25 transition-all disabled:opacity-50" />
          {isLoading ? (
            <button type="button" onClick={onStop} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-300 transition-all hover:bg-red-400/20">■</button>
          ) : (
            <button type="submit" disabled={!input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-d-gold/15 [.light_&]:bg-l-gold/10 text-d-gold [.light_&]:text-l-gold text-lg transition-all hover:bg-d-gold/25 disabled:opacity-25">↑</button>
          )}
        </form>
        <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-d-text-muted [.light_&]:text-l-text-muted font-body">
          <span className="flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-emerald-400/60" /> {lang === "ar" ? "مصادر موثقة" : "Verified Sources"}</span>
          <span>·</span>
          <span>{lang === "ar" ? "بدون فتاوى" : "No Fatwas"}</span>
          <span>·</span>
          <span>{lang === "ar" ? "يرفض عند عدم اليقين" : "Refuses when uncertain"}</span>
        </div>
      </div>
    </div>
  );
}
