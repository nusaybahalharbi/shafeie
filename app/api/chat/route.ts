import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import quranData from "@/public/data/quran.json";
import adhkarData from "@/public/data/adhkar.json";

export const maxDuration = 60;

interface Verse { id: number; text: string; translation: string; }
interface Surah { id: number; name: string; transliteration: string; translation: string; type: string; total_verses: number; verses: Verse[]; }

const quran: Surah[] = quranData as Surah[];
const morningEvening = (adhkarData as any).morning_evening;
const duas = (adhkarData as any).duas;
const sources = (adhkarData as any).sources;

// --- Request classification ---

type RequestType = "morning" | "evening" | "both_adhkar" | "dua" | "quran" | null;

function classifyRequest(q: string): RequestType {
  const ql = q.toLowerCase();

  const adhkarWords = ["أذكار","الأذكار","اذكار","الاذكار","adhkar","azkar","remembrance"];
  const morningWords = ["صباح","morning","الصباح"];
  const eveningWords = ["مساء","evening","المساء"];
  const duaWords = ["دعاء","أدعية","ادعية","الدعاء","dua","duas","supplication","supplications","دعوات"];

  const hasAdhkar = adhkarWords.some(k => ql.includes(k));
  const hasMorning = morningWords.some(k => ql.includes(k));
  const hasEvening = eveningWords.some(k => ql.includes(k));
  const hasDua = duaWords.some(k => ql.includes(k));

  if (hasAdhkar) {
    if (hasMorning && !hasEvening) return "morning";
    if (hasEvening && !hasMorning) return "evening";
    return "both_adhkar";
  }
  if (hasDua) return "dua";
  return null;
}

function getAdhkarContext(type: RequestType): string {
  const ksuSource = sources.find((s: any) => s.id === "ksu");
  const nuqSource = sources.find((s: any) => s.id === "nuqayah");

  if (type === "morning" || type === "evening" || type === "both_adhkar") {
    let filtered;
    if (type === "morning") filtered = morningEvening.filter((d: any) => d.time === "صباح" || d.time === "صباح ومساء");
    else if (type === "evening") filtered = morningEvening.filter((d: any) => d.time === "مساء" || d.time === "صباح ومساء");
    else filtered = morningEvening;

    const label = type === "morning" ? "أذكار الصباح" : type === "evening" ? "أذكار المساء" : "أذكار الصباح والمساء";
    const items = filtered.map((d: any, i: number) =>
      `【الذكر】: ${d.text}\n【التكرار】: ${d.repetition}\n【الوقت】: ${d.time}`
    ).join("\n\n");

    return `[ADHKAR_CONTEXT — المصدر: ${ksuSource.name}]\nالنوع: ${label}\n\n${items}\n\nاعرض كل ذكر باستخدام الصيغة أعلاه بالضبط. لا تُعدّل النصوص.`;
  }

  if (type === "dua") {
    const items = duas.map((d: any) =>
      `【الذكر】: ${d.text}\n【التكرار】: مرة واحدة\n【الوقت】: ${d.category}`
    ).join("\n\n");

    return `[ADHKAR_CONTEXT — المصدر: ${nuqSource.name}]\nالنوع: أدعية من الكتاب والسنة الصحيحة\n\n${items}\n\nاعرض كل دعاء باستخدام الصيغة أعلاه بالضبط. لا تُعدّل النصوص.`;
  }

  return "";
}

// --- Quran search ---

