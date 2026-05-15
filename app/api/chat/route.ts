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

function classifyRequest(q: string): "morning" | "evening" | "both_adhkar" | "dua" | null {
  const ql = q.toLowerCase();
  const adhkarWords = ["أذكار","الأذكار","اذكار","adhkar","azkar","remembrance"];
  const morningWords = ["صباح","morning"];
  const eveningWords = ["مساء","evening"];
  const duaWords = ["دعاء","أدعية","ادعية","dua","duas","supplication"];

  if (adhkarWords.some(k => ql.includes(k))) {
    if (morningWords.some(k => ql.includes(k)) && !eveningWords.some(k => ql.includes(k))) return "morning";
    if (eveningWords.some(k => ql.includes(k)) && !morningWords.some(k => ql.includes(k))) return "evening";
    return "both_adhkar";
  }
  if (duaWords.some(k => ql.includes(k))) return "dua";
  return null;
}

function getAdhkarContext(type: string): string {
  const ksu = sources.find((s: any) => s.id === "ksu");
  const nuq = sources.find((s: any) => s.id === "nuqayah");
  if (type === "morning" || type === "evening" || type === "both_adhkar") {
    let f = morningEvening;
    if (type === "morning") f = morningEvening.filter((d: any) => d.time === "صباح" || d.time === "صباح ومساء");
    else if (type === "evening") f = morningEvening.filter((d: any) => d.time === "مساء" || d.time === "صباح ومساء");
    const label = type === "morning" ? "أذكار الصباح" : type === "evening" ? "أذكار المساء" : "أذكار الصباح والمساء";
    return `[ADHKAR_CONTEXT — المصدر: ${ksu.name}]\nالنوع: ${label}\n\n${f.map((d: any) => `【الذكر】: ${d.text}\n【التكرار】: ${d.repetition}\n【الوقت】: ${d.time}`).join("\n\n")}\n\nاعرض كل ذكر بالصيغة أعلاه بالضبط.`;
  }
  if (type === "dua") {
    return `[ADHKAR_CONTEXT — المصدر: ${nuq.name}]\nالنوع: أدعية من الكتاب والسنة\n\n${duas.map((d: any) => `【الذكر】: ${d.text}\n【التكرار】: مرة واحدة\n【الوقت】: ${d.category}`).join("\n\n")}\n\nاعرض كل دعاء بالصيغة أعلاه بالضبط.`;
  }
  return "";
}

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
    patience:["patience","صبر","الصبر","steadfast"],rizq:["rizq","رزق","الرزق","provision"],
    gratitude:["شكر","الحمد","grateful"],anxiety:["حزن","قلق","خوف","anxiety","grief"],
    hardship:["ابتلاء","بلاء","مصيبة","hardship","trial"],tawakkul:["توكل","التوكل","trust"],
    mercy:["رحمة","الرحمة","mercy"],forgiveness:["توبة","غفر","استغفار","forgive"],
    prayer:["صلاة","الصلاة","prayer"],paradise:["جنة","الجنة","paradise"],
    parents:["والدين","بر","parents"],knowledge:["علم","حكمة","knowledge"],
  };
  const matched: string[] = [];
  for (const [t, kws] of Object.entries(topics)) if (kws.some(k => ql.includes(k))) matched.push(t);
  const results: { s: Surah; v: Verse; score: number }[] = [];
  for (const s of quran) for (const v of s.verses) {
    const tr = v.translation.toLowerCase(); let sc = 0;
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

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash-001", "gemini-1.5-flash"];

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not set" }), { status: 500 });

  try {
    const { messages } = await req.json();
    const last = messages[messages.length - 1]?.content || "";
    let context = "";
    const reqType = classifyRequest(last);
    if (reqType) context = getAdhkarContext(reqType);
    else { const qc = searchQuran(last); if (qc) context = `[QURAN_CONTEXT]\n${qc}`; }

    const contents = messages.slice(-10).map((m: any, i: number, a: any[]) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: i === a.length - 1 && m.role === "user" && context ? `${m.content}\n\n${context}` : m.content }],
    }));

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    let response;

    for (const model of MODELS) {
      try {
        response = await ai.models.generateContentStream({
          model, contents,
          config: { maxOutputTokens: 4096, temperature: 0.3, systemInstruction: SYSTEM_PROMPT },
        });
        break;
      } catch (e: any) {
        if (e.message?.includes("503") || e.message?.includes("404") || e.message?.includes("UNAVAILABLE")) continue;
        throw e;
      }
    }

    if (!response) return new Response(JSON.stringify({ error: "جميع النماذج غير متوفرة حالياً. يرجى المحاولة لاحقاً." }), { status: 503 });

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
          ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ text: "\n\nعذراً، حدث خطأ. يرجى المحاولة مرة أخرى." })}\n\n`));
          ctrl.enqueue(enc.encode("data: [DONE]\n\n"));
          ctrl.close();
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "خطأ غير متوقع" }), { status: 500 });
  }
}
