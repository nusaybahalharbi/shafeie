export interface AyahFields {
  arabic: string; translation: string; surah: string; ayahNumber: string;
  makkiMadani: string; location: string; tafsir: string;
  sababNuzul: string; hadith: string; narrations: string;
}

export interface DhikrFields {
  text: string; repetition: string; time: string;
}

export type Segment =
  | { type: "text"; content: string }
  | { type: "card"; fields: AyahFields }
  | { type: "dhikr"; fields: DhikrFields };

export function parseAyahCards(text: string, isStreaming: boolean = false): Segment[] {
  const segments: Segment[] = [];

  // First pass: extract ayah cards
  const ayahRe = /===AYAH_START===([\s\S]*?)===AYAH_END===/g;
  let last = 0, m;

  const fieldMap: Record<string, keyof AyahFields> = {
    "الآية": "arabic", Arabic: "arabic",
    "الترجمة": "translation", Translation: "translation",
    "السورة": "surah", Surah: "surah",
    "رقم الآية": "ayahNumber", "Ayah Number": "ayahNumber",
    "مكية/مدنية": "makkiMadani", "Makki/Madani": "makkiMadani",
    "الموقع في السورة": "location", "Location in Surah": "location",
    "التفسير (ابن كثير)": "tafsir", "Tafsir (Ibn Kathir)": "tafsir",
    "سبب النزول": "sababNuzul", "Sabab al-Nuzul": "sababNuzul",
    "صحيح البخاري": "hadith", "Sahih al-Bukhari": "hadith",
    "روايات ذات صلة": "narrations", "Related Narrations": "narrations",
  };

  while ((m = ayahRe.exec(text)) !== null) {
    const before = text.substring(last, m.index).trim();
    if (before) parseTextWithDhikr(before, segments);

    const fields: AyahFields = { arabic:"",translation:"",surah:"",ayahNumber:"",makkiMadani:"",location:"",tafsir:"",sababNuzul:"",hadith:"",narrations:"" };
    const fr = /【([^】]+)】:\s*([\s\S]*?)(?=【|$)/g;
    let fm;
    while ((fm = fr.exec(m[1])) !== null) {
      const k = fm[1].trim();
      if (fieldMap[k]) fields[fieldMap[k]] = fm[2].trim();
    }
    segments.push({ type: "card", fields });
    last = m.index + m[0].length;
  }

  let rest = text.substring(last).trim();

  if (isStreaming && rest) {
    const startIdx = rest.indexOf("===AYAH_START===");
    if (startIdx !== -1) rest = rest.substring(0, startIdx).trim();
    const partialIdx = rest.lastIndexOf("===");
    if (partialIdx !== -1 && partialIdx > rest.length - 20) rest = rest.substring(0, partialIdx).trim();
  }

  if (!isStreaming && rest) rest = rest.replace(/===AYAH_START===|===AYAH_END===/g, "").trim();

  if (rest) parseTextWithDhikr(rest, segments);

  if (!segments.length && text.trim()) {
    let cleaned = text.replace(/===AYAH_START===|===AYAH_END===/g, "").trim();
    if (cleaned) parseTextWithDhikr(cleaned, segments);
  }
  return segments;
}

// Parse text blocks for dhikr patterns like 【الذكر】: ... 【التكرار】: ... 【الوقت】: ...
function parseTextWithDhikr(text: string, segments: Segment[]) {
  const dhikrPattern = /【الذكر】\s*:\s*([\s\S]*?)【التكرار】\s*:\s*([\s\S]*?)【الوقت】\s*:\s*([^\n【]*)/g;
  let lastIdx = 0;
  let dm;

  while ((dm = dhikrPattern.exec(text)) !== null) {
    const before = text.substring(lastIdx, dm.index).trim();
    if (before && !before.match(/^\*?\*?$/)) {
      const cleaned = before.replace(/\*\*/g, "").trim();
      if (cleaned) segments.push({ type: "text", content: cleaned });
    }

    segments.push({
      type: "dhikr",
      fields: {
        text: dm[1].trim(),
        repetition: dm[2].trim(),
        time: dm[3].trim(),
      }
    });
    lastIdx = dm.index + dm[0].length;
  }

  const remaining = text.substring(lastIdx).trim();
  if (remaining) {
    const cleaned = remaining.replace(/\*\*/g, "").trim();
    if (cleaned) segments.push({ type: "text", content: cleaned });
  }
}

export function isArabic(t: string) { return (t.match(/[\u0600-\u06FF]/g)||[]).length > (t.match(/[a-zA-Z]/g)||[]).length; }
export function isEmpty(v?: string) { if(!v) return true; const l=v.toLowerCase().trim(); return l.startsWith("no ")||l.startsWith("لا يوجد")||l.startsWith("لم يُوجد")||l.startsWith("لا توجد")||l==="n/a"; }
