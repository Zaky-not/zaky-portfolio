import { usePlayer } from '../context/PlayerContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    toggle,
    next,
    previous,
    volume,
    setVolume,
  } = usePlayer()

  const { t } = useLanguage()

  return (
    <div className="fixed bottom-4 left-3 right-3 z-40 md:left-6 md:right-auto md:bottom-6">
      <div className="flex items-center gap-3 border border-line bg-surface-1/90 backdrop-blur-sm px-3 py-2 md:gap-4 md:px-4 md:py-3">

        <button
          onClick={previous}
          className="font-mono text-[10px] text-ink-secondary hover:text-ink-primary transition-colors md:text-[11px]"
          aria-label="Previous track"
        >
          PREV
        </button>

        <button
          onClick={toggle}
          className="w-8 h-8 shrink-0 rounded-full border border-line flex items-center justify-center text-ink-primary hover:border-accent transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <button
          onClick={next}
          className="font-mono text-[10px] text-ink-secondary hover:text-ink-primary transition-colors md:text-[11px]"
          aria-label="Next track"
        >
          NEXT
        </button>

        <div className="flex min-w-0 flex-1 flex-col border-l border-line pl-3 md:flex-none md:pl-2">
          <span className="font-mono text-[9px] tracking-[0.1em] text-ink-muted">
            {isPlaying ? t.misc.musicPlaying : t.misc.musicPaused}
          </span>

          <span className="truncate font-mono text-[10px] text-ink-primary md:text-[11px]">
            {currentTrack.title}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="hidden w-16 accent-accent sm:block"
          aria-label="Volume"
        />

      </div>
    </div>
  )
}