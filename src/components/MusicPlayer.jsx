import { usePlayer } from '../context/PlayerContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function MusicPlayer() {
  const { currentTrack, isPlaying, toggle, next, previous, volume, setVolume } = usePlayer()
  const { t } = useLanguage()

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-4 border border-line bg-surface-1/80 backdrop-blur-sm px-4 py-3">
      <button
        onClick={previous}
        className="font-mono text-[11px] text-ink-secondary hover:text-ink-primary transition-colors"
        aria-label="Previous track"
      >
        PREV
      </button>

      <button
        onClick={toggle}
        className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink-primary hover:border-accent transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '❚❚' : '▶'}
      </button>

      <button
        onClick={next}
        className="font-mono text-[11px] text-ink-secondary hover:text-ink-primary transition-colors"
        aria-label="Next track"
      >
        NEXT
      </button>

      <div className="hidden lg:flex flex-col pl-2 border-l border-line">
        <span className="font-mono text-[10px] tracking-[0.1em] text-ink-muted">
          {isPlaying ? t.misc.musicPlaying : t.misc.musicPaused}
        </span>
        <span className="font-mono text-[11px] text-ink-primary">{currentTrack.title}</span>
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-16 accent-accent"
        aria-label="Volume"
      />
    </div>
  )
}
