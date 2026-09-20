import { useId } from 'react'
import { useNarrow } from '../../../../app/useNarrow'
import { useI18n } from '../../../../i18n/t'

const WARN = 'var(--ds-text-status-warning-primary, #9e6c00)'
const BRAND = 'var(--cc-brand-text, #1a8242)'

/** Prozessvergleich: Papier/PDF mit manueller Erfassung gegen strukturierte E-Rechnung. */
export function ProcessFigure() {
  const { t } = useI18n()
  const id = useId()
  const narrow = useNarrow()

  if (narrow) {
    // Hochformat: die beiden Wege untereinander, damit die Beschriftung gross bleibt.
    return (
      <svg className="figure" viewBox="0 0 360 400" role="img" aria-labelledby={id}>
        <title id={id}>{t('figure.process.title')}</title>
        {/* oben: Papier/PDF */}
        <text x="0" y="20" fontSize="19" fontWeight="600" fill="currentColor">
          {t('figure.process.left')}
        </text>
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 36h44l14 14v52H4z" />
          <path d="M48 36v14h14" />
          <path d="M14 62h38M14 76h38M14 90h24" strokeOpacity="0.5" />
        </g>
        <g stroke={WARN} strokeWidth="2" fill="none" strokeDasharray="5 4">
          <path d="M80 76h30M130 76h30M180 76h30" />
        </g>
        <g fill={WARN}>
          <circle cx="120" cy="76" r="8" />
          <circle cx="170" cy="76" r="8" />
          <circle cx="220" cy="76" r="8" />
        </g>
        <rect x="244" y="60" width="112" height="32" rx="4" fill="var(--ds-background-element-dim-yellow-secondary, #fffab8)" />
        <text x="300" y="81" fontSize="16" fontWeight="600" textAnchor="middle" fill={WARN}>
          {t('figure.process.manual')}
        </text>
        <text x="4" y="128" fontSize="15" fill="currentColor" fillOpacity="0.8">
          {t('figure.process.leftSteps')}
        </text>

        <path d="M4 158h352" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

        {/* unten: E-Rechnung */}
        <text x="0" y="196" fontSize="19" fontWeight="600" fill="currentColor">
          {t('figure.process.right')}
        </text>
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="212" width="76" height="66" rx="6" />
        </g>
        <text x="42" y="252" fontSize="20" fontWeight="700" textAnchor="middle" fill={BRAND}>
          {'</>'}
        </text>
        <g fill="none" stroke={BRAND} strokeWidth="3">
          <path d="M92 245h130" />
          <path d="M214 237l10 8-10 8" />
        </g>
        <rect x="244" y="229" width="112" height="32" rx="4" fill="var(--ds-background-element-dim-green-secondary, #e6f6eb)" />
        <text x="300" y="250" fontSize="16" fontWeight="600" textAnchor="middle" fill={BRAND}>
          {t('figure.process.auto')}
        </text>
        <text x="4" y="304" fontSize="15" fill="currentColor" fillOpacity="0.8">
          {t('figure.process.rightSteps')}
        </text>
      </svg>
    )
  }

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
      <g fill="none" stroke={WARN} strokeWidth="2" strokeDasharray="5 4">
        <path d="M120 100h40M180 100h40M240 100h40" />
      </g>
      <g fill={WARN}>
        <circle cx="160" cy="100" r="9" />
        <circle cx="220" cy="100" r="9" />
        <circle cx="280" cy="100" r="9" />
      </g>
      <text x="20" y="182" fontSize="16" fill="currentColor" fillOpacity="0.8">{t('figure.process.leftSteps')}</text>
      <rect x="20" y="196" width="132" height="28" rx="4" fill="var(--ds-background-element-dim-yellow-secondary, #fffab8)" />
      <text x="86" y="215" fontSize="15" fontWeight="600" textAnchor="middle" fill={WARN}>
        {t('figure.process.manual')}
      </text>

      {/* Trenner */}
      <path d="M320 40v190" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

      {/* rechts: XML-Datensatz */}
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="340" y="50" width="90" height="100" rx="6" />
      </g>
      <text x="385" y="110" fontSize="20" fontWeight="700" textAnchor="middle" fill={BRAND}>
        {'</>'}
      </text>
      <g fill="none" stroke={BRAND} strokeWidth="3">
        <path d="M430 100h180" />
        <path d="M600 92l12 8-12 8" />
      </g>
      <text x="340" y="182" fontSize="16" fill="currentColor" fillOpacity="0.8">{t('figure.process.rightSteps')}</text>
      <rect x="340" y="196" width="132" height="28" rx="4" fill="var(--ds-background-element-dim-green-secondary, #e6f6eb)" />
      <text x="406" y="215" fontSize="15" fontWeight="600" textAnchor="middle" fill={BRAND}>
        {t('figure.process.auto')}
      </text>
    </svg>
  )
}
