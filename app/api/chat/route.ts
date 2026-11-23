import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import quranData from "@/public/data/quran.json";
import adhkarData from "@/public/data/adhkar.json";

export const maxDuration = 60;

interface Verse {
  id: number;
  text: string;
  translation: string;
}

interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
  verses: Verse[];
}

const quran: Surah[] = quranData as Surah[];
const morningEvening = (adhkarData as any).morning_evening;
const duas = (adhkarData as any).duas;
const sources = (adhkarData as any).sources;

const MODEL = process.env.OPENAI_MODEL || "gpt-6.2-astra";

function jsonError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function classifyRequest(
  q: string
): "morning" | "evening" | "both_adhkar" | "dua" | null {
  const ql = q.toLowerCase();

  const adhkarWords = [
    "أذكار",
    "الأذكار",
    "اذكار",
    "adhkar",
    "azkar",
    "remembrance",
  ];

  const morningWords = ["صباح", "morning"];
  const eveningWords = ["مساء", "evening"];
  const duaWords = ["دعاء", "أدعية", "ادعية", "dua", "duas", "supplication"];

  if (adhkarWords.some((k) => ql.includes(k))) {
    if (
      morningWords.some((k) => ql.includes(k)) &&
      !eveningWords.some((k) => ql.includes(k))
    ) {
      return "morning";
    }

    if (
      eveningWords.some((k) => ql.includes(k)) &&
      !morningWords.some((k) => ql.includes(k))
    ) {
      return "evening";
    }

    return "both_adhkar";
  }

  if (duaWords.some((k) => ql.includes(k))) return "dua";

  return null;
}

function getAdhkarContext(type: string): string {
  const ksu = sources.find((s: any) => s.id === "ksu");
  const nuq = sources.find((s: any) => s.id === "nuqayah");

  if (type === "morning" || type === "evening" || type === "both_adhkar") {
    let filtered = morningEvening;

    if (type === "morning") {
      filtered = morningEvening.filter(
        (d: any) => d.time === "صباح" || d.time === "صباح ومساء"
      );
    } else if (type === "evening") {
      filtered = morningEvening.filter(
        (d: any) => d.time === "مساء" || d.time === "صباح ومساء"
      );
    }

    const label =
      type === "morning"
        ? "أذكار الصباح"
        : type === "evening"
          ? "أذكار المساء"
          : "أذكار الصباح والمساء";

    return `[ADHKAR_CONTEXT — المصدر: ${ksu?.name || "مصدر الأذكار"}]
النوع: ${label}

${filtered
  .map(
    (d: any) =>
      `【الذكر】: ${d.text}
【التكرار】: ${d.repetition}
【الوقت】: ${d.time}`
  )
  .join("\n\n")}

اعرض كل ذكر بالصيغة أعلاه بالضبط.`;
  }

  if (type === "dua") {
    return `[ADHKAR_CONTEXT — المصدر: ${nuq?.name || "مصدر الأدعية"}]
النوع: أدعية من الكتاب والسنة

${duas
  .map(
    (d: any) =>
      `【الذكر】: ${d.text}
【التكرار】: مرة واحدة
【الوقت】: ${d.category}`
  )
  .join("\n\n")}

اعرض كل دعاء بالصيغة أعلاه بالضبط.`;
  }

  return "";
}

function formatVerse(surah: Surah, verse: Verse) {
  const position =
    verse.id <= Math.ceil(surah.total_verses * 0.2)
      ? "بداية"
      : verse.id >= Math.ceil(surah.total_verses * 0.8)
        ? "نهاية"
        : "وسط";

  return `[${surah.name} (${surah.transliteration}) | سورة ${surah.id} | ${
    surah.type === "meccan" ? "مكية" : "مدنية"
  } | آية ${verse.id}/${surah.total_verses} | ${position}]
عربي: ${verse.text}
ترجمة: ${verse.translation}`;
}

