import { forwardRef, useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useSectionReveal } from '../hooks/useSectionReveal.js'
import { getCodingStats } from '../services/codingStats.js'
import {
  getLastfmActivity,
  lastfmStatus,
} from '../services/spotify.js'
import Reveal from '../components/Reveal.jsx'
import ExploreHint from '../components/ExploreHint.jsx'

const Stats = forwardRef(function Stats({ isActive }, ref) {
  const { t } = useLanguage()
  const enterKey = useSectionReveal(isActive)

  const [coding, setCoding] = useState(null)
  const [codingError, setCodingError] = useState('')

  const [lastfm, setLastfm] = useState({
    status: lastfmStatus.CONNECTING,
    nowPlaying: null,
    previousTracks: [],
  })

  useEffect(() => {
    let cancelled = false

    getCodingStats()
      .then((data) => {
        if (!cancelled) {
          setCoding(data)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setCodingError(
            error.message || 'WakaTime unavailable',
          )
        }
      })

    getLastfmActivity().then((data) => {
      if (!cancelled) {
        setLastfm(data)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      ref={ref}
      id="stats"
      className="section-shell h-[100dvh] w-full overflow-y-auto bg-surface-1"
    >
      <div
        key={enterKey}
        className="min-h-[100dvh] px-6 md:px-16 pt-28 pb-16"
      >
        <div className="max-w-[1400px] mx-auto w-full">

          {/* HEADER */}

          <h2 className="font-display text-4xl md:text-5xl text-ink-primary reveal-line-mask">
            <span className="reveal-line-inner">
              {t.stats.title}
            </span>
          </h2>

          <p
            className="mt-4 text-ink-secondary max-w-md reveal-up"
            style={{ animationDelay: '160ms' }}
          >
            {t.stats.lead}
          </p>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-px bg-line">

            {/* ==================================================
                WAKATIME
            ================================================== */}

            <Reveal
              delay={280}
              className="bg-surface-1 p-8"
            >
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
                    <Metric
                      label={t.stats.vscode.codingDays}
                      value={coding.codingDays}
                    />

                    <Metric
                      label={t.stats.vscode.bestDay}
                      value={coding.bestDay.text}
                    />

                    <Metric
                      label={t.stats.vscode.codingSince}
                      value={coding.codingSince}
                    />
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

            {/* ==================================================
                LAST.FM
            ================================================== */}

            <Reveal
              delay={380}
              className="bg-surface-1 p-8"
            >
              {/* LAST.FM HEADER */}

              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-mono text-[11px] tracking-[0.15em] text-ink-muted">
                    LAST.FM
                  </h3>

                  <p className="mt-1 font-display text-2xl text-ink-primary">
                    Now Playing
                  </p>
                </div>

                {lastfm.status === lastfmStatus.CONNECTED && (
                  <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-ink-muted border border-line px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>

              {lastfm.status === lastfmStatus.CONNECTED ? (
                <>
                  {/* ==================================================
                      NOW PLAYING CARD
                  ================================================== */}

                  {lastfm.nowPlaying ? (
                    <div className="mt-8 group">
                      <div className="flex items-center gap-5">

                        {/* ALBUM ART */}

                        {lastfm.nowPlaying.albumArt && (
                          <div className="relative shrink-0 overflow-hidden border border-line">
                            <img
                              src={lastfm.nowPlaying.albumArt}
                              alt={
                                lastfm.nowPlaying.album ||
                                lastfm.nowPlaying.track
                              }
                              className="w-20 h-20 object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {lastfm.nowPlaying.isPlaying && (
                              <div className="absolute bottom-1.5 left-1.5 flex items-end gap-[2px] h-3">
                                <span className="w-[2px] h-2 bg-accent animate-pulse" />
                                <span className="w-[2px] h-3 bg-accent animate-pulse [animation-delay:120ms]" />
                                <span className="w-[2px] h-1.5 bg-accent animate-pulse [animation-delay:240ms]" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* TRACK INFO */}

                        <div className="min-w-0">
                          <span className="font-mono text-[9px] tracking-[0.18em] text-ink-muted">
                            {lastfm.nowPlaying.isPlaying
                              ? 'LISTENING NOW'
                              : 'LAST PLAYED'}
                          </span>

                          <p className="mt-2 text-ink-primary truncate">
                            {lastfm.nowPlaying.track}
                          </p>

                          <p className="mt-0.5 text-ink-secondary text-sm truncate">
                            {lastfm.nowPlaying.artist}
                          </p>
                        </div>
                      </div>

                      {lastfm.nowPlaying.album && (
                        <p className="mt-5 font-mono text-[9px] tracking-[0.12em] text-ink-muted truncate">
                          ALBUM / {lastfm.nowPlaying.album}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-10">
                      <span className="w-2 h-2 rounded-full bg-ink-muted inline-block" />

                      <p className="mt-3 font-mono text-xs tracking-[0.1em] text-ink-muted">
                        NOTHING PLAYING
                      </p>

                      <p className="mt-2 text-ink-secondary text-sm">
                        Tidak ada lagu yang sedang diputar.
                      </p>
                    </div>
                  )}

                  {/* ==================================================
                      PLAYED BEFORE
                  ================================================== */}

                  {lastfm.previousTracks?.length > 0 && (
                    <div className="mt-9 border-t border-line pt-6">

                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] tracking-[0.15em] text-ink-muted">
                          PLAYED BEFORE
                        </span>

                        <span className="font-mono text-[9px] tracking-[0.12em] text-ink-muted">
                          LAST 5
                        </span>
                      </div>

                      <div className="mt-4 flex flex-col divide-y divide-line">

                        {lastfm.previousTracks.map(
                          (track, index) => (
                            <div
                              key={`${track.track}-${track.artist}-${index}`}
                              className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                            >

                              {/* NUMBER */}

                              <span className="font-mono text-[9px] text-ink-muted w-5 shrink-0 tabular-nums">
                                {String(index + 1).padStart(
                                  2,
                                  '0',
                                )}
                              </span>

                              {/* COVER */}

                              {track.albumArt ? (
                                <img
                                  src={track.albumArt}
                                  alt={
                                    track.album ||
                                    track.track
                                  }
                                  className="w-9 h-9 object-cover border border-line shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                />
                              ) : (
                                <div className="w-9 h-9 border border-line shrink-0 flex items-center justify-center">
                                  <span className="font-mono text-[9px] text-ink-muted">
                                    ♪
                                  </span>
                                </div>
                              )}

                              {/* INFO */}

                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-ink-primary truncate group-hover:text-accent transition-colors duration-300">
                                  {track.track}
                                </p>

                                <p className="text-[11px] text-ink-secondary truncate">
                                  {track.artist}
                                </p>
                              </div>

                              {/* ARROW */}

                              <span className="font-mono text-[10px] text-ink-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                →
                              </span>
                            </div>
                          ),
                        )}

                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-10">
                  <span className="w-2 h-2 rounded-full bg-ink-muted inline-block animate-pulse" />

                  <p className="mt-3 font-mono text-xs tracking-[0.1em] text-ink-muted">
                    CONNECTING TO LAST.FM…
                  </p>

                  {lastfm.error && (
                    <p className="mt-2 text-ink-secondary text-sm">
                      Last.fm unavailable.
                    </p>
                  )}
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
              <span className="text-xs text-ink-secondary truncate">
                {item.name}
              </span>

              <span className="font-mono text-[9px] text-ink-muted tabular-nums">
                {Math.round(item.percent)}%
              </span>
            </div>

            <div className="mt-1.5 h-[3px] bg-line overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-700"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, item.percent),
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats