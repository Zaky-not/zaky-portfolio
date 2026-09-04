import { useEffect, useRef, useState } from 'react'

/**
 * Returns a number that increments every time `isActive` flips from false
 * to true. Use it as a React `key` on the section's content wrapper so the
 * CSS reveal animations (reveal-line, reveal-up, reveal-image — see
 * index.css) replay on every entrance, exactly like the loading screen's
 * "ENTERING X" sequence hands off into the section itself.
 */
export function useSectionReveal(isActive) {
  const [enterKey, setEnterKey] = useState(0)
  const wasActive = useRef(false)

  useEffect(() => {
    if (isActive && !wasActive.current) {
      setEnterKey((k) => k + 1)
    }
    wasActive.current = isActive
  }, [isActive])

  return enterKey
}
