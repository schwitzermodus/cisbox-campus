import { describe, expect, it } from 'vitest'
import { formatDuration, interpolate, MESSAGES, translate } from '../../src/i18n/t'

const deKeys = Object.keys(MESSAGES.de).sort()

describe('UI-Messages', () => {
  it('en hat exakt dieselben Keys wie de und keine leeren Werte', () => {
    expect(Object.keys(MESSAGES.en).sort()).toEqual(deKeys)
    const empty = Object.entries(MESSAGES.en).filter(([, v]) => v.trim() === '').map(([k]) => k)
    expect(empty).toEqual([])
  })
  it('de hat keine leeren Werte', () => {
    const empty = Object.entries(MESSAGES.de).filter(([, v]) => v.trim() === '').map(([k]) => k)
    expect(empty).toEqual([])
  })
  it('fr/no/vi-Gerueste haben dieselben Keys (Luecken sind nur Warnung)', () => {
    for (const l of ['fr', 'no', 'vi'] as const) {
      expect(Object.keys(MESSAGES[l]).sort()).toEqual(deKeys)
      const missing = Object.entries(MESSAGES[l]).filter(([, v]) => v.trim() === '').length
      if (missing > 0) console.warn(`i18n: ${l} hat ${missing} von ${deKeys.length} Werten noch nicht uebersetzt`)
    }
  })
  it('Platzhalter in de und en stimmen ueberein', () => {
    const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort()
    for (const k of deKeys) {
      expect(ph(MESSAGES.en[k] ?? ''), k).toEqual(ph(MESSAGES.de[k] ?? ''))
    }
  })
  it('translate faellt bei leerem Wert auf de zurueck, interpolate ersetzt Platzhalter', () => {
    expect(translate('fr', 'quiz.submit')).toBe(MESSAGES.de['quiz.submit'])
    expect(translate('en', 'quiz.progress', { n: 3, total: 10 })).toBe('Question 3 of 10')
    expect(interpolate('{a} und {b} und {c}', { a: 1, b: 'x' })).toBe('1 und x und {c}')
    expect(formatDuration('de', 412_000)).toBe('6 min 52 s')
    expect(formatDuration('en', 9_400)).toBe('9 s')
  })
})
