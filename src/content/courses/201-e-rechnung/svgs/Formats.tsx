import { useId } from 'react'
import { useNarrow } from '../../../../app/useNarrow'
import { useI18n } from '../../../../i18n/t'

const LEAVES = ['XRechnung', 'ZUGFeRD/Factur-X', 'Peppol BIS', 'EHF']
const LEAF_BG = 'var(--ds-background-element-dim-green-secondary, #e6f6eb)'
const LEAF_BORDER = 'var(--ds-border-brand-secondary, #1a8242)'
const LEAF_TEXT = 'var(--cc-brand-text, #215b33)'

/** Format-Landkarte: EN 16931 als Kern, darunter nationale Ausprägungen. */
export function FormatsFigure() {
  const { t } = useI18n()
  const id = useId()
  const narrow = useNarrow()

  if (narrow) {
    // Hochformat: Kern oben, darunter ein 2x2-Gitter statt vier Kacheln nebeneinander.
    const cell = (i: number) => ({ x: i % 2 === 0 ? 4 : 186, y: i < 2 ? 140 : 210 })
    return (
      <svg className="figure" viewBox="0 0 360 290" role="img" aria-labelledby={id}>
        <title id={id}>{t('figure.formats.title')}</title>
        <rect x="46" y="6" width="268" height="74" rx="10" fill="var(--ds-background-element-brand-primary, #215b33)" />
        <text x="180" y="40" fontSize="26" fontWeight="700" textAnchor="middle" fill="#ffffff">
          {t('figure.formats.core')}
        </text>
        <text x="180" y="66" fontSize="15" textAnchor="middle" fill="#ffffff" fillOpacity="0.9">
          {t('figure.formats.coreSub')}
        </text>
        <g fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2">
          <path d="M180 80v26" />
          <path d="M90 106h180" />
          <path d="M90 106v34M270 106v34" />
          <path d="M90 176v34M270 176v34" />
        </g>
        {LEAVES.map((name, i) => {
          const { x, y } = cell(i)
          return (
            <g key={name}>
              <rect x={x} y={y} width="170" height="56" rx="8" fill={LEAF_BG} stroke={LEAF_BORDER} strokeWidth="1.5" />
              <text x={x + 85} y={y + 34} fontSize="16" fontWeight="600" textAnchor="middle" fill={LEAF_TEXT}>
                {name}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  return (
    <svg className="figure" viewBox="0 0 640 240" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.formats.title')}</title>
      <rect x="200" y="20" width="240" height="70" rx="10" fill="var(--ds-background-element-brand-primary, #215b33)" />
      <text x="320" y="52" fontSize="24" fontWeight="700" textAnchor="middle" fill="#ffffff">
        {t('figure.formats.core')}
      </text>
      <text x="320" y="76" fontSize="15" textAnchor="middle" fill="#ffffff" fillOpacity="0.9">
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
            <rect x={x - 76} y="150" width="152" height="56" rx="8" fill={LEAF_BG} stroke={LEAF_BORDER} strokeWidth="1.5" />
            <text x={x} y="185" fontSize="16" fontWeight="600" textAnchor="middle" fill={LEAF_TEXT}>
              {name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
