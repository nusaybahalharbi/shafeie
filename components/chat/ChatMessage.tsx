"use client";
import { parseResponse, Segment } from "@/lib/parser";
import AyahCard from "@/components/cards/AyahCard";
import DhikrCard from "@/components/cards/DhikrCard";

let dhikrCount = 0;

export default function ChatMessage({ role, content }: { role: "user" | "assistant"; content: string }) {
  if (role === "user") {
    const display = content.replace(/\n\n\[RESPOND IN ENGLISH\]$/, "");
    return (
      <div className="mb-5 flex justify-start animate-slide-up">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm border border-d-gold/15 [.light_&]:border-l-gold/15 bg-d-gold-soft [.light_&]:bg-l-gold-soft px-5 py-3 font-body text-sm leading-relaxed text-d-text [.light_&]:text-l-text" dir="auto">{display}</div>
      </div>
    );
  }

  const segments = parseResponse(content, false);
  dhikrCount = 0;

  return (
    <div className="mb-5 flex gap-3 animate-slide-up">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-d-gold/20 to-d-gold/5 [.light_&]:from-l-gold/15 [.light_&]:to-l-gold/5 text-sm">☽</div>
      <div className="min-w-0 flex-1">
        {segments.map((seg: Segment, i: number) => {
          if (seg.type === "card") return <AyahCard key={i} fields={seg.fields} />;
          if (seg.type === "dhikr") { dhikrCount++; return <DhikrCard key={i} fields={seg.fields} index={dhikrCount} />; }
          const refusal = seg.content.includes("عذراً") || seg.content.includes("I'm sorry");
          return (
            <div key={i} className={`mb-3 ${refusal ? "rounded-xl border border-red-400/15 bg-red-400/5 px-5 py-4" : ""}`}>
              <p className={`whitespace-pre-wrap font-body text-sm leading-[1.9] ${refusal ? "text-red-300 [.light_&]:text-red-600" : "text-d-text-dim [.light_&]:text-l-text-dim"}`} dir="auto">{seg.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
