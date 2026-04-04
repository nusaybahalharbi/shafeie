"use client";
import { useState } from "react";

const SURAHS = [
  "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
  "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
  "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
  "لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
  "فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
  "الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
  "الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
  "نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
  "التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
  "الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
  "القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
  "المسد","الإخلاص","الفلق","الناس"
];

export default function QuranBrowser({ onSelect, lang }: { onSelect: (q: string) => void; lang: "ar" | "en" }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = SURAHS.map((name, i) => ({ name, num: i + 1 }))
    .filter(s => s.name.includes(search) || s.num.toString().includes(search));

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-nur-gold/[0.15] bg-nur-gold/[0.05] px-4 py-2 font-body text-[13px] text-nur-gold/80 transition-all hover:bg-nur-gold/[0.12] hover:text-nur-gold"
      >
        <span>📖</span>
        {lang === "ar" ? "تصفح القرآن الكريم" : "Browse the Quran"}
      </button>
    );
  }

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-nur-gold/[0.15] bg-gradient-to-br from-nur-surface to-[#0f2035]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-nur-gold/[0.1] px-5 py-3">
        <h3 className="font-display text-base text-nur-gold">
          {lang === "ar" ? "سور القرآن الكريم" : "Surahs of the Quran"}
        </h3>
        <button onClick={() => setOpen(false)} className="text-nur-text-faint hover:text-nur-text-dim text-lg">✕</button>
      </div>

      {/* Search */}
      <div className="border-b border-nur-gold/[0.08] px-5 py-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={lang === "ar" ? "ابحث عن سورة..." : "Search surah..."}
          dir="auto"
          className="w-full bg-transparent font-body text-sm text-nur-text outline-none placeholder:text-nur-text-faint"
        />
      </div>

      {/* Surah grid */}
      <div className="max-h-[300px] overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
          {filtered.map(s => (
            <button
              key={s.num}
              onClick={() => {
                onSelect(lang === "ar"
                  ? `اعرض سورة ${s.name} كاملة`
                  : `Show me Surah ${s.name} (${s.num}) complete`
                );
                setOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg bg-nur-gold/[0.04] px-2.5 py-2 text-right font-body text-[12px] text-nur-text-dim transition-all hover:bg-nur-gold/[0.12] hover:text-nur-gold"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-nur-gold/10 text-[10px] text-nur-gold">{s.num}</span>
              <span className="truncate">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
