type TarotCardProps = {
  name: string;
  numeral: string;
  rotate?: number;
  className?: string;
};

export default function TarotCard({
  name,
  numeral,
  rotate = 0,
  className = "",
}: TarotCardProps) {
  return (
    <div
      className={`group relative aspect-[2/3.4] w-full rounded-xl border border-gold/40 bg-gradient-to-b from-violet-soft/40 via-background-alt to-background p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-1.5 hover:border-gold ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="flex h-full flex-col items-center justify-between rounded-md border border-gold-soft/30 p-3 text-center">
        <span className="font-display text-[10px] tracking-[0.3em] text-gold-soft">
          {numeral}
        </span>
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10 text-gold-soft opacity-80 transition-opacity group-hover:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16M4 12h16" strokeWidth="0.6" />
        </svg>
        <span className="font-display text-xs leading-tight text-foreground">
          {name}
        </span>
      </div>
    </div>
  );
}
