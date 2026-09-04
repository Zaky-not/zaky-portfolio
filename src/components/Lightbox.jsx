import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Lightbox({
  src,
  alt,
  onClose,
  onNext,
  onPrevious,
  currentIndex,
  total,
}) {
  useEffect(() => {
    if (!src) return

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && onNext) onNext()
      if (e.key === 'ArrowLeft' && onPrevious) onPrevious()
    }

    document.addEventListener('keydown', handleKey)

    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = oldOverflow
    }
  }, [src, onClose, onNext, onPrevious])

  if (!src) return null

  const lightbox = (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* TOP */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 py-6">
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/50">
          GALLERY
        </span>

        <div className="flex items-center gap-5">
          {total && (
            <span className="font-mono text-[10px] tracking-[0.15em] text-white/50">
              {String((currentIndex ?? 0) + 1).padStart(2, '0')} /{' '}
              {String(total).padStart(2, '0')}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="font-mono text-[10px] tracking-[0.15em] text-white/60 hover:text-white border border-white/20 hover:border-white/60 px-4 py-2 transition-all duration-300"
          >
            CLOSE ✕
          </button>
        </div>
      </div>

      {/* PREVIOUS */}
      {onPrevious && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPrevious()
          }}
          className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 border border-white/20 hover:border-white/60 text-white/60 hover:text-white bg-black/30 hover:bg-white/10 transition-all duration-300"
          aria-label="Previous image"
        >
          ←
        </button>
      )}

      {/* IMAGE AREA */}
      <div
        className="absolute inset-0 flex items-center justify-center px-16 md:px-24 pt-20 pb-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          draggable="false"
          className="
            block
            w-auto
            h-auto
            max-w-full
            max-h-full
            object-contain
            shadow-[0_25px_80px_rgba(0,0,0,0.6)]
            select-none
          "
        />
      </div>

      {/* NEXT */}
      {onNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 border border-white/20 hover:border-white/60 text-white/60 hover:text-white bg-black/30 hover:bg-white/10 transition-all duration-300"
          aria-label="Next image"
        >
          →
        </button>
      )}

      {/* BOTTOM */}
      <div className="absolute bottom-6 left-0 right-0 z-30 text-center">
        <span className="font-mono text-[9px] tracking-[0.15em] text-white/30">
          ESC TO CLOSE&nbsp;&nbsp;·&nbsp;&nbsp;← → NAVIGATE
        </span>
      </div>
    </div>
  )

  return createPortal(lightbox, document.body)
}