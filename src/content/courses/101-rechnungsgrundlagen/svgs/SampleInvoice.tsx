import { useId } from 'react'
import { useI18n } from '../../../../i18n/t'
import type { MessageKey } from '../../../../i18n/t'

const LINE = 'var(--ds-border-neutral-tertiary, #bbb)'
const BRAND = 'var(--cc-brand-text, #215b33)'
const CALLOUT_BG = 'var(--ds-background-element-dim-green-secondary, #e6f6eb)'

/** Beschriftete Musterrechnung mit den Pflichtangaben als Callouts. */
export function SampleInvoiceFigure() {
  const { t } = useI18n()
  const id = useId()

  const callout = (x: number, y: number, w: number, labelKey: MessageKey, align: 'left' | 'right' = 'left') => (
    <g key={labelKey}>
      <rect x={x} y={y} width={w} height="26" rx="5" fill={CALLOUT_BG} />
      <text
        x={align === 'left' ? x + 8 : x + w - 8}
        y={y + 17}
        fontSize="12"
        fontWeight="600"
        textAnchor={align === 'left' ? 'start' : 'end'}
        fill={BRAND}
      >
        {t(labelKey)}
      </text>
    </g>
  )

  return (
    <svg className="figure" viewBox="0 0 360 400" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.sample.title')}</title>
      <rect x="4" y="4" width="352" height="392" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />

      {/* Kopf: Steller / Empfaenger */}
      <text x="20" y="34" fontSize="13" fontWeight="700" fill="currentColor">
        {t('figure.sample.issuer')}
      </text>
      <line x1="20" y1="44" x2="150" y2="44" stroke={LINE} strokeWidth="1.5" />
      <text x="200" y="34" fontSize="13" fontWeight="700" fill="currentColor" textAnchor="end">
        {t('figure.sample.recipient')}
      </text>
      <line x1="200" y1="44" x2="340" y2="44" stroke={LINE} strokeWidth="1.5" />

      {/* Rechnungsnummer + Datum */}
      {callout(20, 60, 150, 'figure.sample.number')}
      {callout(190, 60, 150, 'figure.sample.date', 'right')}

      {/* Leistungsbeschreibung */}
      <rect x="20" y="106" width="320" height="90" rx="6" fill="none" stroke={LINE} strokeWidth="1.5" />
      <text x="34" y="128" fontSize="12" fill="currentColor" fillOpacity="0.8">
        {t('figure.sample.itemsHead')}
      </text>
      <line x1="34" y1="150" x2="326" y2="150" stroke={LINE} strokeOpacity="0.6" />
      <line x1="34" y1="172" x2="326" y2="172" stroke={LINE} strokeOpacity="0.6" />
      {callout(20, 210, 320, 'figure.sample.service')}

      {/* Steuersatz + Betrag */}
      {callout(20, 254, 150, 'figure.sample.taxRate')}
      {callout(190, 254, 150, 'figure.sample.taxAmount', 'right')}

      {/* Summenzeile */}
      <rect x="20" y="300" width="320" height="40" rx="6" fill="var(--ds-background-element-brand-primary, #215b33)" />
      <text x="34" y="325" fontSize="14" fontWeight="700" fill="#ffffff">
        {t('figure.sample.total')}
      </text>
      <text x="326" y="325" fontSize="14" fontWeight="700" fill="#ffffff" textAnchor="end">
        1.190,00 €
      </text>

      <text x="20" y="368" fontSize="12" fill="currentColor" fillOpacity="0.7">
        {t('figure.sample.smallAmount')}
      </text>
    </svg>
  )
}
