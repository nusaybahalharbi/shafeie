export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-nur-gold/[0.08] bg-nur-bg/95 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-nur-gold to-[#8a6e3e] text-lg shadow-lg shadow-nur-gold-glow">☽</div>
        <div>
          <h1 className="font-display text-xl font-bold text-nur-gold">شفيع</h1>
          <p className="text-[10px] text-nur-text-faint">مساعد بحث قرآني</p>
        </div>
      </div>
      <div className="hidden rounded-full border border-nur-gold/[0.12] px-3 py-1.5 text-[10px] text-nur-text-faint sm:block">
        القرآن · ابن كثير · صحيح البخاري
      </div>
    </header>
  );
}
