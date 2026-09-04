import { forwardRef, useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useRealtimeClock } from '../hooks/useRealtimeClock.js'
import { useSectionReveal } from '../hooks/useSectionReveal.js'
import profilePhoto from '../assets/profile/zaky1.jpeg'

const Home = forwardRef(function Home({ isActive }, ref) {
  const { t } = useLanguage()
  const now = useRealtimeClock()
  const enterKey = useSectionReveal(isActive)
  const photoRef = useRef(null)

  const time = now.toLocaleTimeString('en-GB', {
    hour12: false,
  })

  const date = now
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase()

  // Subtle mouse parallax for profile photo
  useEffect(() => {
    const el = photoRef.current

    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const isTouchDevice = window.matchMedia(
      '(hover: none)'
    ).matches

    if (prefersReduced || isTouchDevice) return

    let raf = null

    const handleMove = (e) => {
      if (raf) {
        cancelAnimationFrame(raf)
      }

      raf = requestAnimationFrame(() => {
        const x =
          (e.clientX / window.innerWidth - 0.5) * 10

        const y =
          (e.clientY / window.innerHeight - 0.5) * 10

        el.style.transform = `translate(${x}px, ${y}px)`
      })
    }

    window.addEventListener('mousemove', handleMove)

    return () => {
      window.removeEventListener('mousemove', handleMove)

      if (raf) {
        cancelAnimationFrame(raf)
      }
    }
  }, [])

  return (
    <section
      ref={ref}
      id="home"
      className="section-shell h-[100dvh] w-full overflow-y-auto bg-surface-0 relative"
    >
      <div
        key={enterKey}
        className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 pt-24 pb-16 relative"
      >

        {/* =========================
            HERO CONTENT
        ========================== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-[1400px] mx-auto w-full">

          {/* =========================
              LEFT — TEXT
          ========================== */}

          <div className="lg:col-span-8">

            <p className="font-mono text-[11px] tracking-[0.2em] text-ink-secondary mb-6 reveal-up">
              {t.home.eyebrow}
            </p>

            <h1 className="font-display text-[13vw] leading-[0.95] lg:text-[6.4vw] text-ink-primary">

              {t.home.headline.map((line, i) => (
                <span
                  key={i}
                  className="reveal-line-mask block"
                >
                  <span
                    className="reveal-line-inner"
                    style={{
                      animationDelay: `${140 + i * 90}ms`,
                    }}
                  >
                    {line}
                  </span>
                </span>
              ))}

            </h1>

            <p
              className="mt-8 max-w-md text-ink-secondary text-base leading-relaxed reveal-up"
              style={{
                animationDelay: '520ms',
              }}
            >
              {t.home.subline}
            </p>

          </div>

          {/* =========================
              RIGHT — PROFILE PHOTO
          ========================== */}

          <div className="lg:col-span-4 flex justify-start lg:justify-end">

            <div
              className="relative w-[62vw] max-w-[280px] aspect-[4/5] overflow-hidden border border-line group reveal-image-el"
              style={{
                animationDelay: '460ms',
              }}
            >

              {/* PHOTO */}
              <div
                ref={photoRef}
                className="absolute inset-0 will-change-transform"
              >

                <img
                  src={profilePhoto}
                  alt="Zaky"
                  className="w-full h-full object-cover transition-transform duration-700 ease-signature group-hover:scale-[1.03]"
                />

              </div>

              {/* FRAME */}
              <div className="absolute inset-0 border border-line pointer-events-none" />

              {/* PROFILE LABEL */}
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-surface-0/85 backdrop-blur-sm border border-line">

                <span className="font-mono text-[9px] tracking-[0.12em] text-ink-primary">
                  ZAKY / PROFILE
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =========================
            REALTIME INFORMATION
        ========================== */}

        <div className="max-w-[1400px] mx-auto w-full mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-line pt-8">

          {/* TIME */}

          <RealtimeField
            label={t.home.localTimeLabel}
            value={time}
            mono
            delay={620}
          />

          {/* DATE */}

          <RealtimeField
            label={t.home.dateLabel}
            value={date}
            mono
            delay={700}
          />

          {/* STATUS */}

          <RealtimeField
            label={t.home.statusLabel}
            delay={780}
            value={
              <span className="flex items-center gap-2">

                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />

                {t.home.statusOnline}

              </span>
            }
          />

          {/* LOCATION */}

          <RealtimeField
            label={t.home.locationLabel}
            value={t.home.locationValue}
            delay={860}
          />

        </div>

        {/* =========================
            SCROLL HINT
        ========================== */}

        <p
          className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.15em] text-ink-muted reveal-up"
          style={{
            animationDelay: '950ms',
          }}
        >
          {t.home.scrollHint}
        </p>

      </div>
    </section>
  )
})

/* =========================
   REALTIME FIELD COMPONENT
========================= */

function RealtimeField({
  label,
  value,
  mono,
  delay = 0,
}) {
  return (
    <div
      className="flex flex-col gap-1 reveal-up"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >

      <span className="font-mono text-[10px] tracking-[0.15em] text-ink-muted">
        {label}
      </span>

      <span
        className={`text-ink-primary text-sm ${
          mono
            ? 'font-mono tabular-nums'
            : ''
        }`}
      >
        {value}
      </span>

    </div>
  )
}

export default Home