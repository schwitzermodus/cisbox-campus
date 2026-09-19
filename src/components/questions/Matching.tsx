import { useId } from 'react'
import type { Answer, MatchingQuestion } from '../../core/types'
import { useI18n } from '../../i18n/t'

type Props = { question: MatchingQuestion; answer: Answer | undefined; onChange: (a: Answer | undefined) => void }

/** Zuordnung als Liste von Zeilen mit Dropdown, kein Drag and Drop (mobile first). */
export function MatchingQuestionView({ question, answer, onChange }: Props) {
  const { t, lt } = useI18n()
  const baseId = useId()
  const pairs = answer?.type === 'matching' ? answer.pairs : {}

  const set = (leftId: string, rightId: string) => {
    const next = { ...pairs }
    if (rightId === '') delete next[leftId]
    else next[leftId] = rightId
    onChange(Object.keys(next).length === 0 ? undefined : { type: 'matching', pairs: next })
  }

  return (
    <fieldset>
      <span className="type-badge">{t('type.matching')}</span>
      <legend>{lt(question.prompt)}</legend>
      <p className="muted small">{t('quiz.matchingHint')}</p>
      <ul className="match-list">
        {question.left.map((l) => {
          const id = baseId + '-' + l.id
          return (
            <li key={l.id} className="match-row">
              <label className="match-left" htmlFor={id}>
                {lt(l.label)}
              </label>
              <select id={id} className="select" value={pairs[l.id] ?? ''} onChange={(e) => set(l.id, e.target.value)}>
                <option value="">{t('quiz.matchingPlaceholder')}</option>
                {question.right.map((r) => (
                  <option key={r.id} value={r.id}>
                    {lt(r.label)}
                  </option>
                ))}
              </select>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}
