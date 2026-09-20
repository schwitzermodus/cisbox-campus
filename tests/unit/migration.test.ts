import { beforeEach, describe, expect, it } from 'vitest'
import { isPass, PASS_PERCENT, ratingTier } from '../../src/core/rating'
import { HISTORY_KEY, HISTORY_KEY_V1, LEGACY_COURSE_ID, migrateV1, parseHistory, readHistory } from '../../src/state/localHistory'
import { installMemoryStorage } from './helpers/memoryStorage'

function v1Raw(over: Record<string, unknown> = {}): string {
  return JSON.stringify({
    version: 1,
    attempts: [
      { at: 1, topic: 'e-invoicing', difficulty: 'basic', score: 500, maxScore: 1000, percent: 50, durationMs: 1000 },
      { at: 2, topic: 'e-invoicing', difficulty: 'basic', score: 900, maxScore: 1000, percent: 90, durationMs: 2000 },
    ],
    preferredLocale: 'en',
    theme: 'dark',
    learnCardsSeen: true,
    ...over,
  })
}

describe('Migration v1 -> v2', () => {
  it('Versuche, learnCardsSeen, Theme und Sprache werden verlustfrei uebernommen', () => {
    const h = parseHistory(v1Raw())
    expect(h.version).toBe(2)
    expect(h.attempts).toHaveLength(2)
    expect(h.attempts.every((a) => a.courseId === LEGACY_COURSE_ID)).toBe(true)
    expect(h.progress[LEGACY_COURSE_ID]?.learnDone).toBe(true)
    expect(h.progress[LEGACY_COURSE_ID]?.bestPercent).toBe(90)
    expect(h.progress[LEGACY_COURSE_ID]?.attemptCount).toBe(2)
    expect(h.theme).toBe('dark')
    expect(h.preferredLocale).toBe('en')
  })

  it('ist idempotent: erneutes Parsen des migrierten Ergebnisses aendert nichts mehr', () => {
    const once = parseHistory(v1Raw())
    const twice = parseHistory(JSON.stringify(once))
    expect(twice).toEqual(once)
  })

  it('migrateV1 ist eine reine Funktion (gleicher Input -> gleicher Output)', () => {
    const v1 = JSON.parse(v1Raw().replace('"version":1,', '"version":1,')) // gueltiges V1History-Objekt
    expect(migrateV1(v1)).toEqual(migrateV1(v1))
  })

  it('v1 mit einem kaputten Versuch migriert nicht, sondern verwirft alles (gleiche Strenge wie v2)', () => {
    const raw = JSON.stringify({ version: 1, attempts: [{ at: 'kaputt' }] })
    expect(parseHistory(raw)).toEqual({ version: 2, attempts: [], progress: {} })
  })

  it('v1 ohne Versuche, aber mit Theme, behaelt das Theme und hat keinen Kursfortschritt', () => {
    const raw = JSON.stringify({ version: 1, attempts: [], theme: 'light' })
    const h = parseHistory(raw)
    expect(h.theme).toBe('light')
    expect(h.progress).toEqual({})
    expect(h.attempts).toEqual([])
  })

  it('ein schlechterer erster Versuch verliert nicht gegen einen spaeteren besseren beim Best-Wert', () => {
    const raw = v1Raw({
      attempts: [
        { at: 1, topic: 'e-invoicing', difficulty: 'basic', score: 900, maxScore: 1000, percent: 90, durationMs: 1000 },
        { at: 2, topic: 'e-invoicing', difficulty: 'basic', score: 500, maxScore: 1000, percent: 50, durationMs: 1000 },
      ],
    })
    const h = parseHistory(raw)
    expect(h.progress[LEGACY_COURSE_ID]?.bestPercent).toBe(90)
    expect(h.progress[LEGACY_COURSE_ID]?.bestAt).toBe(1)
  })
})

describe('readHistory mit echtem Storage', () => {
  beforeEach(() => {
    installMemoryStorage()
  })

  it('migriert v1 beim ersten Lesen und schreibt es unter dem neuen Key', () => {
    const store = installMemoryStorage()
    store.localStorage.setItem(HISTORY_KEY_V1, v1Raw())
    const h = readHistory()
    expect(h.attempts).toHaveLength(2)
    expect(store.localStorage.getItem(HISTORY_KEY)).not.toBeNull()
  })

  it('laesst den v1-Eintrag stehen (Rollback-Sicherheit)', () => {
    const store = installMemoryStorage()
    store.localStorage.setItem(HISTORY_KEY_V1, v1Raw())
    readHistory()
    expect(store.localStorage.getItem(HISTORY_KEY_V1)).not.toBeNull()
  })

  it('liest v1 nur solange kein v2 existiert: nach der Migration hat spaeteres Aendern von v1 keine Wirkung mehr', () => {
    const store = installMemoryStorage()
    store.localStorage.setItem(HISTORY_KEY_V1, v1Raw())
    const first = readHistory()
    store.localStorage.setItem(HISTORY_KEY_V1, v1Raw({ theme: 'light' }))
    const second = readHistory()
    expect(second).toEqual(first)
  })

  it('kein v1 und kein v2 vorhanden -> leerer Verlauf, kein Schreibversuch schlaegt fehl', () => {
    expect(readHistory()).toEqual({ version: 2, attempts: [], progress: {} })
  })
})

describe('Bestehensgrenze', () => {
  it('isPass greift ab genau PASS_PERCENT', () => {
    expect(PASS_PERCENT).toBe(75)
    expect(isPass(74.9)).toBe(false)
    expect(isPass(75)).toBe(true)
    expect(isPass(100)).toBe(true)
  })
  it('ratingTier und isPass laufen nicht auseinander', () => {
    expect(ratingTier(PASS_PERCENT)).toBe('good')
    expect(ratingTier(PASS_PERCENT - 0.1)).not.toBe('good')
  })
})
