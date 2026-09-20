import { describe, expect, it } from 'vitest'
import { CARDS } from '../../src/content/e-invoicing/cards'
import { QUESTIONS } from '../../src/content/e-invoicing/questions'
import { DRAW_MIX } from '../../src/core/draw'
import type { LocalizedText } from '../../src/core/types'
import { MESSAGES, formatDuration, interpolate, lt, translate } from '../../src/i18n/t'

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

function collectTexts(): { where: string; text: LocalizedText }[] {
  const out: { where: string; text: LocalizedText }[] = []
  for (const c of CARDS) {
    out.push({ where: `${c.id}.title`, text: c.title })
    c.body.forEach((p, i) => out.push({ where: `${c.id}.body[${i}]`, text: p }))
  }
  for (const q of QUESTIONS) {
    out.push({ where: `${q.id}.prompt`, text: q.prompt }, { where: `${q.id}.explanation`, text: q.explanation })
    if (q.type === 'single' || q.type === 'multi') for (const o of q.options) out.push({ where: `${q.id}.${o.id}`, text: o.label })
    if (q.type === 'matching') {
      for (const o of q.left) out.push({ where: `${q.id}.left.${o.id}`, text: o.label })
      for (const o of q.right) out.push({ where: `${q.id}.right.${o.id}`, text: o.label })
    }
  }
  return out
}

describe('Fachinhalt', () => {
  it('jede LocalizedText hat de und en (Slider-Einheit darf leer sein)', () => {
    const missing = collectTexts()
      .filter(({ text }) => !text.de || text.en === undefined)
      .map((x) => x.where)
    expect(missing).toEqual([])
    expect(lt('fr', { de: 'D', en: 'E' })).toBe('D')
    expect(lt('en', { de: 'D', en: 'E' })).toBe('E')
  })
  it('Pool: 25 Fragen, Verteilung 15/5/3/2, IDs eindeutig, Pool deckt den Mix', () => {
    expect(QUESTIONS).toHaveLength(25)
    const count = (t: string) => QUESTIONS.filter((q) => q.type === t).length
    expect(count('single')).toBe(15)
    expect(count('multi')).toBe(5)
    expect(count('slider')).toBe(3)
    expect(count('matching')).toBe(2)
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(25)
    for (const [type, want] of Object.entries(DRAW_MIX)) expect(count(type)).toBeGreaterThanOrEqual(want)
  })
  it('Loesungen verweisen auf existierende Optionen, Multi hat 3 richtige, Slider-Ziel auf Raster', () => {
    for (const q of QUESTIONS) {
      if (q.type === 'single') {
        expect(q.options.map((o) => o.id), q.id).toContain(q.correctOptionId)
        expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length)
      }
      if (q.type === 'multi') {
        const ids = q.options.map((o) => o.id)
        for (const c of q.correctOptionIds) expect(ids, q.id).toContain(c)
        expect(q.correctOptionIds.length, q.id).toBe(3)
        expect(q.options.length, q.id).toBe(5)
      }
      if (q.type === 'slider') {
        expect((q.target - q.min) % q.step, q.id).toBe(0)
        expect(q.target).toBeGreaterThanOrEqual(q.min)
        expect(q.target).toBeLessThanOrEqual(q.max)
        expect(q.zeroAt).toBeGreaterThan(q.tolerance)
      }
      if (q.type === 'matching') {
        const left = new Set(q.left.map((o) => o.id))
        const right = new Set(q.right.map((o) => o.id))
        expect(Object.keys(q.pairs).sort(), q.id).toEqual([...left].sort())
        for (const r of Object.values(q.pairs)) expect(right, q.id).toContain(r)
      }
    }
  })
  it('Lernkarten-Absaetze sind sauber geschnitten (kein Bruch mitten im Satz)', () => {
    for (const c of CARDS) {
      expect(c.body.length, c.id).toBeGreaterThanOrEqual(2)
      for (const [i, p] of c.body.entries()) {
        for (const locale of ['de', 'en'] as const) {
          const text = (p[locale] ?? '').trim()
          expect(text.length, `${c.id}.body[${i}].${locale}`).toBeGreaterThan(0)
          // Absatz startet mit Grossbuchstabe oder oeffnendem Anfuehrungszeichen ...
          expect(text[0], `${c.id}.body[${i}].${locale} Anfang: ${text.slice(0, 40)}`).toMatch(/[A-ZÄÖÜ„“"]/)
          // ... und endet mit einem Satzzeichen (faengt Schnitte in Datumsangaben wie "1. Januar")
          expect(text.slice(-1), `${c.id}.body[${i}].${locale} Ende: ${text.slice(-40)}`).toMatch(/[.!?“"]/)
        }
      }
    }
  })
    it('9 Lernkarten mit eindeutigen IDs', () => {
    expect(CARDS).toHaveLength(9)
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(9)
  })
})