function searchQuran(q: string): string {
  const ql = q.toLowerCase();
  const numRef = ql.match(/(\d+)\s*:\s*(\d+)/);
  if (numRef) {
    const s = quran[parseInt(numRef[1]) - 1];
    if (s) { const v = s.verses.find(v => v.id === parseInt(numRef[2])); if (v) return fmt(s, v); }
  }
  const surahMatch = ql.match(/(?:surah|sura|سورة)\s*(?:al[- ]?)?(\S+).*?(?:ayah|aya|verse|آية|اية)\s*[:#]?\s*(\d+)/i);
  if (surahMatch) {
    const sq = surahMatch[1].toLowerCase();
    const s = quran.find(s => s.transliteration.toLowerCase().includes(sq) || s.name.includes(surahMatch[1]) || s.translation.toLowerCase().includes(sq));
    if (s) { const v = s.verses.find(v => v.id === parseInt(surahMatch[2])); if (v) return fmt(s, v); }
  }

  const topics: Record<string, string[]> = {
    patience:["patience","patient","sabr","صبر","الصبر","steadfast","endure"],
    rizq:["rizq","provision","رزق","الرزق","sustenance","wealth"],
    gratitude:["grateful","gratitude","شكر","الشكر","الحمد","حمد","thankful"],
    anxiety:["anxiety","worry","حزن","قلق","هم","خوف","الحزن","grief","sorrow","fear"],
    hardship:["hardship","trial","ابتلاء","بلاء","مصيبة","شدة","عسر","difficulty"],
    tawakkul:["tawakkul","trust","توكل","التوكل","rely"],
    mercy:["mercy","رحمة","الرحمة","merciful"],
    forgiveness:["forgive","توبة","غفر","استغفار","مغفرة","repent"],
    prayer:["prayer","صلاة","الصلاة","عبادة","salah"],
    dua:["دعاء","الدعاء","supplication","ادعوني"],
    paradise:["paradise","جنة","الجنة","jannah"],
    parents:["parents","والدين","الوالدين","بر"],
    knowledge:["knowledge","علم","العلم","حكمة","wisdom"],
    death:["death","موت","الموت","آخرة"],
  };

  const matched: string[] = [];
  for (const [t, kws] of Object.entries(topics)) if (kws.some(k => ql.includes(k))) matched.push(t);

  const results: { s: Surah; v: Verse; score: number }[] = [];
  for (const s of quran) for (const v of s.verses) {
    const tr = v.translation.toLowerCase();
    let sc = 0;
    for (const w of ql.split(/\s+/).filter(w => w.length > 2)) { if (tr.includes(w)) sc += 2; if (v.text.includes(w)) sc += 3; }
    for (const t of matched) for (const k of topics[t]) { if (tr.includes(k)) sc += 1; if (v.text.includes(k)) sc += 2; }
    if (sc > 0) results.push({ s, v, score: sc });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 5).map(r => fmt(r.s, r.v)).join("\n\n") || "";
}

function fmt(s: Surah, v: Verse) {
  const pos = v.id <= Math.ceil(s.total_verses * 0.2) ? "بداية" : v.id >= Math.ceil(s.total_verses * 0.8) ? "نهاية" : "وسط";
  return `[${s.name} (${s.transliteration}) | سورة ${s.id} | ${s.type === "meccan" ? "مكية" : "مدنية"} | آية ${v.id}/${s.total_verses} | ${pos}]\nعربي: ${v.text}\nترجمة: ${v.translation}`;
}

// --- API Route ---

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not set" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const { messages } = await req.json();
    const last = messages[messages.length - 1]?.content || "";

    let context = "";
    const reqType = classifyRequest(last);

    if (reqType) {
      context = getAdhkarContext(reqType);
    } else {
      const quranCtx = searchQuran(last);
      if (quranCtx) context = `[QURAN_CONTEXT — استخدم النص العربي أدناه بالضبط.]\n${quranCtx}`;
    }

    const contents = messages.slice(-10).map((m: any, i: number, a: any[]) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: i === a.length - 1 && m.role === "user" && context ? `${m.content}\n\n${context}` : m.content }],
    }));

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: contents,
      config: { maxOutputTokens: 4096, temperature: 0.3, systemInstruction: SYSTEM_PROMPT },
    });

    const enc = new TextEncoder();
    const stream = new ReadableStream({
      async start(ctrl) {
        try {
          for await (const chunk of response) {
            const t = chunk.text;
            if (t) ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ text: t })}\n\n`));
          }
          ctrl.enqueue(enc.encode("data: [DONE]\n\n"));
          ctrl.close();
        } catch (e: any) {
          console.error("Stream error:", e);
          ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ text: "\n\nخطأ: " + (e.message || "unknown") })}\n\n`));
          ctrl.enqueue(enc.encode("data: [DONE]\n\n"));
          ctrl.close();
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
  } catch (e: any) {
    console.error("API error:", e);
    return new Response(JSON.stringify({ error: e.message || "Unknown error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
