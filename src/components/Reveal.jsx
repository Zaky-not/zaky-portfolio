import { useInView } from '../hooks/useInView.js'

// Generic fade-up-on-viewport-entry wrapper for list items (achievement
// cards, stat blocks, etc). Image entrances use RevealImage instead, since
// they need the clip-path treatment.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()

  return (
    <Tag
      ref={ref}
      className={`${inView ? 'reveal-up' : 'opacity-0'} ${className}`}
      style={{ animationDelay: inView ? `${delay}ms` : undefined }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
