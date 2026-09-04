import { forwardRef } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useSectionReveal } from '../hooks/useSectionReveal.js'
import projects from '../data/projects.js'
import RevealImage from '../components/RevealImage.jsx'
import Reveal from '../components/Reveal.jsx'
import ExploreHint from '../components/ExploreHint.jsx'

const Projects = forwardRef(function Projects({ isActive }, ref) {
  const { t, lang } = useLanguage()
  const enterKey = useSectionReveal(isActive)

  return (
    <section ref={ref} id="projects" className="section-shell h-[100dvh] w-full overflow-y-auto bg-surface-0">
      <div key={enterKey} className="min-h-[100dvh] px-6 md:px-16 pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto w-full">
          <h2 className="font-display text-4xl md:text-5xl text-ink-primary reveal-line-mask">
            <span className="reveal-line-inner">{t.projects.title}</span>
          </h2>
          <p className="mt-4 text-ink-secondary max-w-md reveal-up" style={{ animationDelay: '160ms' }}>
            {t.projects.lead}
          </p>

          <div className="mt-14 flex flex-col">
            {projects.map((project, index) => (
              <Reveal
                key={project.id}
                as="a"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={t.projects.cursorOpen}
                delay={index * 90}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-t border-line py-10 last:border-b"
              >
                <span className="lg:col-span-1 font-mono text-sm text-ink-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="lg:col-span-4">
                  <h3 className="font-display text-2xl md:text-3xl text-ink-primary group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-ink-secondary">
                    {project.category} — {project.year}
                  </p>
                </div>

                <div className="lg:col-span-3">
                  <p className="text-ink-secondary text-sm leading-relaxed max-w-xs">
                    {project.description[lang]}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] tracking-[0.08em] text-ink-muted border border-line px-2 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <RevealImage
                  src={project.image}
                  alt={project.title}
                  className="lg:col-span-3 relative aspect-video border border-line"
                  imgClassName="grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-signature"
                />

                <div className="lg:col-span-1 flex justify-start lg:justify-end">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-ink-secondary group-hover:text-accent transition-colors flex items-center gap-1">
                    {t.projects.viewProject}
                    <span className="inline-block transition-transform duration-300 ease-signature group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <ExploreHint nextKey="achievements" />
        </div>
      </div>
    </section>
  )
})

export default Projects
