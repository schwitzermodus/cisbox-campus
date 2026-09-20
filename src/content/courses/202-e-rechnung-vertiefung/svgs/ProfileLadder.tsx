import { useId } from 'react'
import { useI18n } from '../../../../i18n/t'
import type { MessageKey } from '../../../../i18n/t'

const STEPS: { key: MessageKey; h: number }[] = [
  { key: 'figure.profiles.minimum', h: 40 },
  { key: 'figure.profiles.basic', h: 70 },
  { key: 'figure.profiles.en16931', h: 100 },
  { key: 'figure.profiles.extended', h: 130 },
]
const BRAND = 'var(--ds-background-element-brand-primary, #215b33)'
const DIM = 'var(--ds-background-element-dim-green-secondary, #e6f6eb)'

/** Profil-Treppe: steigender Detailgrad von MINIMUM bis EXTENDED, PDF bleibt gleich. */
export function ProfileLadderFigure() {
  const { t } = useI18n()
  const id = useId()
  const baseline = 190
  const stepW = 76
  const gap = 12

  return (
    <svg className="figure" viewBox="0 0 360 240" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.profiles.title')}</title>
      <line x1="10" y1={baseline} x2="350" y2={baseline} stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      {STEPS.map((s, i) => {
        const x = 20 + i * (stepW + gap)
        const y = baseline - s.h
        const isLast = i === STEPS.length - 1
        return (
          <g key={s.key}>
            <rect x={x} y={y} width={stepW} height={s.h} rx="6" fill={isLast ? BRAND : DIM} />
            <text x={x + stepW / 2} y={y - 8} fontSize="12" fontWeight="700" textAnchor="middle" fill="currentColor">
              {t(s.key)}
            </text>
          </g>
        )
      })}
      <text x="20" y="222" fontSize="12" fill="currentColor" fillOpacity="0.75">
        {t('figure.profiles.caption')}
      </text>
    </svg>
  )
}
