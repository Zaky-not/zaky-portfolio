// Decorative horizontal ticker — purely visual, not a navigation element.
export default function Marquee({ text, className = '' }) {
  const items = new Array(6).fill(text)

  return (
    <div className={`overflow-hidden select-none ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span
            key={i}
            className="font-display text-2xl md:text-3xl whitespace-nowrap pr-8"
            style={{ WebkitTextStroke: '1px rgb(var(--ink-primary-rgb) / 0.18)', color: 'transparent' }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
