import { useId } from 'react'
import { optionMarks } from '../../core/feedback'
import type { Answer, SingleChoiceQuestion } from '../../core/types'
import { useI18n } from '../../i18n/t'
import { MarkLabel } from '../QuestionFeedback'

type Props = {
  question: SingleChoiceQuestion
  answer: Answer | undefined
  onChange: (a: Answer | undefined) => void
  /** Eingaben gesperrt (Antwort wurde geprueft). */
  locked?: boolean
  /** Marken je Option bzw. Zeile anzeigen. */
  reveal?: boolean
}

export function SingleQuestion({ question, answer, onChange, locked, reveal }: Props) {
  const { t, lt } = useI18n()
  const name = useId()
  const chosen = answer?.type === 'single' ? answer.optionId : undefined
  const marks = reveal ? optionMarks(question, answer) : null
  return (
    <fieldset disabled={locked}>
      <span className="type-badge">{t('type.single')}</span>
      <legend>{lt(question.prompt)}</legend>
      <ul className="options">
        {question.options.map((o) => (
          <li key={o.id}>
            <label className="option" data-mark={marks?.[o.id]}>
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={chosen === o.id}
                onChange={() => onChange({ type: 'single', optionId: o.id })}
              />
              <span className="option-text">{lt(o.label)}</span>
              {marks && marks[o.id] !== 'neutral' ? <MarkLabel kind={marks[o.id] as 'correct' | 'wrong-chosen' | 'missed'} /> : null}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}
