"use client";
import { parseAyahCards, Segment } from "@/lib/parser";
import AyahCard from "./AyahCard";

export default function ChatMessage({ role, content }: { role: "user" | "assistant"; content: string }) {
  if (role === "user") {
    return (
      <div className="mb-5 flex justify-start animate-slide-up">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm border border-nur-gold/[0.18] bg-gradient-to-br from-nur-gold/[0.12] to-nur-gold/[0.06] px-5 py-3 font-body text-sm leading-relaxed text-nur-text" dir="auto">{content}</div>
      </div>
    );
  }
  const segments = parseAyahCards(content);
  return (
    <div className="mb-5 flex gap-3 animate-slide-up">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nur-gold to-nur-gold-dim text-sm shadow-lg shadow-nur-gold/20">☽</div>
      <div className="min-w-0 flex-1">
        {segments.map((seg: Segment, i: number) => {
          if (seg.type === "card") return <AyahCard key={i} fields={seg.fields} />;
          const refusal = seg.content.includes("عذراً") || seg.content.includes("لا أستطيع") || seg.content.includes("I'm sorry");
          return (
            <div key={i} className={`mb-3 ${refusal ? "rounded-xl border border-red-400/20 bg-nur-danger-bg px-5 py-4" : ""}`}>
              <p className={`whitespace-pre-wrap font-body text-sm leading-[1.85] ${refusal ? "text-nur-danger" : "text-nur-text-dim"}`} dir="auto">{seg.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
