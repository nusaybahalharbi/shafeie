"use client";

import { parseResponse, Segment } from "@/lib/parser";
import AyahCard from "@/components/cards/AyahCard";
import DhikrCard from "@/components/cards/DhikrCard";

export default function ChatMessage({ role, content }: { role: "user" | "assistant"; content: string }) {
  if (role === "user") {
    const display = content.replace(/\n\n\[RESPOND IN ENGLISH\]$/, "");

    return (
      <div className="mb-4 flex justify-start sm:mb-5">
        <div className="max-w-[88%] break-words rounded-2xl rounded-tr-sm border border-d-gold/15 bg-d-gold-soft px-4 py-3 font-body text-sm leading-7 text-d-text [.light_&]:border-l-gold/15 [.light_&]:bg-l-gold-soft [.light_&]:text-l-text sm:max-w-[80%] sm:px-5" dir="auto">
          {display}
        </div>
      </div>
    );
  }

  const segments = parseResponse(content, false);
  let dhikrCount = 0;

  return (
    <div className="mb-5 flex gap-2 sm:gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-d-gold/20 to-d-gold/5 text-sm [.light_&]:from-l-gold/15 [.light_&]:to-l-gold/5">
        ☽
      </div>
      <div className="min-w-0 flex-1">
        {segments.map((seg: Segment, index: number) => {
          if (seg.type === "card") return <AyahCard key={index} fields={seg.fields} />;
          if (seg.type === "dhikr") {
            dhikrCount++;
            return <DhikrCard key={index} fields={seg.fields} index={dhikrCount} />;
          }

          const refusal = seg.content.includes("عذراً") || seg.content.includes("I'm sorry") || seg.content.includes("خطأ:");

          return (
            <div key={index} className={`mb-3 ${refusal ? "rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 sm:px-5 sm:py-4" : ""}`}>
              <p className={`whitespace-pre-wrap break-words font-body text-sm leading-[1.9] ${refusal ? "text-red-300 [.light_&]:text-red-600" : "text-d-text-dim [.light_&]:text-l-text-dim"}`} dir="auto">
                {seg.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
