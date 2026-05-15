"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

export default function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [input, setInput] = useState("");
  const { lang } = useApp();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value || isLoading) return;

    onSend(value);
    setInput("");
  };

  return (
    <div className="chat-input-shell shrink-0 border-t border-d-border bg-d-bg/95 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-xl [.light_&]:border-l-border [.light_&]:bg-l-bg/95 sm:px-4 sm:pb-4 sm:pt-4">
      <div className="mx-auto w-full max-w-3xl">
        <form onSubmit={submit} className="flex items-end gap-2 sm:gap-3" dir={lang === "ar" ? "rtl" : "ltr"}>
          <label className="sr-only" htmlFor="shafeie-chat-input">
            {lang === "ar" ? "اكتب سؤالك" : "Write your question"}
          </label>

          <textarea
            id="shafeie-chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                const form = event.currentTarget.form;
                form?.requestSubmit();
              }
            }}
            rows={1}
            placeholder={
              lang === "ar"
                ? "اسأل سؤالاً إسلامياً موثقاً..."
                : "Ask a documented Islamic question..."
            }
            disabled={isLoading}
            dir="auto"
            className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-d-border bg-d-surface/70 px-4 py-3 font-body text-[16px] leading-6 text-d-text outline-none transition-colors placeholder:text-d-text-muted focus:border-d-gold/40 disabled:opacity-60 [.light_&]:border-l-border [.light_&]:bg-l-surface [.light_&]:text-l-text [.light_&]:placeholder:text-l-text-muted [.light_&]:focus:border-l-gold/40 sm:min-h-[52px] sm:px-5"
          />

          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-sm text-red-300 transition-colors hover:bg-red-400/20 [.light_&]:text-red-600"
              aria-label={lang === "ar" ? "إيقاف الإجابة" : "Stop response"}
            >
              ■
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-d-gold/15 text-lg text-d-gold transition-colors hover:bg-d-gold/25 disabled:opacity-30 [.light_&]:bg-l-gold/10 [.light_&]:text-l-gold [.light_&]:hover:bg-l-gold/20"
              aria-label={lang === "ar" ? "إرسال" : "Send"}
            >
              ↑
            </button>
          )}
        </form>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-body text-[10px] leading-5 text-d-text-muted [.light_&]:text-l-text-muted sm:gap-x-3">
          <span>{lang === "ar" ? "مصادر موثقة" : "Verified sources"}</span>
          <span aria-hidden>·</span>
          <span>{lang === "ar" ? "بدون فتاوى" : "No fatwas"}</span>
          <span aria-hidden>·</span>
          <span>{lang === "ar" ? "يرفض عند عدم اليقين" : "Refuses when uncertain"}</span>
        </div>
      </div>
    </div>
  );
}
