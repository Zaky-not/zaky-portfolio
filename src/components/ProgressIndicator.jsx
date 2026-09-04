const TOTAL = 7

export default function ProgressIndicator({ activeIndex }) {
  return (
    <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3">
      <span className="font-mono text-[10px] tracking-[0.15em] text-ink-secondary tabular-nums">
        {String(activeIndex + 1).padStart(2, '0')}
      </span>
      <div className="flex flex-col gap-2">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span
            key={i}
            className={`block w-[3px] rounded-full transition-all duration-500 ease-signature ${
              i === activeIndex ? 'h-5 bg-accent' : 'h-[3px] bg-line'
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] tracking-[0.15em] text-ink-muted">{String(TOTAL).padStart(2, '0')}</span>
    </div>
  )
}
