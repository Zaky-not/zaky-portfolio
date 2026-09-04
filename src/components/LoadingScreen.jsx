import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'

const STEPS = [0, 17, 34, 52, 71, 89, 100]
const SECTION_KEYS = ['home', 'about', 'projects', 'achievements', 'gallery', 'stats', 'contact']

// The "wajib ada" transition curtain: page number, "ENTERING X", a moving
// percentage, and a status line that swaps once mid-way through. Content is
// re-keyed on every new target section so its reveal animations replay.
export default function LoadingScreen({ isActive, fromIndex, toIndex }) {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(0)
  const [statusStep, setStatusStep] = useState(0)
  const timers = useRef([])

  const key = toIndex // used to force-remount the inner content per transition

  useEffect(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []

    if (!isActive) {
      setProgress(0)
      setStatusStep(0)
      return
    }

    setProgress(0)
    setStatusStep(0)

    STEPS.forEach((value, i) => {
      const id = window.setTimeout(() => setProgress(value), 60 + i * 75)
      timers.current.push(id)
    })

    const statusId = window.setTimeout(() => setStatusStep(1), 420)
    timers.current.push(statusId)

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id))
    }
  }, [isActive, key])

  const sectionKey = SECTION_KEYS[toIndex] ?? 'home'
  const statuses = t.loadingScreen.statuses[sectionKey] ?? []
  const label = t.nav[sectionKey]?.toUpperCase() ?? ''

  return (
    <div
      className={`fixed inset-0 z-[80] bg-surface-1 pointer-events-none transition-transform duration-[420ms] ease-signature flex flex-col items-center justify-center ${
        isActive ? 'translate-y-0' : '-translate-y-full'
      }`}
      aria-hidden={!isActive}
    >
      {isActive && (
        <div key={key} className="flex flex-col items-center gap-8 px-6">
          <span className="font-display text-lg tracking-[0.3em] text-ink-primary">ZAKY®</span>

          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-ink-muted">
            <span className="reveal-line-mask">
              <span className="page-number-el block tabular-nums">{String(fromIndex + 1).padStart(2, '0')}</span>
            </span>
            <span>/</span>
            <span className="reveal-line-mask">
              <span className="page-number-el block tabular-nums">{String(toIndex + 1).padStart(2, '0')}</span>
            </span>
            <span className="text-ink-muted">— {String(SECTION_KEYS.length).padStart(2, '0')}</span>
          </div>

          <div className="text-center">
            <p className="font-mono text-[11px] tracking-[0.2em] text-ink-secondary reveal-line-mask">
              <span className="reveal-line-inner">{t.loadingScreen.entering}</span>
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-ink-primary mt-1 reveal-line-mask">
              <span className="reveal-line-inner" style={{ animationDelay: '80ms' }}>
                {label}
              </span>
            </h2>
          </div>

          <span className="font-display text-3xl text-ink-primary tabular-nums">
            {String(progress).padStart(2, '0')}%
          </span>

          <div className="w-[200px] h-[2px] bg-line overflow-hidden">
            <div
              className="h-full bg-accent transition-[width] duration-300 ease-signature"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="font-mono text-[10px] tracking-[0.15em] text-ink-muted h-4">
            {statuses[statusStep] ?? statuses[0]}
          </p>
        </div>
      )}
    </div>
  )
}
