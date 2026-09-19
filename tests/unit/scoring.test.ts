import { describe, expect, it } from 'vitest'
import { scoreMatching, scoreMulti, scoreQuiz, scoreSingle, scoreSlider } from '../../src/core/scoring'
import type { MatchingQuestion, MultiSelectQuestion, SingleChoiceQuestion, SliderQuestion } from '../../src/core/types'

const base = { topic: 'e-invoicing', difficulty: 'basic', prompt: { de: 'p' }, explanation: { de: 'e' } } as const

const single: SingleChoiceQuestion = {
  ...base,
  id: 's1',
  type: 'single',
  options: [{ id: 'a', label: { de: 'a' } }, { id: 'b', label: { de: 'b' } }],
  correctOptionId: 'b',
}
const multi3: MultiSelectQuestion = {
  ...base,
  id: 'm1',
  type: 'multi',
  options: ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, label: { de: id } })),
  correctOptionIds: ['a', 'b', 'c'],
}
const slider: SliderQuestion = {
  ...base,
  id: 'sl1',
  type: 'slider',
  min: 0,
  max: 2_000_000,
  step: 50_000,
  unit: { de: 'EUR' },
  target: 800_000,
  tolerance: 0,
  zeroAt: 400_000,
}
const matching: MatchingQuestion = {
  ...base,
  id: 'mt1',
  type: 'matching',
  left: ['de', 'fr', 'no', 'it'].map((id) => ({ id, label: { de: id } })),
  right: ['x', 'f', 'e', 'p'].map((id) => ({ id, label: { de: id } })),
  pairs: { de: 'x', fr: 'f', no: 'e', it: 'p' },
}

describe('scoreSingle', () => {
  it('richtig 100, falsch 0, leer 0, falscher Antworttyp 0', () => {
    expect(scoreSingle(single, { type: 'single', optionId: 'b' })).toBe(100)
    expect(scoreSingle(single, { type: 'single', optionId: 'a' })).toBe(0)
    expect(scoreSingle(single, undefined)).toBe(0)
    expect(scoreSingle(single, { type: 'multi', optionIds: ['b'] })).toBe(0)
  })
})

describe('scoreMulti', () => {
  it('Beispiel aus dem Plan: 2 richtig + 1 falsch von 3 -> 33', () => {
    expect(scoreMulti(multi3, { type: 'multi', optionIds: ['a', 'b', 'd'] })).toBe(33)
  })
  it('alles ankreuzen bei 3 von 5 -> 33, alles richtig -> 100, leer -> 0', () => {
    expect(scoreMulti(multi3, { type: 'multi', optionIds: ['a', 'b', 'c', 'd', 'e'] })).toBe(33)
    expect(scoreMulti(multi3, { type: 'multi', optionIds: ['a', 'b', 'c'] })).toBe(100)
    expect(scoreMulti(multi3, { type: 'multi', optionIds: [] })).toBe(0)
    expect(scoreMulti(multi3, undefined)).toBe(0)
  })
  it('nie negativ, unbekannte IDs ignoriert', () => {
    expect(scoreMulti(multi3, { type: 'multi', optionIds: ['d', 'e'] })).toBe(0)
    expect(scoreMulti(multi3, { type: 'multi', optionIds: ['a', 'zzz'] })).toBe(33)
  })
})

describe('scoreSlider', () => {
  it('Treffer 100, Rand 0, linear dazwischen', () => {
    expect(scoreSlider(slider, { type: 'slider', value: 800_000 })).toBe(100)
    expect(scoreSlider(slider, { type: 'slider', value: 1_200_000 })).toBe(0)
    expect(scoreSlider(slider, { type: 'slider', value: 0 })).toBe(0)
    expect(scoreSlider(slider, { type: 'slider', value: 1_000_000 })).toBe(50)
    expect(scoreSlider(slider, { type: 'slider', value: 850_000 })).toBe(88)
    expect(scoreSlider(slider, undefined)).toBe(0)
    expect(scoreSlider(slider, { type: 'slider', value: Number.NaN })).toBe(0)
  })
  it('Toleranz gibt volle Punkte', () => {
    const q: SliderQuestion = { ...slider, tolerance: 100_000 }
    expect(scoreSlider(q, { type: 'slider', value: 900_000 })).toBe(100)
    expect(scoreSlider(q, { type: 'slider', value: 950_000 })).toBe(83)
  })
})

describe('scoreMatching', () => {
  it('halb richtig -> 50, alles -> 100, leer -> 0', () => {
    expect(scoreMatching(matching, { type: 'matching', pairs: { de: 'x', fr: 'f', no: 'p', it: 'e' } })).toBe(50)
    expect(scoreMatching(matching, { type: 'matching', pairs: { de: 'x', fr: 'f', no: 'e', it: 'p' } })).toBe(100)
    expect(scoreMatching(matching, { type: 'matching', pairs: {} })).toBe(0)
    expect(scoreMatching(matching, undefined)).toBe(0)
  })
  it('Doppelwahl derselben rechten Option zaehlt nur das passende Paar', () => {
    expect(scoreMatching(matching, { type: 'matching', pairs: { de: 'x', fr: 'x', no: 'x', it: 'x' } })).toBe(25)
  })
})

describe('scoreQuiz', () => {
  it('addiert Einzelpunkte und rechnet Prozent auf eine Nachkommastelle', () => {
    const r = scoreQuiz([single, multi3, slider, matching], {
      s1: { type: 'single', optionId: 'b' },
      m1: { type: 'multi', optionIds: ['a', 'b', 'd'] },
      mt1: { type: 'matching', pairs: { de: 'x', fr: 'f' } },
    })
    expect(r.maxScore).toBe(400)
    expect(r.score).toBe(100 + 33 + 0 + 50)
    expect(r.percent).toBe(45.8)
    expect(r.breakdown.map((b) => b.correct)).toEqual([true, false, false, false])
  })
})
