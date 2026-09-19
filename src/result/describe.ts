import type { Answer, Question } from '../core/types'
import type { I18n } from '../i18n/t'

export type AnswerDescription = { yours: string[]; correct: string[] }

/** Menschlich lesbare Darstellung von gegebener und richtiger Antwort fuer die Aufloesung. */
export function describeAnswer(q: Question, a: Answer | undefined, i18n: I18n): AnswerDescription {
  const { t, lt, num } = i18n
  const none = [t('result.noAnswer')]
  switch (q.type) {
    case 'single': {
      const label = (id: string | undefined) => q.options.find((o) => o.id === id)
      const mine = a?.type === 'single' ? label(a.optionId) : undefined
      return { yours: mine ? [lt(mine.label)] : none, correct: [lt(label(q.correctOptionId)?.label ?? { de: q.correctOptionId })] }
    }
    case 'multi': {
      const labels = (ids: string[]) => q.options.filter((o) => ids.includes(o.id)).map((o) => lt(o.label))
      const mine = a?.type === 'multi' ? labels(a.optionIds) : []
      return { yours: mine.length ? mine : none, correct: labels(q.correctOptionIds) }
    }
    case 'slider': {
      const unit = lt(q.unit)
      const fmt = (v: number) => (unit ? t('result.sliderUnit', { value: num(v), unit }) : num(v))
      return { yours: a?.type === 'slider' ? [fmt(a.value)] : none, correct: [fmt(q.target)] }
    }
    case 'matching': {
      const right = (id: string | undefined) => {
        const r = q.right.find((o) => o.id === id)
        return r ? lt(r.label) : '–'
      }
      const mine = a?.type === 'matching' ? a.pairs : {}
      const anyMine = Object.keys(mine).length > 0
      return {
        yours: anyMine ? q.left.map((l) => lt(l.label) + ' → ' + right(mine[l.id])) : none,
        correct: q.left.map((l) => lt(l.label) + ' → ' + right(q.pairs[l.id])),
      }
    }
  }
}

export type AnswerState = 'correct' | 'partial' | 'wrong'
export function answerState(points: number, max: number): AnswerState {
  if (points >= max) return 'correct'
  if (points > 0) return 'partial'
  return 'wrong'
}
