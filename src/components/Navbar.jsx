import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { usePlayer } from '../context/PlayerContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const SECTION_KEYS = ['home', 'about', 'projects', 'achievements', 'gallery', 'stats', 'contact']

export default function Navbar({ activeIndex, onNavigate }) {
  const { t, lang, toggleLang } = useLanguage()
  const { isPlaying, toggle, currentTrack } = usePlayer()
  const { theme, toggleTheme } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleNavigate = (index) => {
    onNavigate(index)
    setIsMobileOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-line bg-surface-0/70 backdrop-blur-sm">
        <button
          className="font-display text-sm tracking-[0.25em] text-ink-primary"
          onClick={() => handleNavigate(0)}
          aria-label="Go to home"
        >
          Jekzoz
        </button>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {SECTION_KEYS.map((key, index) => (
            <button
              key={key}
              onClick={() => handleNavigate(index)}
              className={`relative font-mono text-[11px] tracking-[0.14em] py-1 transition-colors duration-300 ${
                activeIndex === index ? 'text-ink-primary' : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {t.nav[key]}
              <span
                className={`absolute -bottom-1 left-0 h-[1px] bg-accent transition-all duration-300 ease-signature ${
                  activeIndex === index ? 'w-full' : 'w-0'
                }`}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            onClick={toggle}
            className="hidden sm:flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-ink-secondary hover:text-ink-primary transition-colors"
            aria-pressed={isPlaying}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-accent animate-pulse' : 'bg-ink-muted'}`} />
            <span className="max-w-[90px] truncate">{currentTrack.title}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="font-mono text-[11px] tracking-[0.1em] text-ink-secondary hover:text-ink-primary transition-colors flex items-center gap-1.5"
            aria-label="Toggle theme"
          >
            <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
            <span className="hidden sm:inline">{theme === 'dark' ? t.misc.themeToLight : t.misc.themeToDark}</span>
          </button>

          <button
            onClick={toggleLang}
            className="font-mono text-[11px] tracking-[0.1em] text-ink-secondary hover:text-ink-primary transition-colors"
            aria-label="Switch language"
          >
            <span className={lang === 'id' ? 'text-ink-primary' : ''}>ID</span>
            <span className="mx-1 text-ink-muted">/</span>
            <span className={lang === 'en' ? 'text-ink-primary' : ''}>EN</span>
          </button>

          <button
            className="lg:hidden font-mono text-[11px] tracking-[0.1em] text-ink-primary"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-expanded={isMobileOpen}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <nav
          className="lg:hidden flex flex-col bg-surface-0 border-b border-line px-6 py-4 gap-1"
          aria-label="Mobile primary"
        >
          {SECTION_KEYS.map((key, index) => (
            <button
              key={key}
              onClick={() => handleNavigate(index)}
              className={`text-left py-3 font-mono text-[12px] tracking-[0.14em] border-b border-line last:border-b-0 ${
                activeIndex === index ? 'text-ink-primary' : 'text-ink-secondary'
              }`}
            >
              {t.nav[key]}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            className="text-left py-3 font-mono text-[12px] tracking-[0.14em] text-ink-secondary flex items-center gap-2"
          >
            <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
            {theme === 'dark' ? t.misc.themeToLight : t.misc.themeToDark}
          </button>
        </nav>
      )}
    </header>
  )
}

