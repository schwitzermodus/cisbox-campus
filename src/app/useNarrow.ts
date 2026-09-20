import { useEffect, useState } from 'react'

/** Ab hier wird das gestapelte Hochformat der Diagramme gezeigt. */
export const NARROW_QUERY = '(max-width: 559px)'

/**
 * true auf schmalen Bildschirmen. Liest matchMedia erst nach dem Mount,
 * damit der erste Render auf jedem Gerät gleich ausfällt.
 */
export function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(NARROW_QUERY)
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return narrow
}
