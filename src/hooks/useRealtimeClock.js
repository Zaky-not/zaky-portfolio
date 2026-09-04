import { useEffect, useState } from 'react'

// Ticks once a second — deliberately not more, to stay cheap on battery.
export function useRealtimeClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return now
}
