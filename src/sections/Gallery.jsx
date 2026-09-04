import { forwardRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useSectionReveal } from '../hooks/useSectionReveal.js'
import galleryItems from '../data/gallery.js'
import Lightbox from '../components/Lightbox.jsx'
import RevealImage from '../components/RevealImage.jsx'
import ExploreHint from '../components/ExploreHint.jsx'

const SIZE_CLASSES = {
  large: 'row-span-2 col-span-2',
  medium: 'row-span-2 col-span-1',
  small: 'row-span-1 col-span-1',
}

const ROTATIONS = [
  '-rotate-1',
  'rotate-0',
  'rotate-1',
  'rotate-0',
  '-rotate-1',
  'rotate-1',
  'rotate-0',
]

const Gallery = forwardRef(function Gallery({ isActive }, ref) {
  const { t } = useLanguage()
  const enterKey = useSectionReveal(isActive)
  const [lightboxSrc, setLightboxSrc] = useState(null)

  return (
    <section
      ref={ref}
      id="gallery"
      className="section-shell h-[100dvh] w-full overflow-y-auto bg-surface-0"
    >
      <div
        key={enterKey}
        className="min-h-[100dvh] px-6 md:px-16 pt-28 pb-16"
      >
        <div className="max-w-[1400px] mx-auto w-full">

          {/* TITLE */}
          <h2 className="font-display text-4xl md:text-5xl text-ink-primary reveal-line-mask">
            <span className="reveal-line-inner">
              {t.gallery.title}
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p
            className="mt-4 text-ink-secondary max-w-md reveal-up"
            style={{ animationDelay: '160ms' }}
          >
            {t.gallery.lead}
          </p>

          {/* GALLERY */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[160px] gap-4">
            {galleryItems.map((item, i) => (
              <RevealImage
                key={item.id}
                src={item.image}
                alt={item.caption}
                delay={(i % 4) * 90}
                cursorLabel="VIEW"
                onClick={() => setLightboxSrc(item.image)}
                className={`
                  relative
                  border
                  border-line
                  cursor-pointer
                  ${SIZE_CLASSES[item.size]}
                  ${ROTATIONS[i % ROTATIONS.length]}
                  hover:rotate-0
                  transition-transform
                  duration-500
                  ease-signature
                `}
                imgClassName="
                  w-full
                  h-full
                  object-cover
                  object-center
                  hover:scale-105
                  transition-transform
                  duration-700
                  ease-signature
                "
              />
            ))}
          </div>

          <ExploreHint nextKey="stats" />
        </div>
      </div>

      {/* LIGHTBOX */}
      <Lightbox
        src={lightboxSrc}
        alt="Gallery"
        onClose={() => setLightboxSrc(null)}
      />
    </section>
  )
})

export default Gallery