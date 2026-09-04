import { useEffect, useRef, useState } from 'react'

// Desktop-only — hidden on touch devices via CSS (see index.css).
export default function CustomCursor() {
  const dotRef = useRef(null)
  const [label, setLabel] = useState('')
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const el = dotRef.current
    if (!el) return

    let raf = null
    const move = (e) => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      })
    }

    const handleOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (target) {
        setLabel(target.getAttribute('data-cursor'))
        setIsActive(true)
      } else {
        setIsActive(false)
        setLabel('')
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', handleOver)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', handleOver)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={dotRef} className={`custom-cursor ${isActive ? 'is-active' : ''}`} aria-hidden="true">
      {isActive ? label : ''}
    </div>
  )
}
