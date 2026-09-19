import { useId } from 'react'
import type { Answer, SliderQuestion } from '../../core/types'
import { useI18n } from '../../i18n/t'

type Props = { question: SliderQuestion; answer: Answer | undefined; onChange: (a: Answer | undefined) => void }

export function SliderQuestionView({ question, answer, onChange }: Props) {
  const { t, lt, num } = useI18n()
  const sliderId = useId()
  const inputId = useId()
  const unit = lt(question.unit)
  const value = answer?.type === 'slider' ? answer.value : undefined
  const mid = question.min + Math.round((question.max - question.min) / 2 / question.step) * question.step
  const shown = value ?? mid

  const set = (raw: number) => {
    if (!Number.isFinite(raw)) {
      onChange(undefined)
      return
    }
    const clamped = Math.min(question.max, Math.max(question.min, raw))
    onChange({ type: 'slider', value: clamped })
  }

  const fmt = (n: number) => (unit ? t('result.sliderUnit', { value: num(n), unit }) : num(n))

  return (
    <fieldset>
      <span className="type-badge">{t('type.slider')}</span>
      <legend>{lt(question.prompt)}</legend>
      <div className="slider-wrap">
        <div className="slider-value" aria-live="polite">
          {value === undefined ? '–' : fmt(value)}
        </div>
        <label className="vh" htmlFor={sliderId}>
          {t('quiz.sliderLabel')}
        </label>
        <input
          id={sliderId}
          className="slider"
          type="range"
          min={question.min}
          max={question.max}
          step={question.step}
          value={shown}
          onChange={(e) => set(Number(e.target.value))}
          aria-valuetext={value === undefined ? undefined : fmt(value)}
        />
        <div className="slider-scale" aria-hidden="true">
          <span>{fmt(question.min)}</span>
          <span>{fmt(question.max)}</span>
        </div>
        <div className="num-row">
          <label htmlFor={inputId} className="small muted">
            {t('quiz.sliderInputLabel')}
          </label>
          <input
            id={inputId}
            className="num-input"
            type="number"
            inputMode="numeric"
            min={question.min}
            max={question.max}
            step={question.step}
            value={value ?? ''}
            onChange={(e) => set(e.target.value === '' ? Number.NaN : Number(e.target.value))}
          />
          {unit ? <span className="muted">{unit}</span> : null}
        </div>
      </div>
    </fieldset>
  )
}
