export interface AyahFields {
  arabic: string; translation: string; surah: string; ayahNumber: string;
  makkiMadani: string; location: string; tafsir: string;
  sababNuzul: string; hadith: string; narrations: string;
}
export type Segment = { type: "text"; content: string } | { type: "card"; fields: AyahFields };

export function parseAyahCards(text: string, isStreaming: boolean = false): Segment[] {
  const segments: Segment[] = [];
  const re = /===AYAH_START===([\s\S]*?)===AYAH_END===/g;
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

  while ((m = re.exec(text)) !== null) {
    const before = text.substring(last, m.index).trim();
    if (before) segments.push({ type: "text", content: before });

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

  if (rest) segments.push({ type: "text", content: rest });
  if (!segments.length && text.trim()) {
    let cleaned = text.replace(/===AYAH_START===|===AYAH_END===/g, "").trim();
    if (cleaned) segments.push({ type: "text", content: cleaned });
  }
  return segments;
}

export function isArabic(t: string) { return (t.match(/[\u0600-\u06FF]/g)||[]).length > (t.match(/[a-zA-Z]/g)||[]).length; }
export function isEmpty(v?: string) { if(!v) return true; const l=v.toLowerCase().trim(); return l.startsWith("no ")||l.startsWith("لا يوجد")||l.startsWith("لم يُوجد")||l.startsWith("لا توجد")||l==="n/a"; }
