"use client";

import { useRef, useEffect, useState } from "react";
import { AppProvider, useApp } from "@/lib/context";
import { useChat } from "@/lib/use-chat";
import { parseResponse } from "@/lib/parser";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/layout/HeroSection";
import CategoryCards from "@/components/cards/CategoryCards";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import LoadingSkeleton from "@/components/chat/LoadingSkeleton";
import AyahCard from "@/components/cards/AyahCard";
import DhikrCard from "@/components/cards/DhikrCard";

function AppContent() {
  const { lang } = useApp();
  const { messages, isLoading, streamingContent, sendMessage, stop, reset } = useChat();
  const endRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLElement>(null);
  const [view, setView] = useState<"home" | "chat">("home");

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior, block: "end" });
    });
  };

  useEffect(() => {
    if (view === "chat") scrollToBottom("smooth");
  }, [messages.length, view]);

  useEffect(() => {
    if (!streamingContent || view !== "chat") return;

    const el = chatScrollRef.current;
    if (!el) {
      scrollToBottom("auto");
      return;
    }

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 180) scrollToBottom("auto");
  }, [streamingContent, view]);

  const handleSearch = (q: string) => {
    const query = q.trim();
    if (!query) return;

    setView("chat");
    sendMessage(lang === "en" ? `${query}\n\n[RESPOND IN ENGLISH]` : query);
  };

  const goHome = () => {
    reset();
    setView("home");
  };

  let streamDhikrCount = 0;

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-d-bg text-d-text [.light_&]:bg-l-bg [.light_&]:text-l-text">
      <Header />

      {view === "home" ? (
        <main className="flex-1 overflow-x-hidden">
          <HeroSection onSearch={handleSearch} />
          <CategoryCards onSelect={handleSearch} />

          <footer className="border-t border-d-border px-4 py-7 text-center [.light_&]:border-l-border sm:py-8">
            <p className="mx-auto max-w-xl font-body text-[11px] leading-6 text-d-text-muted [.light_&]:text-l-text-muted">
              {lang === "ar"
                ? "المصادر المعتمدة: القرآن الكريم · تفسير ابن كثير · صحيح البخاري · أذكار وأدعية موثقة"
                : "Approved Sources: Holy Quran · Tafsir Ibn Kathir · Sahih al-Bukhari · Verified Adhkar & Duas"}
            </p>
            <p className="mt-1 font-body text-[10px] text-d-text-muted/60 [.light_&]:text-l-text-muted/70">
              {lang === "ar"
                ? "بدون فتاوى · بدون أحاديث ضعيفة · يرفض عند عدم اليقين"
                : "No fatwas · No weak hadith · Refuses when uncertain"}
            </p>
          </footer>
        </main>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-d-border bg-d-bg/90 px-3 py-2 backdrop-blur-xl [.light_&]:border-l-border [.light_&]:bg-l-bg/90 sm:px-5">
            <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-2">
              <button
                onClick={goHome}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 font-body text-sm text-d-text-muted transition-colors hover:bg-d-surface hover:text-d-gold [.light_&]:text-l-text-muted [.light_&]:hover:bg-l-surface [.light_&]:hover:text-l-gold"
              >
                <span aria-hidden>{lang === "ar" ? "→" : "←"}</span>
                <span>{lang === "ar" ? "الرئيسية" : "Home"}</span>
              </button>

              <span className="hidden rounded-full border border-d-border px-3 py-1.5 font-body text-[10px] text-d-text-muted [.light_&]:border-l-border [.light_&]:text-l-text-muted sm:inline-flex">
                {lang === "ar" ? "مصادر موثقة فقط" : "Verified sources only"}
              </span>
            </div>
          </div>

          <main
            ref={chatScrollRef}
            className="mobile-scroll mx-auto w-full max-w-3xl flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 pb-4 sm:px-4 sm:py-6"
          >
            {messages.map((message, index) => (
              <ChatMessage key={`${message.role}-${index}`} role={message.role} content={message.content} />
            ))}

            {isLoading && streamingContent && (
              <div className="mb-5 flex gap-2 sm:gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-d-gold/20 to-d-gold/5 text-sm [.light_&]:from-l-gold/15 [.light_&]:to-l-gold/5">
                  ☽
                </div>
                <div className="min-w-0 flex-1">
                  {parseResponse(streamingContent, true).map((seg, index) => {
                    if (seg.type === "card") return <AyahCard key={index} fields={seg.fields} />;
                    if (seg.type === "dhikr") {
                      streamDhikrCount++;
                      return <DhikrCard key={index} fields={seg.fields} index={streamDhikrCount} />;
                    }

                    return (
                      <p
                        key={index}
                        className="whitespace-pre-wrap break-words font-body text-sm leading-[1.9] text-d-text-dim [.light_&]:text-l-text-dim"
                        dir="auto"
                      >
                        {seg.content}
                        <span className="ms-1 inline-block h-4 w-[2px] animate-pulse bg-d-gold/50 align-middle" />
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {isLoading && !streamingContent && <LoadingSkeleton />}
            <div ref={endRef} className="h-1" />
          </main>

          <ChatInput onSend={handleSearch} isLoading={isLoading} onStop={stop} />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
