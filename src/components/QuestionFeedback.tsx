import { matchingMarks, sliderRange } from '../core/feedback'
import { scoreQuestion } from '../core/scoring'
import { POINTS_PER_QUESTION } from '../core/types'
import type { Answer, Question } from '../core/types'
import { useI18n } from '../i18n/t'
import type { I18n } from '../i18n/t'
import { answerState } from '../result/describe'

type MarkKind = 'correct' | 'wrong-chosen' | 'missed'

/** Marke mit Symbol UND Text, damit Richtig/Falsch nicht nur an der Farbe haengt. */
export function MarkLabel({ kind }: { kind: MarkKind }) {
  const { t } = useI18n()
  const icon = kind === 'correct' ? '✓' : kind === 'wrong-chosen' ? '✕' : '○'
  const text = kind === 'correct' ? t('quiz.markCorrect') : kind === 'wrong-chosen' ? t('quiz.markWrongChosen') : t('quiz.markMissed')
  return (
    <span className="mark" data-mark={kind}>
      <span aria-hidden="true">{icon}</span> {text}
    </span>
  )
}

type Props = { question: Question; answer: Answer | undefined; checked: boolean }

/**
 * Feedback unter der Frage. Die Live-Region steht immer im DOM und wird erst nach dem Pruefen
 * befuellt, sonst sagen Screenreader den Inhalt nicht an.
 */
export function QuestionFeedback({ question: q, answer, checked }: Props) {
  const i18n = useI18n()
  return (
    <div role="status" className="fb-region">
      {checked ? <FeedbackBody q={q} answer={answer} i18n={i18n} /> : null}
    </div>
  )
}

function FeedbackBody({ q, answer, i18n }: { q: Question; answer: Answer | undefined; i18n: I18n }) {
  const { t, lt, num } = i18n
  const state = answerState(scoreQuestion(q, answer), POINTS_PER_QUESTION)
  const label = state === 'correct' ? t('result.stateCorrect') : state === 'partial' ? t('result.statePartial') : t('result.stateWrong')
  const icon = state === 'correct' ? '✓' : state === 'partial' ? '◐' : '✕'

  let solution
  switch (q.type) {
    case 'single':
    case 'multi': {
      const ids = q.type === 'single' ? [q.correctOptionId] : q.correctOptionIds
      const items = q.options.filter((o) => ids.includes(o.id))
      solution = (
        <>
          <dt>{t('result.correctAnswer')}</dt>
          <dd>
            <ul>
              {items.map((o) => (
                <li key={o.id}>{lt(o.label)}</li>
              ))}
            </ul>
          </dd>
        </>
      )
      break
    }
    case 'slider': {
      const unit = lt(q.unit)
      const fmt = (v: number) => (unit ? t('result.sliderUnit', { value: num(v), unit }) : num(v))
      const range = sliderRange(q)
      solution = (
        <>
          <dt>{t('quiz.yourValue')}</dt>
          <dd>{answer?.type === 'slider' ? fmt(answer.value) : t('result.noAnswer')}</dd>
          <dt>{t('result.correctAnswer')}</dt>
          <dd>
            {fmt(q.target)}
            {range.from < range.to ? ' (' + t('quiz.correctRange', { from: fmt(range.from), to: fmt(range.to) }) + ')' : ''}
          </dd>
        </>
      )
      break
    }
    case 'matching': {
      const marks = matchingMarks(q, answer)
      const right = (id: string | undefined) => {
        const r = q.right.find((o) => o.id === id)
        return r ? lt(r.label) : '–'
      }
      solution = (
        <>
          <dt>{t('result.correctAnswer')}</dt>
          <dd>
            <ul>
              {q.left.map((l) => {
                const m = marks[l.id]!
                return (
                  <li key={l.id}>
                    {lt(l.label)} → {right(m.correctRightId)}{' '}
                    {m.status === 'right' ? (
                      <MarkLabel kind="correct" />
                    ) : m.status === 'wrong' ? (
                      <MarkLabel kind="wrong-chosen" />
                    ) : (
                      <MarkLabel kind="missed" />
                    )}
                  </li>
                )
              })}
            </ul>
          </dd>
        </>
      )
      break
    }
  }

  return (
    <div className="fb" data-state={state}>
      <span className="bd-state" data-state={state}>
        <span aria-hidden="true">{icon}</span> {label}
      </span>
      <dl className="bd-kv">{solution}</dl>
      <p className="fb-expl">
        <strong>{t('quiz.explanation')}:</strong> {lt(q.explanation)}
      </p>
    </div>
  )
}
