import { useLanguage } from '../context/LanguageContext.jsx'

// Small end-of-section cue — reinforces that one more scroll/swipe moves
// to the next section, per the "natural scrolling" boundary behaviour.
export default function ExploreHint({ nextKey }) {
  const { t } = useLanguage()
  if (!nextKey) return null

  return (
    <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-ink-muted pt-10">
      <span>
        {t.misc.exploreNext} {t.nav[nextKey]}
      </span>
      <span className="animate-bounce">↓</span>
    </div>
  )
}
