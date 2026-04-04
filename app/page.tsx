"use client";
import { useRef, useEffect } from "react";
import { useChat } from "@/lib/use-chat";
import { parseAyahCards } from "@/lib/parser";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import EmptyState from "@/components/EmptyState";
import LoadingIndicator from "@/components/LoadingIndicator";
import AyahCard from "@/components/AyahCard";

export default function Home() {
  const { messages, isLoading, streamingContent, sendMessage, stop } = useChat();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingContent]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex-1 overflow-y-auto px-4 py-6 sm:px-6 w-full max-w-[800px]">
        {messages.length === 0 && !isLoading ? <EmptyState onSend={sendMessage} /> : (
          <>
            {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)}
            {isLoading && streamingContent && (
              <div className="mb-5 flex gap-3 animate-fade-in">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nur-gold to-nur-gold-dim text-sm shadow-lg shadow-nur-gold/20">☽</div>
                <div className="min-w-0 flex-1">
                  {parseAyahCards(streamingContent).map((seg, i) => seg.type === "card" ? <AyahCard key={i} fields={seg.fields} /> : (
                    <p key={i} className="whitespace-pre-wrap font-body text-sm leading-[1.85] text-nur-text-dim" dir="auto">
                      {seg.content}<span className="mr-0.5 inline-block h-4 w-[2px] animate-pulse bg-nur-gold/60" />
                    </p>
                  ))}
                </div>
              </div>
            )}
            {isLoading && !streamingContent && <LoadingIndicator />}
          </>
        )}
        <div ref={endRef} />
      </main>
      <ChatInput onSend={sendMessage} isLoading={isLoading} onStop={stop} />
    </div>
  );
}
