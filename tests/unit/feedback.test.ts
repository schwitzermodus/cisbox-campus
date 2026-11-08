import { describe, expect, it } from 'vitest'
import { matchingMarks, optionMarks, sliderRange } from '../../src/core/feedback'
import type { MatchingQuestion, MultiSelectQuestion, SingleChoiceQuestion, SliderQuestion } from '../../src/core/types'

const base = { difficulty: 'basic' as const, prompt: { de: 'p' }, explanation: { de: 'e' } }
const opts = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, label: { de: id } }))

const single: SingleChoiceQuestion = { ...base, id: 't-s', type: 'single', options: opts, correctOptionId: 'b' }
const multi: MultiSelectQuestion = { ...base, id: 't-m', type: 'multi', options: opts, correctOptionIds: ['a', 'c', 'e'] }

describe('optionMarks (Single Choice)', () => {
  it('richtig gewaehlt: correct, Rest neutral', () => {
    const m = optionMarks(single, { type: 'single', optionId: 'b' })
    expect(m).toEqual({ a: 'neutral', b: 'correct', c: 'neutral', d: 'neutral', e: 'neutral' })
  })
  it('falsch gewaehlt: wrong-chosen und die richtige Option als missed', () => {
    const m = optionMarks(single, { type: 'single', optionId: 'd' })
    expect(m.d).toBe('wrong-chosen')
    expect(m.b).toBe('missed')
    expect(m.a).toBe('neutral')
  })
  it('ohne Antwort: richtige Option missed, nichts wrong-chosen', () => {
    const m = optionMarks(single, undefined)
    expect(m.b).toBe('missed')
    expect(Object.values(m).filter((x) => x === 'wrong-chosen')).toHaveLength(0)
  })
  it('Antwort eines anderen Typs wird ignoriert', () => {
    const m = optionMarks(single, { type: 'multi', optionIds: ['a'] })
    expect(m.a).toBe('neutral')
    expect(m.b).toBe('missed')
  })
})

describe('optionMarks (Multiple Select)', () => {
  it('alle richtigen gewaehlt', () => {
    const m = optionMarks(multi, { type: 'multi', optionIds: ['a', 'c', 'e'] })
    expect(m).toEqual({ a: 'correct', b: 'neutral', c: 'correct', d: 'neutral', e: 'correct' })
  })
  it('gemischt: correct, wrong-chosen, missed, neutral', () => {
    const m = optionMarks(multi, { type: 'multi', optionIds: ['a', 'b'] })
    expect(m).toEqual({ a: 'correct', b: 'wrong-chosen', c: 'missed', d: 'neutral', e: 'missed' })
  })
  it('leere Auswahl: richtige sind missed', () => {
    const m = optionMarks(multi, { type: 'multi', optionIds: [] })
    expect(m).toEqual({ a: 'missed', b: 'neutral', c: 'missed', d: 'neutral', e: 'missed' })
  })
})

const matching: MatchingQuestion = {
  ...base,
  id: 't-x',
  type: 'matching',
  left: [1, 2, 3].map((n) => ({ id: 'l' + n, label: { de: 'L' + n } })),
  right: [1, 2, 3].map((n) => ({ id: 'r' + n, label: { de: 'R' + n } })),
  pairs: { l1: 'r1', l2: 'r2', l3: 'r3' },
}

describe('matchingMarks', () => {
  it('richtig, falsch und leer je Zeile samt richtigem Partner', () => {
    const m = matchingMarks(matching, { type: 'matching', pairs: { l1: 'r1', l2: 'r3' } })
    expect(m.l1).toEqual({ status: 'right', correctRightId: 'r1' })
    expect(m.l2).toEqual({ status: 'wrong', correctRightId: 'r2' })
    expect(m.l3).toEqual({ status: 'empty', correctRightId: 'r3' })
  })
  it('leerer String zaehlt als leer', () => {
    expect(matchingMarks(matching, { type: 'matching', pairs: { l1: '' } }).l1?.status).toBe('empty')
  })
  it('ohne Antwort: alles leer, richtige Partner trotzdem geliefert', () => {
    const m = matchingMarks(matching, undefined)
    expect(Object.values(m).map((x) => x.status)).toEqual(['empty', 'empty', 'empty'])
    expect(m.l2?.correctRightId).toBe('r2')
  })
})

const slider = (over: Partial<SliderQuestion> = {}): SliderQuestion => ({
  ...base,
  id: 't-sl',
  type: 'slider',
  min: 0,
  max: 100,
  step: 1,
  unit: { de: '' },
  target: 50,
  tolerance: 10,
  zeroAt: 40,
  ...over,
})

describe('sliderRange', () => {
  it('target +/- tolerance', () => {
    expect(sliderRange(slider())).toEqual({ from: 40, to: 60 })
  })
  it('tolerance 0 ergibt einen einzelnen Wert', () => {
    expect(sliderRange(slider({ tolerance: 0 }))).toEqual({ from: 50, to: 50 })
  })
  it('wird unten auf min begrenzt', () => {
    expect(sliderRange(slider({ target: 5 }))).toEqual({ from: 0, to: 15 })
  })
  it('wird oben auf max begrenzt', () => {
    expect(sliderRange(slider({ target: 95 }))).toEqual({ from: 85, to: 100 })
  })
})
