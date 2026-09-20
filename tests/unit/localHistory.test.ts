import { describe, expect, it } from 'vitest'
import {
  EMPTY_HISTORY,
  MAX_ATTEMPTS,
  appendAttempt,
  bestAttempt,
  bestAttemptFor,
  lastAttempt,
  lastAttemptFor,
  markLearnDone,
  parseHistory,
  progressOf,
  recordAttempt,
} from '../../src/state/localHistory'
import type { Attempt } from '../../src/state/localHistory'

const attempt = (over: Partial<Attempt> = {}): Attempt => ({
  at: 1_758_182_400_000,
  courseId: '201',
  difficulty: 'basic',
  score: 780,
  maxScore: 1000,
  percent: 78,
  durationMs: 412_000,
  ...over,
})

describe('parseHistory', () => {
  it('leer/null -> leerer Verlauf', () => {
    expect(parseHistory(null)).toEqual(EMPTY_HISTORY)
    expect(parseHistory('')).toEqual(EMPTY_HISTORY)
  })
  it('kaputtes JSON, fremde Struktur, unbekannte Version -> verworfen', () => {
    expect(parseHistory('{not json')).toEqual(EMPTY_HISTORY)
    expect(parseHistory('"string"')).toEqual(EMPTY_HISTORY)
    expect(parseHistory('{"version":3,"attempts":[]}')).toEqual(EMPTY_HISTORY)
    expect(parseHistory('{"attempts":[]}')).toEqual(EMPTY_HISTORY)
    expect(parseHistory('{"version":1,"attempts":"nope"}')).toEqual(EMPTY_HISTORY)
    expect(parseHistory('{"version":2,"attempts":"nope"}')).toEqual(EMPTY_HISTORY)
  })
  it('ein einziger strukturell kaputter Versuch verwirft alles (nicht reparieren)', () => {
    const raw = JSON.stringify({ version: 2, attempts: [attempt(), { at: 'x' }], progress: {} })
    expect(parseHistory(raw)).toEqual(EMPTY_HISTORY)
    const tooHigh = JSON.stringify({ version: 2, attempts: [attempt({ score: 5000 })], progress: {} })
    expect(parseHistory(tooHigh)).toEqual(EMPTY_HISTORY)
  })
  it('ein Versuch mit unbekannter, aber wohlgeformter Kurs-ID wird nur selbst uebersprungen', () => {
    const unknown = { ...attempt({ at: 2 }), courseId: '999' }
    const raw = JSON.stringify({ version: 2, attempts: [attempt(), unknown], progress: {} })
    const h = parseHistory(raw)
    expect(h.attempts).toHaveLength(1)
    expect(h.attempts[0]?.courseId).toBe('201')
  })
  it('progress mit unbekannter Kurs-ID wird still verworfen, kaputter Wert bei bekanntem Kurs verwirft alles', () => {
    const ok = JSON.stringify({ version: 2, attempts: [], progress: { '999': { bestPercent: 80 }, '201': { learnDone: true } } })
    const h = parseHistory(ok)
    expect(h.progress).toEqual({ '201': { learnDone: true } })
    const broken = JSON.stringify({ version: 2, attempts: [], progress: { '201': { bestPercent: 500 } } })
    expect(parseHistory(broken)).toEqual(EMPTY_HISTORY)
  })
  it('gueltiger v2-Verlauf mit Einstellungen wird uebernommen, Unbekanntes ignoriert', () => {
    const raw = JSON.stringify({
      version: 2,
      attempts: [attempt()],
      progress: { '201': { learnDone: true } },
      preferredLocale: 'en',
      theme: 'dark',
      injected: 'ignore me',
    })
    const h = parseHistory(raw)
    expect(h.attempts).toHaveLength(1)
    expect(h.progress['201']?.learnDone).toBe(true)
    expect(h.preferredLocale).toBe('en')
    expect(h.theme).toBe('dark')
    expect((h as Record<string, unknown>).injected).toBeUndefined()
  })
  it('ungueltige Locale/Theme werden weggelassen', () => {
    const h = parseHistory(JSON.stringify({ version: 2, attempts: [], progress: {}, preferredLocale: 'xx', theme: 'neon' }))
    expect(h.preferredLocale).toBeUndefined()
    expect(h.theme).toBeUndefined()
  })
})

describe('appendAttempt', () => {
  it('haelt maximal 20 Eintraege, aeltester fliegt raus', () => {
    let h = EMPTY_HISTORY
    for (let i = 0; i < MAX_ATTEMPTS + 3; i++) h = appendAttempt(h, attempt({ at: i }))
    expect(h.attempts).toHaveLength(MAX_ATTEMPTS)
    expect(h.attempts[0]?.at).toBe(3)
    expect(lastAttempt(h)?.at).toBe(MAX_ATTEMPTS + 2)
  })
  it('bestAttempt liefert den hoechsten Prozentwert', () => {
    let h = appendAttempt(EMPTY_HISTORY, attempt({ percent: 40 }))
    h = appendAttempt(h, attempt({ percent: 91, at: 2 }))
    h = appendAttempt(h, attempt({ percent: 60, at: 3 }))
    expect(bestAttempt(h)?.percent).toBe(91)
    expect(bestAttempt(EMPTY_HISTORY)).toBeUndefined()
  })
})

describe('recordAttempt / markLearnDone / progressOf', () => {
  it('bestPercent bleibt monoton und ueberlebt das Kappen von attempts[]', () => {
    let h = EMPTY_HISTORY
    for (let i = 0; i < 25; i++) h = recordAttempt(h, attempt({ at: i, percent: 50 }))
    h = recordAttempt(h, attempt({ at: 100, percent: 90, courseId: '101' }))
    expect(h.attempts).toHaveLength(MAX_ATTEMPTS)
    expect(progressOf(h, '201').bestPercent).toBe(50)
    expect(progressOf(h, '201').attemptCount).toBe(25)
    expect(progressOf(h, '101').bestPercent).toBe(90)
  })
  it('ein schlechterer Versuch senkt bestPercent nicht', () => {
    let h = recordAttempt(EMPTY_HISTORY, attempt({ percent: 80 }))
    h = recordAttempt(h, attempt({ at: 2, percent: 40 }))
    expect(progressOf(h, '201').bestPercent).toBe(80)
    expect(progressOf(h, '201').attemptCount).toBe(2)
  })
  it('markLearnDone ist idempotent und behaelt den ersten Zeitstempel', () => {
    let h = markLearnDone(EMPTY_HISTORY, '201', 1000)
    expect(progressOf(h, '201').learnDone).toBe(true)
    expect(progressOf(h, '201').learnDoneAt).toBe(1000)
    h = markLearnDone(h, '201', 2000)
    expect(progressOf(h, '201').learnDoneAt).toBe(1000)
  })
  it('lastAttemptFor/bestAttemptFor filtern nach Kurs', () => {
    let h = appendAttempt(EMPTY_HISTORY, attempt({ at: 1, courseId: '101', percent: 90 }))
    h = appendAttempt(h, attempt({ at: 2, courseId: '201', percent: 40 }))
    h = appendAttempt(h, attempt({ at: 3, courseId: '201', percent: 70 }))
    expect(lastAttemptFor(h, '201')?.at).toBe(3)
    expect(bestAttemptFor(h, '201')?.percent).toBe(70)
    expect(bestAttemptFor(h, '101')?.percent).toBe(90)
    expect(lastAttemptFor(h, '202')).toBeUndefined()
  })
})
