import type { Answer, MultiSelectQuestion } from '../../core/types'
import { useI18n } from '../../i18n/t'

type Props = { question: MultiSelectQuestion; answer: Answer | undefined; onChange: (a: Answer | undefined) => void }

export function MultiQuestion({ question, answer, onChange }: Props) {
  const { t, lt } = useI18n()
  const chosen = answer?.type === 'multi' ? answer.optionIds : []

  const toggle = (id: string) => {
    const next = chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]
    onChange(next.length === 0 ? undefined : { type: 'multi', optionIds: next })
  }

  return (
    <fieldset>
      <span className="type-badge">{t('type.multi')}</span>
      <legend>{lt(question.prompt)}</legend>
      <p className="muted small">{t('quiz.multiHint')}</p>
      <ul className="options">
        {question.options.map((o) => (
          <li key={o.id}>
            <label className="option">
              <input type="checkbox" value={o.id} checked={chosen.includes(o.id)} onChange={() => toggle(o.id)} />
              <span className="option-text">{lt(o.label)}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}
