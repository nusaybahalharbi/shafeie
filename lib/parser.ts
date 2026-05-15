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

export function parseResponse(text: string, isStreaming = false): Segment[] {
  const segments: Segment[] = [];
  const ayahRe = /===AYAH_START===([\s\S]*?)===AYAH_END===/g;
  let last = 0, m;

  const fieldMap: Record<string, keyof AyahFields> = {
    "الآية": "arabic", Arabic: "arabic", "الترجمة": "translation", Translation: "translation",
    "السورة": "surah", Surah: "surah", "رقم الآية": "ayahNumber", "Ayah Number": "ayahNumber",
    "مكية/مدنية": "makkiMadani", "Makki/Madani": "makkiMadani",
    "الموقع في السورة": "location", "Location in Surah": "location",
    "التفسير (ابن كثير)": "tafsir", "Tafsir (Ibn Kathir)": "tafsir",
    "سبب النزول": "sababNuzul", "Sabab al-Nuzul": "sababNuzul",
    "صحيح البخاري": "hadith", "Sahih al-Bukhari": "hadith",
    "روايات ذات صلة": "narrations", "Related Narrations": "narrations",
  };

  while ((m = ayahRe.exec(text)) !== null) {
    const before = text.substring(last, m.index).trim();
    if (before) parseDhikr(before, segments);
    const fields: AyahFields = { arabic:"",translation:"",surah:"",ayahNumber:"",makkiMadani:"",location:"",tafsir:"",sababNuzul:"",hadith:"",narrations:"" };
    const fr = /【([^】]+)】:\s*([\s\S]*?)(?=【|$)/g;
    let fm;
    while ((fm = fr.exec(m[1])) !== null) { const k = fm[1].trim(); if (fieldMap[k]) fields[fieldMap[k]] = fm[2].trim(); }
    segments.push({ type: "card", fields });
    last = m.index + m[0].length;
  }

  let rest = text.substring(last).trim();
  if (isStreaming && rest) {
    const si = rest.indexOf("===AYAH_START===");
    if (si !== -1) rest = rest.substring(0, si).trim();
    const pi = rest.lastIndexOf("===");
    if (pi !== -1 && pi > rest.length - 20) rest = rest.substring(0, pi).trim();
  }
  if (!isStreaming && rest) rest = rest.replace(/===AYAH_START===|===AYAH_END===/g, "").trim();
  if (rest) parseDhikr(rest, segments);
  if (!segments.length && text.trim()) {
    const c = text.replace(/===AYAH_START===|===AYAH_END===/g, "").trim();
    if (c) parseDhikr(c, segments);
  }
  return segments;
}

function parseDhikr(text: string, segments: Segment[]) {
  const dhikrRe = /【الذكر】\s*:\s*([\s\S]*?)【التكرار】\s*:\s*([\s\S]*?)【الوقت】\s*:\s*([^\n【]*)/g;
  let last = 0, dm;
  while ((dm = dhikrRe.exec(text)) !== null) {
    const before = text.substring(last, dm.index).replace(/\*\*/g, "").trim();
    if (before) segments.push({ type: "text", content: before });
    segments.push({ type: "dhikr", fields: { text: dm[1].trim(), repetition: dm[2].trim(), time: dm[3].trim() } });
    last = dm.index + dm[0].length;
  }
  const remaining = text.substring(last).replace(/\*\*/g, "").trim();
  if (remaining) segments.push({ type: "text", content: remaining });
}

export function isEmpty(v?: string) {
  if (!v) return true;
  const l = v.toLowerCase().trim();
  return l.startsWith("no ") || l.startsWith("لا يوجد") || l.startsWith("لم يُوجد") || l.startsWith("لا توجد") || l === "n/a";
}
