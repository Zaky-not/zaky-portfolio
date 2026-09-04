import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'

// Feels like a digital experience booting up, but stays under ~1.8s so it
// never becomes an obstacle. See section 02 of the brief.
export default function Preloader({ onComplete }) {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const rootRef = useRef(null)
  const statuses = t.preloader.statuses

  useEffect(() => {
    const steps = [0, 17, 31, 48, 63, 79, 91, 100]
    let i = 0

    const advance = () => {
      setProgress(steps[i])
      setStatusIndex(Math.min(i, statuses.length - 1))
      i += 1
      if (i < steps.length) {
        window.setTimeout(advance, 130 + Math.random() * 90)
      } else {
        window.setTimeout(() => {
          setIsExiting(true)
          window.setTimeout(onComplete, 550)
        }, 220)
      }
    }

    const start = window.setTimeout(advance, 120)
    return () => window.clearTimeout(start)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-surface-0 transition-all duration-500 ease-signature ${
        isExiting ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100'
      }`}
      style={{ clipPath: isExiting ? 'inset(0 0 100% 0)' : 'inset(0 0 0% 0)', transitionProperty: 'clip-path, opacity' }}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-10 px-6">
        <span className="font-display text-2xl tracking-[0.3em] text-ink-primary">{t.preloader.brand}®</span>

        <div className="flex flex-col items-center gap-4">
          <span className="font-mono text-[11px] tracking-[0.2em] text-ink-secondary">{statuses[statusIndex]}</span>
          <span className="font-display text-6xl md:text-7xl text-ink-primary tabular-nums">
            {String(progress).padStart(2, '0')}%
          </span>
        </div>

        <div className="w-[220px] h-[2px] bg-line overflow-hidden">
          <div
            className="h-full bg-accent transition-[width] duration-300 ease-signature"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
