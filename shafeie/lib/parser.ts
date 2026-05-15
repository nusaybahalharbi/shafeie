export interface AyahFields {
  arabic: string;
  translation: string;
  surah: string;
  ayahNumber: string;
  makkiMadani: string;
  location: string;
  tafsir: string;
  sababNuzul: string;
  hadith: string;
  narrations: string;
}

export interface DhikrFields {
  text: string;
  repetition: string;
  time: string;
}

export type Segment =
  | { type: "text"; content: string }
  | { type: "card"; fields: AyahFields }
  | { type: "dhikr"; fields: DhikrFields };

const emptyAyahFields = (): AyahFields => ({
  arabic: "",
  translation: "",
  surah: "",
  ayahNumber: "",
  makkiMadani: "",
  location: "",
  tafsir: "",
  sababNuzul: "",
  hadith: "",
  narrations: "",
});

const fieldMap: Record<string, keyof AyahFields> = {
  "الآية": "arabic",
  Arabic: "arabic",

  "الترجمة": "translation",
  Translation: "translation",

  "السورة": "surah",
  Surah: "surah",

  "رقم الآية": "ayahNumber",
  "Ayah Number": "ayahNumber",

  "مكية/مدنية": "makkiMadani",
  "Makki/Madani": "makkiMadani",

  "الموقع في السورة": "location",
  "Location in Surah": "location",

  "التفسير (ابن كثير)": "tafsir",
  "Tafsir (Ibn Kathir)": "tafsir",

  "سبب النزول": "sababNuzul",
  "Sabab al-Nuzul": "sababNuzul",

  "صحيح البخاري": "hadith",
  "Sahih al-Bukhari": "hadith",

  "روايات ذات صلة": "narrations",
  "Related Narrations": "narrations",
};

export function parseResponse(text: string, isStreaming = false): Segment[] {
  const segments: Segment[] = [];

  if (!text?.trim()) return segments;

  const ayahRegex = /===AYAH_START===([\s\S]*?)===AYAH_END===/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = ayahRegex.exec(text)) !== null) {
    const before = text.substring(lastIndex, match.index).trim();

    if (before) {
      parseDhikr(before, segments);
    }

    const fields = emptyAyahFields();

    const fieldRegex = /【([^】]+)】:\s*([\s\S]*?)(?=【|$)/g;
    let fieldMatch: RegExpExecArray | null;

    while ((fieldMatch = fieldRegex.exec(match[1])) !== null) {
      const key = fieldMatch[1].trim();
      const value = fieldMatch[2].trim();

      if (fieldMap[key]) {
        fields[fieldMap[key]] = value;
      }
    }

    segments.push({
      type: "card",
      fields,
    });

    lastIndex = match.index + match[0].length;
  }

  let rest = text.substring(lastIndex).trim();

  if (isStreaming && rest) {
    const startIndex = rest.indexOf("===AYAH_START===");

    if (startIndex !== -1) {
      rest = rest.substring(0, startIndex).trim();
    }

    const partialMarkerIndex = rest.lastIndexOf("===");

    if (partialMarkerIndex !== -1 && partialMarkerIndex > rest.length - 20) {
      rest = rest.substring(0, partialMarkerIndex).trim();
    }
  }

  if (!isStreaming && rest) {
    rest = rest.replace(/===AYAH_START===|===AYAH_END===/g, "").trim();
  }

  if (rest) {
    parseDhikr(rest, segments);
  }

  if (!segments.length) {
    const cleaned = text
      .replace(/===AYAH_START===|===AYAH_END===/g, "")
      .trim();

    if (cleaned) {
      parseDhikr(cleaned, segments);
    }
  }

  return segments;
}

function parseDhikr(text: string, segments: Segment[]) {
  const dhikrRegex =
    /【الذكر】\s*:\s*([\s\S]*?)【التكرار】\s*:\s*([\s\S]*?)【الوقت】\s*:\s*([^\n【]*)/g;

  let lastIndex = 0;
  let dhikrMatch: RegExpExecArray | null;

  while ((dhikrMatch = dhikrRegex.exec(text)) !== null) {
    const before = text
      .substring(lastIndex, dhikrMatch.index)
      .replace(/\*\*/g, "")
      .trim();

    if (before) {
      segments.push({
        type: "text",
        content: before,
      });
    }

    segments.push({
      type: "dhikr",
      fields: {
        text: dhikrMatch[1].trim(),
        repetition: dhikrMatch[2].trim(),
        time: dhikrMatch[3].trim(),
      },
    });

    lastIndex = dhikrMatch.index + dhikrMatch[0].length;
  }

  const remaining = text.substring(lastIndex).replace(/\*\*/g, "").trim();

  if (remaining) {
    segments.push({
      type: "text",
      content: remaining,
    });
  }
}

export function parseAyahCards(text: string, isStreaming = false): Segment[] {
  return parseResponse(text, isStreaming);
}

export function isEmpty(value?: string) {
  if (!value) return true;

  const normalized = value.toLowerCase().trim();

  return (
    normalized.startsWith("no ") ||
    normalized.startsWith("لا يوجد") ||
    normalized.startsWith("لم يُوجد") ||
    normalized.startsWith("لا توجد") ||
    normalized === "n/a"
  );
}