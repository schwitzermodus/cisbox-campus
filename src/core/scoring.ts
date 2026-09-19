import { POINTS_PER_QUESTION } from './types'
import type {
  Answer,
  AnswerMap,
  MatchingQuestion,
  MultiSelectQuestion,
  Question,
  SingleChoiceQuestion,
  SliderQuestion,
} from './types'

/** Single Choice: richtig 100, falsch 0. */
export function scoreSingle(q: SingleChoiceQuestion, a: Answer | undefined): number {
  if (!a || a.type !== 'single') return 0
  return a.optionId === q.correctOptionId ? POINTS_PER_QUESTION : 0
}

/**
 * Multiple Select: round(max(0, (korrekt - falsch) / |richtig|) * 100).
 * Optionen, die es in der Frage nicht gibt, werden ignoriert.
 */
export function scoreMulti(q: MultiSelectQuestion, a: Answer | undefined): number {
  if (!a || a.type !== 'multi') return 0
  const valid = new Set(q.options.map((o) => o.id))
  const chosen = new Set(a.optionIds.filter((id) => valid.has(id)))
  const correct = new Set(q.correctOptionIds)
  if (correct.size === 0) return 0
  let hits = 0
  let misses = 0
  for (const id of chosen) {
    if (correct.has(id)) hits++
    else misses++
  }
  return Math.round(Math.max(0, (hits - misses) / correct.size) * POINTS_PER_QUESTION)
}

/** Slider: linear abfallend zwischen tolerance und zeroAt. */
export function scoreSlider(q: SliderQuestion, a: Answer | undefined): number {
  if (!a || a.type !== 'slider' || !Number.isFinite(a.value)) return 0
  const dev = Math.abs(a.value - q.target)
  if (dev <= q.tolerance) return POINTS_PER_QUESTION
  if (dev >= q.zeroAt) return 0
  const span = q.zeroAt - q.tolerance
  if (span <= 0) return 0
  return Math.round((1 - (dev - q.tolerance) / span) * POINTS_PER_QUESTION)
}

/** Zuordnung: Teilpunkte pro richtigem Paar. */
export function scoreMatching(q: MatchingQuestion, a: Answer | undefined): number {
  if (!a || a.type !== 'matching') return 0
  const total = Object.keys(q.pairs).length
  if (total === 0) return 0
  let hits = 0
  for (const [leftId, rightId] of Object.entries(q.pairs)) {
    if (a.pairs[leftId] === rightId) hits++
  }
  return Math.round((hits / total) * POINTS_PER_QUESTION)
}

export function scoreQuestion(q: Question, a: Answer | undefined): number {
  switch (q.type) {
    case 'single':
      return scoreSingle(q, a)
    case 'multi':
      return scoreMulti(q, a)
    case 'slider':
      return scoreSlider(q, a)
    case 'matching':
      return scoreMatching(q, a)
  }
}

export type QuestionResult = {
  id: string
  points: number
  maxPoints: number
  correct: boolean
}

export type QuizResult = {
  score: number
  maxScore: number
  percent: number
  breakdown: QuestionResult[]
}

/** Einzelpunkte werden addiert, nicht ueber Fragen hinweg gerundet. */
export function scoreQuiz(questions: readonly Question[], answers: AnswerMap): QuizResult {
  const breakdown = questions.map((q): QuestionResult => {
    const points = scoreQuestion(q, answers[q.id])
    return { id: q.id, points, maxPoints: POINTS_PER_QUESTION, correct: points === POINTS_PER_QUESTION }
  })
  const score = breakdown.reduce((s, r) => s + r.points, 0)
  const maxScore = questions.length * POINTS_PER_QUESTION
  const percent = maxScore === 0 ? 0 : Math.round((score / maxScore) * 1000) / 10
  return { score, maxScore, percent, breakdown }
}
