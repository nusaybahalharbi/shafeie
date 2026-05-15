"use client";
import { useState, useCallback, useRef } from "react";

export interface Message { role: "user" | "assistant"; content: string; }

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string, retries = 2) => {
    if (!content.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: content.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsLoading(true);
    setStreamingContent("");
    abortRef.current = new AbortController();

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updated }),
          signal: abortRef.current.signal,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Unknown" }));
          if (attempt < retries && (res.status === 503 || res.status === 429)) {
            await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
            continue;
          }
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value, { stream: true }).split("\n")) {
            if (line.startsWith("data: ")) {
              const d = line.slice(6);
              if (d === "[DONE]") break;
              try { const p = JSON.parse(d); if (p.text) { full += p.text; setStreamingContent(full); } } catch {}
            }
          }
        }
        setMessages(prev => [...prev, { role: "assistant", content: full }]);
        setStreamingContent("");
        setIsLoading(false);
        return;
      } catch (e: any) {
        if (e.name === "AbortError") { setIsLoading(false); return; }
        if (attempt === retries) {
          setMessages(prev => [...prev, { role: "assistant", content: "خطأ: " + (e.message || "حدث خطأ غير معروف") }]);
        }
      }
    }
    setIsLoading(false);
    setStreamingContent("");
  }, [messages, isLoading]);

  const stop = useCallback(() => { abortRef.current?.abort(); setIsLoading(false); }, []);
  const reset = useCallback(() => { setMessages([]); setStreamingContent(""); }, []);
  return { messages, isLoading, streamingContent, sendMessage, stop, reset };
}
