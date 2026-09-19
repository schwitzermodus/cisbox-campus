import { describe, expect, it } from 'vitest'
import { EMPTY_HISTORY, MAX_ATTEMPTS, appendAttempt, bestAttempt, lastAttempt, parseHistory } from '../../src/state/localHistory'
import type { Attempt } from '../../src/state/localHistory'

const attempt = (over: Partial<Attempt> = {}): Attempt => ({
  at: 1_758_182_400_000,
  topic: 'e-invoicing',
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
  it('kaputtes JSON, fremde Struktur, falsche Version -> verworfen', () => {
    expect(parseHistory('{not json')).toEqual(EMPTY_HISTORY)
    expect(parseHistory('"string"')).toEqual(EMPTY_HISTORY)
    expect(parseHistory('{"version":2,"attempts":[]}')).toEqual(EMPTY_HISTORY)
    expect(parseHistory('{"version":1,"attempts":"nope"}')).toEqual(EMPTY_HISTORY)
  })
  it('ein einziger kaputter Versuch verwirft alles (nicht reparieren)', () => {
    const raw = JSON.stringify({ version: 1, attempts: [attempt(), { at: 'x' }] })
    expect(parseHistory(raw)).toEqual(EMPTY_HISTORY)
    const tooHigh = JSON.stringify({ version: 1, attempts: [attempt({ score: 5000 })] })
    expect(parseHistory(tooHigh)).toEqual(EMPTY_HISTORY)
  })
  it('gueltiger Verlauf mit Einstellungen wird uebernommen, Unbekanntes ignoriert', () => {
    const raw = JSON.stringify({
      version: 1,
      attempts: [attempt()],
      preferredLocale: 'en',
      theme: 'dark',
      learnCardsSeen: true,
      injected: 'ignore me',
    })
    const h = parseHistory(raw)
    expect(h.attempts).toHaveLength(1)
    expect(h.preferredLocale).toBe('en')
    expect(h.theme).toBe('dark')
    expect(h.learnCardsSeen).toBe(true)
    expect((h as Record<string, unknown>).injected).toBeUndefined()
  })
  it('ungueltige Locale/Theme werden weggelassen', () => {
    const h = parseHistory(JSON.stringify({ version: 1, attempts: [], preferredLocale: 'xx', theme: 'neon' }))
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
