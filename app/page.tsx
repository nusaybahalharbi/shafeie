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
  const [view, setView] = useState<"home" | "chat">("home");

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingContent]);

  const handleSearch = (q: string) => {
    setView("chat");
    if (lang === "en") sendMessage(q + "\n\n[RESPOND IN ENGLISH]");
    else sendMessage(q);
  };

  const goHome = () => { reset(); setView("home"); };

  let streamDhikrCount = 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {view === "home" ? (
        <main className="flex-1">
          <HeroSection onSearch={handleSearch} />
          <CategoryCards onSelect={handleSearch} />

          {/* Trust footer */}
          <div className="border-t border-d-border [.light_&]:border-l-border py-8 text-center">
            <p className="font-body text-[11px] text-d-text-muted [.light_&]:text-l-text-muted">
              {lang === "ar"
                ? "المصادر المعتمدة: القرآن الكريم · تفسير ابن كثير · صحيح البخاري · أذكار وأدعية موثقة"
                : "Approved Sources: Holy Quran · Tafsir Ibn Kathir · Sahih al-Bukhari · Verified Adhkar & Duas"}
            </p>
            <p className="mt-1 font-body text-[10px] text-d-text-muted/50 [.light_&]:text-l-text-muted/50">
              {lang === "ar" ? "بدون فتاوى · بدون أحاديث ضعيفة · يرفض عند عدم اليقين" : "No fatwas · No weak hadith · Refuses when uncertain"}
            </p>
          </div>
        </main>
      ) : (
        <>
          {/* Chat header with back button */}
          <div className="border-b border-d-border [.light_&]:border-l-border px-5 py-2">
            <div className="mx-auto flex max-w-3xl items-center">
              <button onClick={goHome} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-d-text-muted [.light_&]:text-l-text-muted hover:text-d-gold [.light_&]:hover:text-l-gold transition-colors font-body">
                {lang === "ar" ? "→ الرئيسية" : "← Home"}
              </button>
            </div>
          </div>

          <main className="mx-auto flex-1 overflow-y-auto px-4 py-6 w-full max-w-3xl">
            {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)}

            {isLoading && streamingContent && (
              <div className="mb-5 flex gap-3 animate-fade-in">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-d-gold/20 to-d-gold/5 text-sm">☽</div>
                <div className="min-w-0 flex-1">
                  {parseResponse(streamingContent, true).map((seg, i) => {
                    if (seg.type === "card") return <AyahCard key={i} fields={seg.fields} />;
                    if (seg.type === "dhikr") { streamDhikrCount++; return <DhikrCard key={i} fields={seg.fields} index={streamDhikrCount} />; }
                    return (
                      <p key={i} className="whitespace-pre-wrap font-body text-sm leading-[1.9] text-d-text-dim [.light_&]:text-l-text-dim" dir="auto">
                        {seg.content}<span className="inline-block h-4 w-[2px] animate-pulse bg-d-gold/50 mr-0.5" />
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {isLoading && !streamingContent && <LoadingSkeleton />}
            <div ref={endRef} />
          </main>

          <ChatInput onSend={handleSearch} isLoading={isLoading} onStop={stop} />
        </>
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
