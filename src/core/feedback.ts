import type { Answer, MatchingQuestion, MultiSelectQuestion, SingleChoiceQuestion, SliderQuestion } from './types'

/** Markierung einer Option nach dem Pruefen. */
export type OptionMark = 'correct' | 'wrong-chosen' | 'missed' | 'neutral'

/**
 * Markierung je Option fuer Single und Multi:
 * correct = richtig und gewaehlt, wrong-chosen = falsch gewaehlt,
 * missed = richtig, aber nicht gewaehlt, neutral = falsch und nicht gewaehlt.
 */
export function optionMarks(
  q: SingleChoiceQuestion | MultiSelectQuestion,
  a: Answer | undefined,
): Record<string, OptionMark> {
  const correct = new Set(q.type === 'single' ? [q.correctOptionId] : q.correctOptionIds)
  const chosen = new Set<string>(
    a?.type === 'single' && q.type === 'single' ? [a.optionId] : a?.type === 'multi' && q.type === 'multi' ? a.optionIds : [],
  )
  const marks: Record<string, OptionMark> = {}
  for (const o of q.options) {
    const isCorrect = correct.has(o.id)
    const isChosen = chosen.has(o.id)
    marks[o.id] = isCorrect ? (isChosen ? 'correct' : 'missed') : isChosen ? 'wrong-chosen' : 'neutral'
  }
  return marks
}

export type MatchingMark = { status: 'right' | 'wrong' | 'empty'; correctRightId: string | undefined }

/** Markierung je Zeile der Zuordnung: richtig, falsch oder leer, plus der richtige Partner. */
export function matchingMarks(q: MatchingQuestion, a: Answer | undefined): Record<string, MatchingMark> {
  const mine = a?.type === 'matching' ? a.pairs : {}
  const marks: Record<string, MatchingMark> = {}
  for (const l of q.left) {
    const chosen = mine[l.id]
    const correctRightId = q.pairs[l.id]
    marks[l.id] = {
      status: chosen === undefined || chosen === '' ? 'empty' : chosen === correctRightId ? 'right' : 'wrong',
      correctRightId,
    }
  }
  return marks
}

/** Richtiger Bereich einer Schaetzfrage: target +/- tolerance, auf min..max begrenzt. */
export function sliderRange(q: SliderQuestion): { from: number; to: number } {
  return {
    from: Math.max(q.min, q.target - q.tolerance),
    to: Math.min(q.max, q.target + q.tolerance),
  }
}
