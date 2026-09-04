import { forwardRef, useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useSectionReveal } from '../hooks/useSectionReveal.js'
import { getCodingStats } from '../services/codingStats.js'
import { getSpotifyActivity, spotifyStatus } from '../services/spotify.js'
import Reveal from '../components/Reveal.jsx'
import ExploreHint from '../components/ExploreHint.jsx'

const Stats = forwardRef(function Stats({ isActive }, ref) {
  const { t } = useLanguage()
  const enterKey = useSectionReveal(isActive)
  const [coding, setCoding] = useState(null)
  const [codingError, setCodingError] = useState('')
  const [spotify, setSpotify] = useState({ status: spotifyStatus.CONNECTING })

  useEffect(() => {
    let cancelled = false

    getCodingStats()
      .then((data) => {
        if (!cancelled) setCoding(data)
      })
      .catch((error) => {
        if (!cancelled) setCodingError(error.message || 'WakaTime unavailable')
      })

    getSpotifyActivity().then((data) => {
      if (!cancelled) setSpotify(data)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section ref={ref} id="stats" className="section-shell h-[100dvh] w-full overflow-y-auto bg-surface-1">
      <div key={enterKey} className="min-h-[100dvh] px-6 md:px-16 pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto w-full">
          <h2 className="font-display text-4xl md:text-5xl text-ink-primary reveal-line-mask">
            <span className="reveal-line-inner">{t.stats.title}</span>
          </h2>
          <p className="mt-4 text-ink-secondary max-w-md reveal-up" style={{ animationDelay: '160ms' }}>
            {t.stats.lead}
          </p>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-px bg-line">
            {/* WakaTime */}
            <Reveal delay={280} className="bg-surface-1 p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-mono text-[11px] tracking-[0.15em] text-ink-muted">
                    {t.stats.vscode.title}
                  </h3>
                  <p className="mt-1 font-display text-2xl text-ink-primary">
                    {t.stats.vscode.subtitle}
                  </p>
                </div>

                {coding && (
                  <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-ink-muted border border-line px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {t.stats.vscode.live}
                  </span>
                )}
              </div>

              {coding ? (
                <>
                  <div className="mt-8 border-y border-line py-7">
                    <span className="font-mono text-[9px] tracking-[0.18em] text-ink-muted">
                      {t.stats.vscode.totalTime}
                    </span>
                    <div className="mt-2 font-display text-4xl md:text-5xl text-ink-primary tabular-nums">
                      {coding.totalTime}
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 md:grid-cols-3 gap-6">
                    <Metric label={t.stats.vscode.codingDays} value={coding.codingDays} />
                    <Metric label={t.stats.vscode.bestDay} value={coding.bestDay.text} />
                    <Metric label={t.stats.vscode.codingSince} value={coding.codingSince} />
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <StatList
                      title={t.stats.vscode.languages}
                      items={coding.languages.slice(0, 5)}
                    />
                    <StatList
                      title={t.stats.vscode.editors}
                      items={coding.editors.slice(0, 4)}
                    />
                  </div>

                  {coding.operatingSystems.length > 0 && (
                    <div className="mt-8">
                      <StatList
                        title={t.stats.vscode.operatingSystems}
                        items={coding.operatingSystems.slice(0, 4)}
                      />
                    </div>
                  )}

                  {!coding.isUpToDate && (
                    <p className="mt-6 font-mono text-[9px] tracking-[0.1em] text-ink-muted">
                      {t.stats.vscode.updating}
                    </p>
                  )}
                </>
              ) : codingError ? (
                <div className="mt-8 border border-line p-5">
                  <p className="font-mono text-[10px] tracking-[0.12em] text-ink-muted">
                    {t.stats.vscode.unavailable}
                  </p>
                  <p className="mt-3 text-sm text-ink-secondary">
                    {t.stats.vscode.errorNote}
                  </p>
                </div>
              ) : (
                <p className="mt-8 font-mono text-[10px] tracking-[0.1em] text-ink-muted">
                  {t.misc.loading}…
                </p>
              )}
            </Reveal>

            {/* Spotify */}
            <Reveal delay={380} className="bg-surface-1 p-8">
              <h3 className="font-mono text-[11px] tracking-[0.15em] text-ink-muted">
                {t.stats.spotify.title}
              </h3>
              <p className="mt-1 font-display text-2xl text-ink-primary">
                {t.stats.spotify.subtitle}
              </p>

              {spotify.status === spotifyStatus.CONNECTED ? (
                <div className="mt-8">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-ink-muted">
                    {t.stats.spotify.nowPlaying}
                  </span>
                  <p className="mt-2 text-ink-primary">{spotify.nowPlaying?.track ?? '—'}</p>
                  <p className="text-ink-secondary text-sm">{spotify.nowPlaying?.artist ?? ''}</p>
                </div>
              ) : (
                <div className="mt-10 flex flex-col items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-ink-muted" />
                  <p className="font-mono text-xs tracking-[0.1em] text-ink-muted">
                    {spotify.status === spotifyStatus.CONNECTING
                      ? t.stats.spotify.connecting
                      : t.stats.spotify.notConnected}
                  </p>
                  <p className="text-ink-secondary text-sm max-w-xs mt-2">
                    Configure VITE_SPOTIFY_API_ENDPOINT to connect a live feed — see src/services/spotify.js.
                  </p>
                </div>
              )}
            </Reveal>
          </div>

          <ExploreHint nextKey="contact" />
        </div>
      </div>
    </section>
  )
})

function Metric({ label, value }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="font-display text-xl md:text-2xl text-ink-primary tabular-nums truncate">
        {value}
      </span>
      <span className="font-mono text-[9px] tracking-[0.1em] text-ink-muted">
        {label}
      </span>
    </div>
  )
}

function StatList({ title, items }) {
  if (!items?.length) return null

  return (
    <div>
      <span className="font-mono text-[10px] tracking-[0.15em] text-ink-muted">
        {title}
      </span>

      <div className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-ink-secondary truncate">{item.name}</span>
              <span className="font-mono text-[9px] text-ink-muted tabular-nums">
                {Math.round(item.percent)}%
              </span>
            </div>

            <div className="mt-1.5 h-[3px] bg-line overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, item.percent))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats
