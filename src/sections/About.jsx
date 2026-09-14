import { forwardRef } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useSectionReveal } from '../hooks/useSectionReveal.js'
import Marquee from '../components/Marquee.jsx'
import ExploreHint from '../components/ExploreHint.jsx'
import profileImage from '../assets/profile/zakybaru.jpeg'

const About = forwardRef(function About({ isActive }, ref) {
  const { t } = useLanguage()
  const enterKey = useSectionReveal(isActive)

  return (
    <section
      ref={ref}
      id="about"
      className="section-shell h-[100dvh] w-full overflow-y-auto bg-surface-1"
    >
      <div
        key={enterKey}
        className="min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 pt-24 pb-14"
      >
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT SIDE — PROFILE + ABOUT */}
          <div className="lg:col-span-5">

            {/* PROFILE IMAGE */}
            <div
              className="reveal-up mb-8 overflow-hidden border border-line bg-surface-2"
              style={{ animationDelay: '80ms' }}
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <img
                  src={profileImage}
                  alt="Zaky"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />

                {/* Image Label */}
                <div className="absolute left-4 bottom-4 px-3 py-2 bg-surface-1/90 backdrop-blur-sm border border-line">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-ink-primary">
                    ZAKY / PROFILE
                  </span>
                </div>
              </div>
            </div>

            {/* TITLE */}
            <h2 className="font-display text-4xl md:text-5xl text-ink-primary leading-tight reveal-line-mask">
              <span className="reveal-line-inner">
                {t.about.title}
              </span>
            </h2>

            {/* LEAD */}
            <p
              className="mt-6 text-ink-secondary text-lg leading-relaxed max-w-md reveal-up"
              style={{ animationDelay: '160ms' }}
            >
              {t.about.lead}
            </p>

            {/* BODY */}
            <p
              className="mt-4 text-ink-secondary text-sm leading-relaxed max-w-md reveal-up"
              style={{ animationDelay: '260ms' }}
            >
              {t.about.body}
            </p>
          </div>

          {/* RIGHT SIDE — INFORMATION */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:pl-10 lg:border-l border-line">

            {/* SKILLS */}
            <div
              className="reveal-up"
              style={{ animationDelay: '340ms' }}
            >
              <h3 className="font-mono text-[11px] tracking-[0.15em] text-ink-muted mb-4">
                {t.about.skillsTitle}
              </h3>

              <ul className="flex flex-col gap-2">
                {t.about.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-ink-primary text-sm border-b border-line pb-2 transition-all duration-300 hover:pl-2"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            {/* INTERESTS */}
            <div
              className="reveal-up"
              style={{ animationDelay: '420ms' }}
            >
              <h3 className="font-mono text-[11px] tracking-[0.15em] text-ink-muted mb-4">
                {t.about.interestsTitle}
              </h3>

              <ul className="flex flex-col gap-2">
                {t.about.interests.map((interest) => (
                  <li
                    key={interest}
                    className="text-ink-primary text-sm border-b border-line pb-2 transition-all duration-300 hover:pl-2"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </div>

            {/* FOCUS */}
            <div
              className="reveal-up"
              style={{ animationDelay: '500ms' }}
            >
              <h3 className="font-mono text-[11px] tracking-[0.15em] text-ink-muted mb-4">
                {t.about.focusTitle}
              </h3>

              <p className="text-ink-secondary text-sm leading-relaxed">
                {t.about.focusValue}
              </p>
            </div>

            {/* LOCATION */}
            <div
              className="reveal-up"
              style={{ animationDelay: '580ms' }}
            >
              <h3 className="font-mono text-[11px] tracking-[0.15em] text-ink-muted mb-4">
                {t.about.locationTitle}
              </h3>

              <p className="text-ink-secondary text-sm leading-relaxed">
                {t.about.locationValue}
              </p>
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="max-w-[1400px] mx-auto w-full mt-14">
          <Marquee text="Just Start Guys" />
        </div>

        {/* NEXT SECTION */}
        <div className="max-w-[1400px] mx-auto w-full">
          <ExploreHint nextKey="projects" />
        </div>
      </div>
    </section>
  )
})

export default About