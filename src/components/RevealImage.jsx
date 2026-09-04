import { useInView } from '../hooks/useInView.js'

export default function RevealImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  delay = 0,
  onClick,
  cursorLabel,
}) {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      onClick={onClick}
      data-cursor={cursorLabel}
      className={`overflow-hidden ${inView ? 'reveal-image-el' : 'opacity-0'} ${className}`}
      style={{ animationDelay: inView ? `${delay}ms` : undefined }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover object-center ${imgClassName}`}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
    </div>
  )
}