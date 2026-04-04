export default function LoadingIndicator() {
  return (
    <div className="mb-5 flex items-center gap-3 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-nur-gold to-nur-gold-dim text-sm">☽</div>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-nur-gold animate-pulse3" style={{ animationDelay: `${i * 200}ms` }} />)}
        <span className="mr-2 font-body text-xs text-nur-text-faint">شفيع يبحث في المصادر الموثقة...</span>
      </div>
    </div>
  );
}
