import { useId } from 'react'
import { useI18n } from '../../../i18n/t'

/** Prozessvergleich: Papier/PDF mit manueller Erfassung gegen strukturierte E-Rechnung. */
export function ProcessFigure() {
  const { t } = useI18n()
  const id = useId()
  return (
    <svg className="figure" viewBox="0 0 640 260" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.process.title')}</title>
      <g fontSize="19" fontWeight="600" fill="currentColor">
        <text x="20" y="28">{t('figure.process.left')}</text>
        <text x="340" y="28">{t('figure.process.right')}</text>
      </g>
      {/* links: Dokument */}
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 50h70l20 20v80H20z" />
        <path d="M90 50v20h20" />
        <path d="M34 90h62M34 106h62M34 122h40" strokeOpacity="0.5" />
      </g>
      {/* manuelle Kette */}
      <g fill="none" stroke="var(--ds-text-status-warning-primary, #9e6c00)" strokeWidth="2" strokeDasharray="5 4">
        <path d="M120 100h40M180 100h40M240 100h40" />
      </g>
      <g fill="var(--ds-text-status-warning-primary, #9e6c00)">
        <circle cx="160" cy="100" r="9" />
        <circle cx="220" cy="100" r="9" />
        <circle cx="280" cy="100" r="9" />
      </g>
      <text x="20" y="182" fontSize="16" fill="currentColor" fillOpacity="0.75">{t('figure.process.leftSteps')}</text>
      <rect x="20" y="196" width="132" height="28" rx="4" fill="var(--ds-background-element-dim-yellow-secondary, #fffab8)" />
      <text x="86" y="215" fontSize="15" fontWeight="600" textAnchor="middle" fill="var(--ds-text-status-warning-primary, #9e6c00)">
        {t('figure.process.manual')}
      </text>

      {/* Trenner */}
      <path d="M320 40v190" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

      {/* rechts: XML-Datensatz */}
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="340" y="50" width="90" height="100" rx="6" />
      </g>
      <text x="385" y="110" fontSize="20" fontWeight="700" textAnchor="middle" fill="var(--ds-text-brand-secondary, #1a8242)">
        {'</>'}
      </text>
      <g fill="none" stroke="var(--ds-text-brand-secondary, #1a8242)" strokeWidth="3">
        <path d="M430 100h180" />
        <path d="M600 92l12 8-12 8" />
      </g>
      <text x="340" y="182" fontSize="16" fill="currentColor" fillOpacity="0.75">{t('figure.process.rightSteps')}</text>
      <rect x="340" y="196" width="132" height="28" rx="4" fill="var(--ds-background-element-dim-green-secondary, #e6f6eb)" />
      <text x="406" y="215" fontSize="15" fontWeight="600" textAnchor="middle" fill="var(--ds-text-status-success-primary, #218358)">
        {t('figure.process.auto')}
      </text>
    </svg>
  )
}