function searchQuran(q: string): string {
  const ql = q.toLowerCase();

  const numRef = ql.match(/(\d+)\s*:\s*(\d+)/);

  if (numRef) {
    const surah = quran[parseInt(numRef[1], 10) - 1];

    if (surah) {
      const verse = surah.verses.find(
        (v) => v.id === parseInt(numRef[2], 10)
      );

      if (verse) return formatVerse(surah, verse);
    }
  }

  const surahMatch = ql.match(
    /(?:surah|sura|سورة)\s*(?:al[- ]?)?(\S+).*?(?:ayah|aya|verse|آية|اية)\s*[:#]?\s*(\d+)/i
  );

  if (surahMatch) {
    const surahQuery = surahMatch[1].toLowerCase();

    const surah = quran.find(
      (s) =>
        s.transliteration.toLowerCase().includes(surahQuery) ||
        s.name.includes(surahMatch[1]) ||
        s.translation.toLowerCase().includes(surahQuery)
    );

    if (surah) {
      const verse = surah.verses.find(
        (v) => v.id === parseInt(surahMatch[2], 10)
      );

      if (verse) return formatVerse(surah, verse);
    }
  }

  const topics: Record<string, string[]> = {
    patience: ["patience", "صبر", "الصبر", "steadfast"],
    rizq: ["rizq", "رزق", "الرزق", "provision"],
    gratitude: ["شكر", "الحمد", "grateful"],
    anxiety: ["حزن", "قلق", "خوف", "anxiety", "grief"],
    hardship: ["ابتلاء", "بلاء", "مصيبة", "hardship", "trial"],
    tawakkul: ["توكل", "التوكل", "trust"],
    mercy: ["رحمة", "الرحمة", "mercy"],
    forgiveness: ["توبة", "غفر", "استغفار", "forgive"],
    prayer: ["صلاة", "الصلاة", "prayer"],
    paradise: ["جنة", "الجنة", "paradise"],
    parents: ["والدين", "بر", "parents"],
    knowledge: ["علم", "حكمة", "knowledge"],
  };

  const matchedTopics: string[] = [];

  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some((keyword) => ql.includes(keyword))) {
      matchedTopics.push(topic);
    }
  }

  const results: { surah: Surah; verse: Verse; score: number }[] = [];

  for (const surah of quran) {
    for (const verse of surah.verses) {
      const translation = verse.translation.toLowerCase();
      let score = 0;

      for (const word of ql.split(/\s+/).filter((w) => w.length > 2)) {
        if (translation.includes(word)) score += 2;
        if (verse.text.includes(word)) score += 3;
      }

      for (const topic of matchedTopics) {
        for (const keyword of topics[topic]) {
          if (translation.includes(keyword)) score += 1;
          if (verse.text.includes(keyword)) score += 2;
        }
      }

      if (score > 0) {
        results.push({ surah, verse, score });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);

  return (
    results
      .slice(0, 5)
      .map((result) => formatVerse(result.surah, result.verse))
      .join("\n\n") || ""
  );
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return jsonError("OPENAI_API_KEY is not set", 500);
  }

  try {
    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (!messages.length) {
      return jsonError("لم يتم إرسال أي رسالة.", 400);
    }

    const lastMessage = messages[messages.length - 1]?.content || "";

    let context = "";
    const requestType = classifyRequest(lastMessage);

    if (requestType) {
      context = getAdhkarContext(requestType);
    } else {
      const quranContext = searchQuran(lastMessage);
      if (quranContext) context = `[QURAN_CONTEXT]\n${quranContext}`;
    }

    const input = messages.slice(-10).map((m: any, index: number, arr: any[]) => {
      const isLastUserMessage =
        index === arr.length - 1 && m.role === "user" && context;

      return {
        role: m.role === "assistant" ? "assistant" : "user",
        content: isLastUserMessage
          ? `${m.content}\n\n${context}`
          : String(m.content || ""),
      };
    });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: SYSTEM_PROMPT,
        input,
        max_output_tokens: 4096,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      const details = await response.text();
      console.error("OpenAI request failed", {
        status: response.status,
        details: details.substring(0, 500),
      });
      return jsonError("تعذر توليد الإجابة حالياً. الرجاء المحاولة مرة أخرى.", response.status || 503);
    }

    console.info(`OpenAI response streaming with model: ${MODEL}`);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split("\n\n");
            buffer = events.pop() || "";

            for (const event of events) {
              const line = event.split("\n").find((item) => item.startsWith("data: "));
              if (!line || line === "data: [DONE]") continue;

              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "response.output_text.delta" && data.delta) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text: data.delta })}\n\n`)
                  );
                }
              } catch {
                // Ignore incomplete/non-JSON stream events.
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error: any) {
          console.error("OpenAI stream error:", {
            message: error?.message,
            status: error?.status,
          });

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                text: "\n\nتعذر إكمال الإجابة حالياً. الرجاء المحاولة مرة أخرى.",
              })}\n\n`
            )
          );

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: any) {
    console.error("API route error:", {
      message: error?.message,
      status: error?.status,
    });

    return jsonError(
      "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.",
      500
    );
  }
}
