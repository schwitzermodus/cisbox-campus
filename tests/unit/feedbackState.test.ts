import { describe, expect, it } from 'vitest'
import { scoreQuestion, scoreQuiz } from '../../src/core/scoring'
import { POINTS_PER_QUESTION } from '../../src/core/types'
import type {
  Answer,
  AnswerMap,
  MatchingQuestion,
  MultiSelectQuestion,
  Question,
  SingleChoiceQuestion,
  SliderQuestion,
} from '../../src/core/types'
import { answerState } from '../../src/result/describe'

/** Status wie im Sofort-Feedback: answerState(scoreQuestion(...)). */
const state = (q: Question, a: Answer | undefined) => answerState(scoreQuestion(q, a), POINTS_PER_QUESTION)

const base = { difficulty: 'basic' as const, prompt: { de: 'p' }, explanation: { de: 'e' } }
const opts = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, label: { de: id } }))

const single: SingleChoiceQuestion = { ...base, id: 't-s', type: 'single', options: opts, correctOptionId: 'b' }
const multi: MultiSelectQuestion = { ...base, id: 't-m', type: 'multi', options: opts, correctOptionIds: ['a', 'c', 'e'] }
const slider: SliderQuestion = {
  ...base,
  id: 't-sl',
  type: 'slider',
  min: 0,
  max: 1000,
  step: 1,
  unit: { de: '' },
  target: 500,
  tolerance: 50,
  zeroAt: 250,
}
const matching: MatchingQuestion = {
  ...base,
  id: 't-x',
  type: 'matching',
  left: [1, 2, 3, 4].map((n) => ({ id: 'l' + n, label: { de: 'L' + n } })),
  right: [1, 2, 3, 4].map((n) => ({ id: 'r' + n, label: { de: 'R' + n } })),
  pairs: { l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' },
}

const pairs = (p: Record<string, string>): Answer => ({ type: 'matching', pairs: p })

describe('Feedback-Status (Richtig / Teilweise richtig / Falsch)', () => {
  it('Single Choice kennt nur correct und wrong', () => {
    expect(state(single, { type: 'single', optionId: 'b' })).toBe('correct')
    expect(state(single, { type: 'single', optionId: 'a' })).toBe('wrong')
    expect(state(single, undefined)).toBe('wrong')
  })
  it('Multiple Select: alle richtig, Teil richtig, nur falsch', () => {
    expect(state(multi, { type: 'multi', optionIds: ['a', 'c', 'e'] })).toBe('correct')
    expect(state(multi, { type: 'multi', optionIds: ['a', 'c'] })).toBe('partial')
    expect(state(multi, { type: 'multi', optionIds: ['b', 'd'] })).toBe('wrong')
  })
  it('Multiple Select: falsche Zusatzwahl zieht ab', () => {
    expect(state(multi, { type: 'multi', optionIds: ['a', 'c', 'e', 'b'] })).toBe('partial')
    expect(state(multi, { type: 'multi', optionIds: ['a', 'b'] })).toBe('wrong')
  })
  it('Schaetzfrage: innerhalb tolerance richtig, zwischen tolerance und zeroAt teilweise, ab zeroAt falsch', () => {
    expect(state(slider, { type: 'slider', value: 500 })).toBe('correct')
    expect(state(slider, { type: 'slider', value: 550 })).toBe('correct')
    expect(state(slider, { type: 'slider', value: 650 })).toBe('partial')
    expect(state(slider, { type: 'slider', value: 750 })).toBe('wrong')
    expect(state(slider, { type: 'slider', value: 0 })).toBe('wrong')
  })
  it('Zuordnung: alle Paare richtig, Teil der Paare, keine', () => {
    expect(state(matching, pairs({ l1: 'r1', l2: 'r2', l3: 'r3', l4: 'r4' }))).toBe('correct')
    expect(state(matching, pairs({ l1: 'r1', l2: 'r2', l3: 'r4', l4: 'r3' }))).toBe('partial')
    expect(state(matching, pairs({ l1: 'r1' }))).toBe('partial')
    expect(state(matching, pairs({ l1: 'r2', l2: 'r1' }))).toBe('wrong')
    expect(state(matching, undefined)).toBe('wrong')
  })
})

describe('Bewertung unveraendert (AK14)', () => {
  const questions = [single, multi, slider, matching]
  const answers: AnswerMap = {
    [single.id]: { type: 'single', optionId: 'b' },
    [multi.id]: { type: 'multi', optionIds: ['a', 'c'] },
    [slider.id]: { type: 'slider', value: 650 },
    [matching.id]: pairs({ l1: 'r1', l2: 'r2' }),
  }
  it('gleiche Antworten ergeben gleiche Punkte (scoreQuiz kennt kein `checked`)', () => {
    const r = scoreQuiz(questions, answers)
    expect(r.breakdown.map((x) => x.points)).toEqual([100, 67, 50, 50])
    expect(r.score).toBe(267)
    expect(r.maxScore).toBe(400)
    expect(scoreQuiz(questions, { ...answers })).toEqual(r)
  })
  it('Punkte je Frage stimmen mit dem Feedback-Status ueberein', () => {
    const r = scoreQuiz(questions, answers)
    expect(r.breakdown.map((x) => answerState(x.points, x.maxPoints))).toEqual(['correct', 'partial', 'partial', 'partial'])
  })
})
