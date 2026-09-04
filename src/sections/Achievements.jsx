import { forwardRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useSectionReveal } from '../hooks/useSectionReveal.js'
import achievements from '../data/achievements.js'
import Lightbox from '../components/Lightbox.jsx'
import Reveal from '../components/Reveal.jsx'
import ExploreHint from '../components/ExploreHint.jsx'

const Achievements = forwardRef(function Achievements({ isActive }, ref) {
  const { t, lang } = useLanguage()
  const enterKey = useSectionReveal(isActive)
  const [lightboxSrc, setLightboxSrc] = useState(null)

  return (
    <section ref={ref} id="achievements" className="section-shell h-[100dvh] w-full overflow-y-auto bg-surface-1">
      <div key={enterKey} className="min-h-[100dvh] px-6 md:px-16 pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto w-full">
          <h2 className="font-display text-4xl md:text-5xl text-ink-primary reveal-line-mask">
            <span className="reveal-line-inner">{t.achievements.title}</span>
          </h2>
          <p className="mt-4 text-ink-secondary max-w-md reveal-up" style={{ animationDelay: '160ms' }}>
            {t.achievements.lead}
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
            {achievements.map((item, index) => (
              <Reveal
                key={item.id}
                as="article"
                delay={index * 90}
                className="bg-surface-1 p-8 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <span className="font-mono text-[11px] tracking-[0.1em] text-ink-muted">{item.year}</span>
                  <h3 className="mt-3 font-display text-xl text-ink-primary leading-snug">{item.title}</h3>
                  <p className="mt-3 text-ink-secondary text-sm leading-relaxed">{item.description[lang]}</p>
                </div>

                {item.type === 'pdf' ? (
                  <a
                    href={item.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor={t.achievements.viewImage}
                    className="mt-6 self-start font-mono text-[11px] tracking-[0.1em] text-accent hover:text-ink-primary transition-colors"
                  >
                    {t.achievements.viewPdf} →
                  </a>
                ) : (
                  <button
                    onClick={() => setLightboxSrc(item.image)}
                    data-cursor={t.achievements.viewImage}
                    className="mt-6 self-start font-mono text-[11px] tracking-[0.1em] text-accent hover:text-ink-primary transition-colors"
                  >
                    {t.achievements.viewImage} →
                  </button>
                )}
              </Reveal>
            ))}
          </div>

          <ExploreHint nextKey="gallery" />
        </div>
      </div>

      <Lightbox src={lightboxSrc} alt="Achievement" onClose={() => setLightboxSrc(null)} />
    </section>
  )
})

export default Achievements
