import { useI18n } from '../i18n/t'

type Props = { value: number; max: number; label: string; right?: string }

export function Progress({ value, max, label, right }: Props) {
  const { t } = useI18n()
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="progress-label">
        <span aria-live="polite">{label}</span>
        {right ? <span>{right}</span> : null}
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label={t('a11y.progress')}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div className="progress-bar" style={{ width: pct + '%' }} />
      </div>
    </div>
  )
}
