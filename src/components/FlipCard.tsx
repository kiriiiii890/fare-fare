type FlipCardProps = {
  name: string;
  numeral: string;
  rotate?: number;
  lift?: number;
  className?: string;
};

export default function FlipCard({
  name,
  numeral,
  rotate = 0,
  lift = 0,
  className = "",
}: FlipCardProps) {
  return (
    <div
      className={`group aspect-[2/3.4] [perspective:1200px] ${className}`}
      style={{ transform: `rotate(${rotate}deg) translateY(${lift}px)` }}
    >
      <div className="relative h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.65,0,0.35,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Mặt sau */}
        <div className="absolute inset-0 flex flex-col items-center justify-between rounded-xl border border-gold/40 bg-gradient-to-b from-violet-soft/50 via-background-alt to-background p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] [backface-visibility:hidden]">
          <span className="font-display text-xs text-gold-soft">«</span>
          <div className="flex flex-col items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-9 w-9 text-gold-soft"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            >
              <circle cx="12" cy="12" r="7" />
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
            </svg>
            <span className="font-display text-[9px] tracking-[0.3em] text-gold-soft">
              FAYE
            </span>
          </div>
          <span className="font-display text-xs text-gold-soft">»</span>
        </div>

        {/* Mặt trước */}
        <div className="absolute inset-0 flex flex-col items-center justify-between rounded-xl border border-gold bg-gradient-to-b from-violet/60 via-background-alt to-background p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="font-display text-[10px] tracking-[0.3em] text-gold-soft">
            {numeral}
          </span>
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-gold-soft"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4v16M4 12h16" strokeWidth="0.6" />
          </svg>
          <span className="text-center font-display text-xs leading-tight text-foreground">
            {name}
          </span>
        </div>
      </div>
    </div>
  );
}
