import { useId } from 'react'
import { useI18n } from '../../../i18n/t'

const LEAVES = ['XRechnung', 'ZUGFeRD / Factur-X', 'Peppol BIS', 'EHF']

/** Format-Landkarte: EN 16931 als Kern, darunter nationale Ausprägungen. */
export function FormatsFigure() {
  const { t } = useI18n()
  const id = useId()
  return (
    <svg className="figure" viewBox="0 0 640 240" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.formats.title')}</title>
      <rect x="200" y="20" width="240" height="70" rx="10" fill="var(--ds-background-element-brand-primary, #215b33)" />
      <text x="320" y="50" fontSize="20" fontWeight="700" textAnchor="middle" fill="#ffffff">
        {t('figure.formats.core')}
      </text>
      <text x="320" y="74" fontSize="13" textAnchor="middle" fill="#ffffff" fillOpacity="0.85">
        {t('figure.formats.coreSub')}
      </text>
      <g fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2">
        <path d="M320 90v30" />
        <path d="M80 120h480" />
        {LEAVES.map((_, i) => {
          const x = 80 + i * 160
          return <path key={i} d={`M${x} 120v30`} />
        })}
      </g>
      {LEAVES.map((name, i) => {
        const x = 80 + i * 160
        return (
          <g key={name}>
            <rect
              x={x - 72}
              y="150"
              width="144"
              height="56"
              rx="8"
              fill="var(--ds-background-element-dim-green-secondary, #e6f6eb)"
              stroke="var(--ds-border-brand-dim-primary, #c6eac7)"
              strokeWidth="1.5"
            />
            <text x={x} y="184" fontSize="14" fontWeight="600" textAnchor="middle" fill="var(--ds-text-brand-primary, #215b33)">
              {name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
