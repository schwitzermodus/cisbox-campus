import { describe, expect, it } from 'vitest'
import { COURSES, SEGMENTS, courseById, coursesOfSegment, segmentById } from '../../src/content/registry'
import type { Course } from '../../src/content/types'
import { DRAW_MIX, drawQuestions } from '../../src/core/draw'
import type { LocalizedText } from '../../src/core/types'
import { lt } from '../../src/i18n/t'

/** Deterministischer LCG fuer reproduzierbare Ziehungen. */
function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function collectTexts(course: Course): { where: string; text: LocalizedText }[] {
  const out: { where: string; text: LocalizedText }[] = []
  out.push({ where: 'title', text: course.title }, { where: 'subtitle', text: course.subtitle }, { where: 'intro', text: course.intro })
  for (const c of course.cards) {
    out.push({ where: `${c.id}.title`, text: c.title })
    c.body.forEach((p, i) => out.push({ where: `${c.id}.body[${i}]`, text: p }))
  }
  for (const q of course.questions) {
    out.push({ where: `${q.id}.prompt`, text: q.prompt }, { where: `${q.id}.explanation`, text: q.explanation })
    if (q.type === 'single' || q.type === 'multi') for (const o of q.options) out.push({ where: `${q.id}.${o.id}`, text: o.label })
    if (q.type === 'matching') {
      for (const o of q.left) out.push({ where: `${q.id}.left.${o.id}`, text: o.label })
      for (const o of q.right) out.push({ where: `${q.id}.right.${o.id}`, text: o.label })
    }
  }
  return out
}

describe.each(COURSES.map((c) => [c.id, c] as const))('Kurs %s', (_id, course) => {
  it('9 Lernkarten mit eindeutigen IDs', () => {
    expect(course.cards).toHaveLength(9)
    expect(new Set(course.cards.map((c) => c.id)).size).toBe(9)
  })

  it('Pool: 25 Fragen, Verteilung 15/5/3/2, IDs eindeutig, Pool deckt den Mix', () => {
    expect(course.questions).toHaveLength(25)
    const count = (t: string) => course.questions.filter((q) => q.type === t).length
    expect(count('single')).toBe(15)
    expect(count('multi')).toBe(5)
    expect(count('slider')).toBe(3)
    expect(count('matching')).toBe(2)
    expect(new Set(course.questions.map((q) => q.id)).size).toBe(25)
    for (const [type, want] of Object.entries(DRAW_MIX)) expect(count(type)).toBeGreaterThanOrEqual(want)
  })

  it('Loesungen verweisen auf existierende Optionen, Multi hat 3 richtige, Slider-Ziel auf Raster', () => {
    for (const q of course.questions) {
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
    for (const c of course.cards) {
      expect(c.body.length, c.id).toBeGreaterThanOrEqual(2)
      for (const [i, p] of c.body.entries()) {
        for (const locale of ['de', 'en'] as const) {
          const text = (p[locale] ?? '').trim()
          expect(text.length, `${c.id}.body[${i}].${locale}`).toBeGreaterThan(0)
          expect(text[0], `${c.id}.body[${i}].${locale} Anfang: ${text.slice(0, 40)}`).toMatch(/[A-ZÄÖÜ„“"]/)
          expect(text.slice(-1), `${c.id}.body[${i}].${locale} Ende: ${text.slice(-40)}`).toMatch(/[.!?“"]/)
        }
      }
    }
  })

  it('jede LocalizedText hat de und en (Titel, Untertitel, Intro, Karten, Fragen)', () => {
    const missing = collectTexts(course)
      .filter(({ text }) => !text.de || text.en === undefined)
      .map((x) => x.where)
    expect(missing).toEqual([])
  })

  it('jede card.figure ist in course.figures aufloesbar', () => {
    for (const c of course.cards) {
      if (c.figure !== undefined) expect(course.figures[c.figure], `${c.id}.figure=${c.figure}`).toBeDefined()
    }
  })

  it('alle Frage-IDs tragen das idPrefix des Kurses', () => {
    for (const q of course.questions) expect(q.id.startsWith(course.idPrefix), q.id).toBe(true)
  })

  it('drawQuestions liefert 10 Fragen und wirft nie (100 Ziehungen mit seeded rng)', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const set = drawQuestions(course.questions, seeded(seed))
      expect(set).toHaveLength(10)
    }
  })
})

describe('Registry', () => {
  it('Frage-IDs sind ueber ALLE Kurse eindeutig', () => {
    const all = COURSES.flatMap((c) => c.questions.map((q) => q.id))
    expect(new Set(all).size).toBe(all.length)
  })

  it('kein idPrefix ist Praefix eines anderen', () => {
    for (const a of COURSES) {
      for (const b of COURSES) {
        if (a.id === b.id) continue
        expect(a.idPrefix.startsWith(b.idPrefix), `${a.id} (${a.idPrefix}) vs ${b.id} (${b.idPrefix})`).toBe(false)
      }
    }
  })

  it('quizVersion ist je Kurs eindeutig, contentAsOf ist ein ISO-Datum', () => {
    const versions = COURSES.map((c) => c.quizVersion)
    expect(new Set(versions).size).toBe(versions.length)
    for (const c of COURSES) expect(c.contentAsOf, c.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('jeder Kurs gehoert zu einem existierenden Segment, jedes Segment hat mindestens einen Kurs', () => {
    for (const c of COURSES) expect(segmentById(c.segment), c.id).toBeDefined()
    for (const s of SEGMENTS) expect(coursesOfSegment(s.id).length, s.id).toBeGreaterThan(0)
  })

  it('keine Kurs-ID kollidiert mit einem globalen Screen-Namen', () => {
    for (const c of COURSES) expect(['courses', 'privacy']).not.toContain(c.id)
  })

  it('recommendedAfter zeigt auf einen existierenden, frueheren Kurs (kein Zyklus)', () => {
    for (const c of COURSES) {
      if (!c.recommendedAfter) continue
      const prereq = courseById(c.recommendedAfter)
      expect(prereq, `${c.id}.recommendedAfter=${c.recommendedAfter}`).toBeDefined()
      expect(prereq!.id).not.toBe(c.id)
    }
  })

  it('lt() faellt fuer unbekannte Locales auf Deutsch zurueck', () => {
    expect(lt('fr', { de: 'D', en: 'E' })).toBe('D')
    expect(lt('en', { de: 'D', en: 'E' })).toBe('E')
  })
})
