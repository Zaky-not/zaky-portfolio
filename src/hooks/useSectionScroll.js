import { useCallback, useEffect, useRef, useState } from 'react'

const EDGE_TOLERANCE = 4 // px
const TOUCH_THRESHOLD = 60 // px of swipe before it counts as an intentional gesture

/**
 * Drives the "natural scroll inside a section, snap only at the edges"
 * behaviour described in the brief.
 *
 * Each section is expected to be its own internally-scrollable element
 * (overflow-y: auto, height: 100dvh). This hook only decides WHEN to move
 * to the next/previous section — the actual transform/transition is left
 * to the consumer (App.jsx) so visuals stay in one place.
 */
export function useSectionScroll(sectionCount, { cooldown = 900 } = {}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fromIndex, setFromIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sectionRefs = useRef([])
  const touchStartY = useRef(null)
  const lockRef = useRef(false)
  const activeIndexRef = useRef(0)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const setSectionRef = useCallback((index) => (el) => {
    sectionRefs.current[index] = el
  }, [])

  const goTo = useCallback(
    (nextIndex, direction) => {
      if (lockRef.current) return
      if (nextIndex < 0 || nextIndex >= sectionCount) return
      if (nextIndex === activeIndexRef.current) return

      setFromIndex(activeIndexRef.current)
      lockRef.current = true
      setIsTransitioning(true)

      window.setTimeout(() => {
        setActiveIndex(nextIndex)
        const target = sectionRefs.current[nextIndex]
        if (target) {
          target.scrollTop = direction === 'forward' ? 0 : Math.max(0, target.scrollHeight - target.clientHeight)
        }
      }, 40)

      window.setTimeout(() => {
        setIsTransitioning(false)
        lockRef.current = false
      }, cooldown)
    },
    [sectionCount, cooldown]
  )

  const goNext = useCallback(() => goTo(activeIndexRef.current + 1, 'forward'), [goTo])
  const goPrev = useCallback(() => goTo(activeIndexRef.current - 1, 'backward'), [goTo])

  const attemptNavigation = useCallback(
    (deltaY) => {
      if (lockRef.current) return false
      const index = activeIndexRef.current
      const el = sectionRefs.current[index]
      if (!el) return false

      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= EDGE_TOLERANCE
      const atTop = el.scrollTop <= EDGE_TOLERANCE

      if (deltaY > 0 && atBottom && index < sectionCount - 1) {
        goTo(index + 1, 'forward')
        return true
      }
      if (deltaY < 0 && atTop && index > 0) {
        goTo(index - 1, 'backward')
        return true
      }
      return false
    },
    [sectionCount, goTo]
  )

  useEffect(() => {
    const handleWheel = (e) => {
      const navigated = attemptNavigation(e.deltaY)
      if (navigated) e.preventDefault()
    }

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      if (touchStartY.current === null) return
      const delta = touchStartY.current - e.touches[0].clientY
      if (Math.abs(delta) < TOUCH_THRESHOLD) return
      const navigated = attemptNavigation(delta)
      if (navigated) {
        e.preventDefault()
        touchStartY.current = e.touches[0].clientY
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [attemptNavigation])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goNext()
      if (e.key === 'ArrowUp' || e.key === 'PageUp') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  return { activeIndex, fromIndex, isTransitioning, goTo, goNext, goPrev, setSectionRef }
}
