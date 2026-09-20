import { useId } from 'react'
import { useI18n } from '../../../../i18n/t'

const BOX_BG = 'var(--cc-surface-inset, #f9f9f9)'
const BRAND = 'var(--cc-brand-text, #215b33)'

/** Dasselbe Feld (Rechnungsbetrag) vereinfacht in UBL- und CII-Struktur gegenuebergestellt. */
export function SyntaxCompareFigure() {
  const { t } = useI18n()
  const id = useId()

  const snippet = (y: number, label: string, lines: string[]) => (
    <g>
      <rect x="10" y={y} width="340" height={26 + lines.length * 22} rx="8" fill={BOX_BG} stroke="currentColor" strokeOpacity="0.15" />
      <text x="24" y={y + 22} fontSize="14" fontWeight="700" fill={BRAND}>
        {label}
      </text>
      {lines.map((line, i) => (
        <text key={i} x="24" y={y + 46 + i * 22} fontSize="13" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fill="currentColor">
          {line}
        </text>
      ))}
    </g>
  )

  return (
    <svg className="figure" viewBox="0 0 360 260" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.syntax.title')}</title>
      {snippet(6, 'UBL', ['<Invoice>', '  <cbc:PayableAmount>', '    1190.00', '  </cbc:PayableAmount>', '</Invoice>'])}
      {snippet(150, 'CII (CrossIndustryInvoice)', ['<ram:GrandTotalAmount>', '  1190.00', '</ram:GrandTotalAmount>'])}
      <text x="10" y="252" fontSize="11" fill="currentColor" fillOpacity="0.65">
        {t('figure.syntax.caption')}
      </text>
    </svg>
  )
}
