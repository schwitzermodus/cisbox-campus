import { useEffect, useState } from 'react'
import { ACTIVE_LOCALES } from '../core/types'
import type { ActiveLocale } from '../core/types'
import { readHistory } from '../state/localHistory'

export const SCREENS = ['start', 'learn', 'quiz', 'result', 'privacy'] as const
export type Screen = (typeof SCREENS)[number]
export type Route = { locale: ActiveLocale; screen: Screen }

function isActiveLocale(v: string): v is ActiveLocale {
  return (ACTIVE_LOCALES as readonly string[]).includes(v)
}
function isScreen(v: string): v is Screen {
  return (SCREENS as readonly string[]).includes(v)
}

/** "#/de/quiz" -> { locale: 'de', screen: 'quiz' }; alles andere -> null */
export function parseHash(hash: string): Route | null {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [loc, scr = 'start'] = parts
  if (!loc || !isActiveLocale(loc) || !isScreen(scr) || parts.length > 2) return null
  return { locale: loc, screen: scr }
}

export function hashFor(r: Route): string {
  return '#/' + r.locale + '/' + r.screen
}

/** Startsprache: gespeicherte Wahl, sonst Browser-Sprache, sonst de. */
export function defaultLocale(): ActiveLocale {
  const stored = readHistory().preferredLocale
  if (stored && isActiveLocale(stored)) return stored
  const nav = (typeof navigator !== 'undefined' ? navigator.language : 'de').toLowerCase()
  return nav.startsWith('en') ? 'en' : 'de'
}

export function navigate(r: Route): void {
  window.location.hash = hashFor(r)
}

export function replaceRoute(r: Route): void {
  window.history.replaceState(null, '', hashFor(r))
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash) ?? { locale: defaultLocale(), screen: 'start' })

  useEffect(() => {
    const sync = () => {
      const parsed = parseHash(window.location.hash)
      if (parsed) {
        setRoute(parsed)
      } else {
        // Ungueltiger oder leerer Hash: auf Startseite in Standardsprache, ohne History-Eintrag
        const fallback: Route = { locale: defaultLocale(), screen: 'start' }
        window.history.replaceState(null, '', hashFor(fallback))
        setRoute(fallback)
      }
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  return route
}
