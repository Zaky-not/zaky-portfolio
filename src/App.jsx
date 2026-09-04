import { useRef, useState } from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { PlayerProvider } from './context/PlayerContext.jsx'
import { useSectionScroll } from './hooks/useSectionScroll.js'

import Preloader from './components/Preloader.jsx'
import Navbar from './components/Navbar.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import ProgressIndicator from './components/ProgressIndicator.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

import Home from './sections/Home.jsx'
import About from './sections/About.jsx'
import Projects from './sections/Projects.jsx'
import Achievements from './sections/Achievements.jsx'
import Gallery from './sections/Gallery.jsx'
import Stats from './sections/Stats.jsx'
import Contact from './sections/Contact.jsx'

const SECTIONS = [Home, About, Projects, Achievements, Gallery, Stats, Contact]
const TRANSITION_MS = 850

function Experience() {
  const { activeIndex, fromIndex, isTransitioning, goTo, setSectionRef } = useSectionScroll(SECTIONS.length, {
    cooldown: TRANSITION_MS,
  })
  const trackRef = useRef(null)

  const handleNavigate = (index) => {
    if (index === activeIndex) return
    goTo(index, index > activeIndex ? 'forward' : 'backward')
  }

  return (
    <>
      <Navbar activeIndex={activeIndex} onNavigate={handleNavigate} />
      <ProgressIndicator activeIndex={activeIndex} />
      <MusicPlayer />
      <CustomCursor />
      <LoadingScreen isActive={isTransitioning} fromIndex={fromIndex} toIndex={activeIndex} />

      <div className="fixed inset-0 overflow-hidden">
        <div
          ref={trackRef}
          className="will-change-transform"
          style={{
            transform: `translateY(-${activeIndex * 100}dvh)`,
            transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
          }}
        >
          {SECTIONS.map((SectionComponent, index) => (
            <SectionComponent key={index} ref={setSectionRef(index)} isActive={activeIndex === index} />
          ))}
        </div>
      </div>

      <div className="grain-overlay" />
      <div className="vignette-overlay" />
    </>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <ThemeProvider>
      <LanguageProvider>
        <PlayerProvider>
          {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
          {!isLoading && <Experience />}
        </PlayerProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
