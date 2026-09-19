import { useId } from 'react'
import type { Answer, SingleChoiceQuestion } from '../../core/types'
import { useI18n } from '../../i18n/t'

type Props = { question: SingleChoiceQuestion; answer: Answer | undefined; onChange: (a: Answer | undefined) => void }

export function SingleQuestion({ question, answer, onChange }: Props) {
  const { t, lt } = useI18n()
  const name = useId()
  const chosen = answer?.type === 'single' ? answer.optionId : undefined
  return (
    <fieldset>
      <span className="type-badge">{t('type.single')}</span>
      <legend>{lt(question.prompt)}</legend>
      <ul className="options">
        {question.options.map((o) => (
          <li key={o.id}>
            <label className="option">
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={chosen === o.id}
                onChange={() => onChange({ type: 'single', optionId: o.id })}
              />
              <span className="option-text">{lt(o.label)}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}
