"use client";
import { useState } from "react";

export default function ChatInput({ onSend, isLoading, onStop }: { onSend: (t: string) => void; isLoading: boolean; onStop: () => void }) {
  const [input, setInput] = useState("");
  return (
    <div className="border-t border-nur-gold/[0.08] bg-nur-bg/95 px-6 pb-5 pt-4 backdrop-blur-xl">
      <div className="mx-auto max-w-[780px]">
        <form onSubmit={e => { e.preventDefault(); if (input.trim() && !isLoading) { onSend(input); setInput(""); } }} className="flex items-center gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="اسأل عن آية، موضوع، أو اطلب إرشاداً..." disabled={isLoading} dir="auto"
            className="flex-1 rounded-xl border border-nur-gold/[0.1] bg-nur-gold/[0.04] px-5 py-3.5 font-body text-sm text-nur-text outline-none transition-colors placeholder:text-nur-text-faint focus:border-nur-gold/30 disabled:opacity-50" />
          {isLoading ? (
            <button type="button" onClick={onStop} className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-300">■</button>
          ) : (
            <button type="submit" disabled={!input.trim()} className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-nur-gold to-nur-gold-dim text-lg text-nur-bg disabled:from-nur-gold/10 disabled:to-nur-gold/10 disabled:text-nur-text-faint">↑</button>
          )}
        </form>
        <p className="mt-2.5 text-center text-[10px] text-nur-text-faint/50">مصادر موثقة فقط · بدون فتاوى · يرفض عند عدم اليقين</p>
      </div>
    </div>
  );
}
