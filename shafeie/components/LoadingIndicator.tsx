export default function LoadingIndicator({ lang }: { lang: "ar" | "en" }) {
  return (
    <div className="mb-5 flex items-center gap-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nur-gold to-nur-gold-dim text-sm">☽</div>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-nur-gold animate-pulse3" style={{ animationDelay: `${i * 200}ms` }} />)}
        <span className={`${lang === "ar" ? "mr-2" : "ml-2"} font-body text-xs text-nur-text-faint`}>
          {lang === "ar" ? "شفيع يبحث في المصادر الموثقة..." : "Shafee is searching verified sources..."}
        </span>
      </div>
    </div>
  );
}
