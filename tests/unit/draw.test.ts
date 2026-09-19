import { describe, expect, it } from 'vitest'
import { DRAW_MIX, QUESTIONS_PER_QUIZ, drawQuestions, shuffle } from '../../src/core/draw'
import type { Question } from '../../src/core/types'

const base = { topic: 'e-invoicing', difficulty: 'basic', prompt: { de: 'p' }, explanation: { de: 'e' } } as const
const opts = (n: number) => Array.from({ length: n }, (_, i) => ({ id: 'o' + i, label: { de: 'o' + i } }))

function pool(): Question[] {
  const qs: Question[] = []
  for (let i = 0; i < 15; i++) qs.push({ ...base, id: 's' + i, type: 'single', options: opts(4), correctOptionId: 'o0' })
  for (let i = 0; i < 5; i++) qs.push({ ...base, id: 'm' + i, type: 'multi', options: opts(5), correctOptionIds: ['o0', 'o1', 'o2'] })
  for (let i = 0; i < 3; i++) {
    qs.push({ ...base, id: 'sl' + i, type: 'slider', min: 0, max: 100, step: 1, unit: { de: '' }, target: 50, tolerance: 0, zeroAt: 10 })
  }
  for (let i = 0; i < 2; i++) {
    qs.push({ ...base, id: 'mt' + i, type: 'matching', left: opts(5), right: opts(5), pairs: { o0: 'o0', o1: 'o1', o2: 'o2', o3: 'o3', o4: 'o4' } })
  }
  return qs
}

/** Deterministischer LCG fuer reproduzierbare Tests. */
function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

describe('drawQuestions', () => {
  it('zieht 10 Fragen im Mix 6/2/1/1, Zuordnung zuletzt', () => {
    const set = drawQuestions(pool(), seeded(1))
    expect(set).toHaveLength(QUESTIONS_PER_QUIZ)
    expect(QUESTIONS_PER_QUIZ).toBe(10)
    const count = (t: string) => set.filter((q) => q.type === t).length
    expect(count('single')).toBe(DRAW_MIX.single)
    expect(count('multi')).toBe(DRAW_MIX.multi)
    expect(count('slider')).toBe(DRAW_MIX.slider)
    expect(count('matching')).toBe(DRAW_MIX.matching)
    expect(set[set.length - 1]?.type).toBe('matching')
    expect(new Set(set.map((q) => q.id)).size).toBe(10)
  })
  it('zwei Ziehungen liefern nicht dasselbe Set', () => {
    const a = drawQuestions(pool(), seeded(7)).map((q) => q.id).join(',')
    const b = drawQuestions(pool(), seeded(99)).map((q) => q.id).join(',')
    expect(a).not.toBe(b)
  })
  it('shuffelt Optionen, veraendert aber nicht die Originalfrage', () => {
    const p = pool()
    const original = p[0]
    const before = (original as Extract<Question, { type: 'single' }>).options.map((o) => o.id).join(',')
    drawQuestions(p, seeded(3))
    expect((p[0] as Extract<Question, { type: 'single' }>).options.map((o) => o.id).join(',')).toBe(before)
  })
  it('wirft, wenn der Pool einen Typ nicht hergibt', () => {
    expect(() => drawQuestions(pool().filter((q) => q.type !== 'slider'), seeded(1))).toThrow(/slider/)
  })
})

describe('shuffle', () => {
  it('ist eine Permutation und laesst das Original unveraendert', () => {
    const src = [1, 2, 3, 4, 5, 6, 7, 8]
    const out = shuffle(src, seeded(42))
    expect(out.slice().sort((a, b) => a - b)).toEqual(src)
    expect(src).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
})
