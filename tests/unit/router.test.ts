import { describe, expect, it } from 'vitest'
import { COURSE_SCREENS, GLOBAL_SCREENS, hashFor, parseHash, withLocale } from '../../src/app/router'
import type { Route } from '../../src/app/router'
import { COURSE_IDS } from '../../src/content/registry'
import { ACTIVE_LOCALES } from '../../src/core/types'

describe('parseHash(hashFor(r)) ist r', () => {
  it('fuer alle Locales und globalen Screens', () => {
    for (const locale of ACTIVE_LOCALES) {
      for (const screen of GLOBAL_SCREENS) {
        const r: Route = { locale, screen }
        expect(parseHash(hashFor(r))).toEqual(r)
      }
    }
  })
  it('fuer alle Locales, Kurs-IDs und Kurs-Screens', () => {
    for (const locale of ACTIVE_LOCALES) {
      for (const courseId of COURSE_IDS) {
        for (const screen of COURSE_SCREENS) {
          const r: Route = { locale, screen, courseId }
          expect(parseHash(hashFor(r))).toEqual(r)
        }
      }
    }
  })
})

describe('parseHash', () => {
  it('leer/nur Locale -> Kursuebersicht', () => {
    expect(parseHash('#/de')).toEqual({ locale: 'de', screen: 'courses' })
    expect(parseHash('#/de/')).toEqual({ locale: 'de', screen: 'courses' })
  })
  it('Kurzform #/de/201 wird zu overview', () => {
    expect(parseHash('#/de/201')).toEqual({ locale: 'de', screen: 'overview', courseId: '201' })
  })
  it('unbekannte Kurs-ID -> null', () => {
    expect(parseHash('#/de/999')).toBeNull()
    expect(parseHash('#/de/999/learn')).toBeNull()
  })
  it('alte Zwei-Segment-Screens ohne Kurs -> null', () => {
    expect(parseHash('#/de/start')).toBeNull()
    expect(parseHash('#/de/learn')).toBeNull()
    expect(parseHash('#/de/quiz')).toBeNull()
  })
  it('globaler Screen mit zusaetzlichem Segment -> null', () => {
    expect(parseHash('#/de/privacy/extra')).toBeNull()
  })
  it('zu tiefer Pfad -> null', () => {
    expect(parseHash('#/de/201/learn/extra')).toBeNull()
  })
  it('unbekannte Locale -> null', () => {
    expect(parseHash('#/xx/courses')).toBeNull()
  })
  it('unbekannter Kurs-Screen -> null', () => {
    expect(parseHash('#/de/201/unknown')).toBeNull()
  })
})

describe('withLocale', () => {
  it('erhaelt den Kursbezug einer Kursroute', () => {
    const r: Route = { locale: 'de', screen: 'quiz', courseId: '201' }
    expect(withLocale(r, 'en')).toEqual({ locale: 'en', screen: 'quiz', courseId: '201' })
  })
  it('funktioniert fuer globale Routen', () => {
    const r: Route = { locale: 'de', screen: 'courses' }
    expect(withLocale(r, 'en')).toEqual({ locale: 'en', screen: 'courses' })
  })
})
