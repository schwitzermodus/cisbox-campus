import { useEffect, useState } from 'react'
import { isCourseId } from '../content/registry'
import type { CourseId } from '../content/types'
import { ACTIVE_LOCALES } from '../core/types'
import type { ActiveLocale } from '../core/types'
import { readHistory } from '../state/localHistory'

export const GLOBAL_SCREENS = ['courses', 'privacy'] as const
export const COURSE_SCREENS = ['overview', 'learn', 'quiz', 'result'] as const
export type GlobalScreen = (typeof GLOBAL_SCREENS)[number]
export type CourseScreen = (typeof COURSE_SCREENS)[number]
export type Screen = GlobalScreen | CourseScreen

export type GlobalRoute = { locale: ActiveLocale; screen: GlobalScreen }
export type CourseRoute = { locale: ActiveLocale; screen: CourseScreen; courseId: CourseId }
export type Route = GlobalRoute | CourseRoute

export function isCourseRoute(r: Route): r is CourseRoute {
  return (COURSE_SCREENS as readonly string[]).includes(r.screen)
}

function isActiveLocale(v: string): v is ActiveLocale {
  return (ACTIVE_LOCALES as readonly string[]).includes(v)
}
function isGlobalScreen(v: string): v is GlobalScreen {
  return (GLOBAL_SCREENS as readonly string[]).includes(v)
}
function isCourseScreen(v: string): v is CourseScreen {
  return (COURSE_SCREENS as readonly string[]).includes(v)
}

/**
 * Hash-Grammatik:
 *   #/<locale>                     -> Kursuebersicht
 *   #/<locale>/courses|privacy     -> globaler Screen
 *   #/<locale>/<courseId>          -> Kurs-Kurzform, kanonisiert auf .../overview
 *   #/<locale>/<courseId>/<screen> -> Kurs-Screen (overview|learn|quiz|result)
 * Alles andere (unbekannte Kurs-ID, alter Zwei-Segment-Hash, zu tief) -> null.
 */
export function parseHash(hash: string): Route | null {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts.length > 3) return null
  const [loc, a, b] = parts
  if (!loc || !isActiveLocale(loc)) return null

  if (a === undefined) return { locale: loc, screen: 'courses' }
  if (isGlobalScreen(a)) return b === undefined ? { locale: loc, screen: a } : null
  if (isCourseId(a)) {
    if (b === undefined) return { locale: loc, screen: 'overview', courseId: a }
    return isCourseScreen(b) ? { locale: loc, screen: b, courseId: a } : null
  }
  return null
}

export function hashFor(r: Route): string {
  return isCourseRoute(r) ? '#/' + r.locale + '/' + r.courseId + '/' + r.screen : '#/' + r.locale + '/' + r.screen
}

/** Locale tauschen, Kursbezug erhalten. Fuer den Sprachumschalter im Header. */
export function withLocale(r: Route, locale: ActiveLocale): Route {
  return { ...r, locale }
}

export function courseHome(locale: ActiveLocale, courseId: CourseId): Route {
  return { locale, screen: 'overview', courseId }
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
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash) ?? { locale: defaultLocale(), screen: 'courses' })

  useEffect(() => {
    const sync = () => {
      const parsed = parseHash(window.location.hash)
      if (parsed) {
        // Kurzform (#/de/201) auf die lange Form kanonisieren, ohne zusaetzlichen History-Eintrag
        const canonical = hashFor(parsed)
        if (canonical !== window.location.hash) window.history.replaceState(null, '', canonical)
        setRoute(parsed)
      } else {
        // Ungueltiger oder leerer Hash: auf die Uebersicht in Standardsprache, ohne History-Eintrag
        const fallback: Route = { locale: defaultLocale(), screen: 'courses' }
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
