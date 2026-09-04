import { forwardRef } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useSectionReveal } from '../hooks/useSectionReveal.js'

const SOCIALS = [
  { label: 'GitHub', url: 'https://github.com/yourusername' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/yourusername' },
  { label: 'Instagram', url: 'https://instagram.com/yourusername' },
]

const Contact = forwardRef(function Contact({ isActive }, ref) {
  const { t } = useLanguage()
  const enterKey = useSectionReveal(isActive)

  return (
    <section ref={ref} id="contact" className="section-shell h-[100dvh] w-full overflow-y-auto bg-surface-0">
      <div key={enterKey} className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-20">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <h2 className="font-display text-[13vw] leading-[0.95] lg:text-[6vw] text-ink-primary">
              {t.contact.title.map((line, i) => (
                <span key={i} className="reveal-line-mask">
                  <span className="reveal-line-inner" style={{ animationDelay: `${140 + i * 90}ms` }}>
                    {line}
                  </span>
                </span>
              ))}
            </h2>
            <p className="mt-8 max-w-md text-ink-secondary leading-relaxed reveal-up" style={{ animationDelay: '420ms' }}>
              {t.contact.lead}
            </p>
            <a
              href="mailto:hello@zaky.dev"
              data-cursor="SEND"
              className="mt-10 inline-flex items-center gap-1 font-mono text-sm tracking-[0.1em] text-accent border-b border-accent pb-1 hover:text-ink-primary hover:border-ink-primary transition-colors reveal-up group"
              style={{ animationDelay: '520ms' }}
            >
              {t.contact.cta}
              <span className="inline-block transition-transform duration-300 ease-signature group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          <div
            className="lg:col-span-4 flex flex-col gap-8 lg:border-l border-line lg:pl-10 reveal-up"
            style={{ animationDelay: '600ms' }}
          >
            <div>
              <span className="font-mono text-[10px] tracking-[0.15em] text-ink-muted">{t.contact.emailLabel}</span>
              <p className="mt-2 text-ink-primary">hello@zaky.dev</p>
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-[0.15em] text-ink-muted">{t.contact.socialLabel}</span>
              <div className="mt-2 flex flex-col gap-1">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-fit text-ink-secondary hover:text-ink-primary transition-colors text-sm group"
                  >
                    {social.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 ease-signature group-hover:w-full" />
                  </a>
                ))}
              </div>
            </div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-ink-muted">{t.contact.availability}</p>
          </div>
        </div>
      </div>
    </section>
  )
})

export default Contact
