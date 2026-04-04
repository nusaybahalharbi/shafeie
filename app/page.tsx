"use client";
import { useRef, useEffect, useState } from "react";
import { useChat } from "@/lib/use-chat";
import { parseAyahCards } from "@/lib/parser";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import EmptyState from "@/components/EmptyState";
import LoadingIndicator from "@/components/LoadingIndicator";
import AyahCard from "@/components/AyahCard";
import DhikrCard from "@/components/DhikrCard";

export default function Home() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const { messages, isLoading, streamingContent, sendMessage, stop } = useChat();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingContent]);

  const wrappedSend = (text: string) => {
    if (lang === "en") {
      sendMessage(text + "\n\n[RESPOND IN ENGLISH]");
    } else {
      sendMessage(text);
    }
  };

  let streamDhikrCount = 0;

  return (
    <div className="flex min-h-screen flex-col" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header lang={lang} onLangChange={setLang} />
      <main className="mx-auto flex-1 overflow-y-auto px-4 py-6 sm:px-6 w-full max-w-[800px]">
        {messages.length === 0 && !isLoading ? <EmptyState onSend={wrappedSend} lang={lang} /> : (
          <>
            {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)}
            {isLoading && streamingContent && (
              <div className="mb-5 flex gap-3 animate-fade-in">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nur-gold to-nur-gold-dim text-sm shadow-lg shadow-nur-gold/20">☽</div>
                <div className="min-w-0 flex-1">
                  {parseAyahCards(streamingContent, true).map((seg, i) => {
                    if (seg.type === "card") return <AyahCard key={i} fields={seg.fields} />;
                    if (seg.type === "dhikr") {
                      streamDhikrCount++;
                      return <DhikrCard key={i} fields={seg.fields} index={streamDhikrCount} />;
                    }
                    return (
                      <p key={i} className="whitespace-pre-wrap font-body text-sm leading-[1.85] text-nur-text-dim" dir="auto">
                        {seg.content}<span className="mr-0.5 inline-block h-4 w-[2px] animate-pulse bg-nur-gold/60" />
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
            {isLoading && !streamingContent && <LoadingIndicator lang={lang} />}
          </>
        )}
        <div ref={endRef} />
      </main>
      <ChatInput onSend={wrappedSend} isLoading={isLoading} onStop={stop} lang={lang} />
    </div>
  );
}
