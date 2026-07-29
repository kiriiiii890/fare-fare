export default function CardBack({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-violet-soft/50 via-background-alt to-background p-4 ${className}`}
    >
      <span className="font-display text-sm text-gold-soft">«</span>
      <svg
        viewBox="0 0 24 24"
        className="h-10 w-10 text-gold-soft"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <circle cx="12" cy="12" r="7" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      </svg>
      <span className="font-display text-sm text-gold-soft">»</span>
    </div>
  );
}
