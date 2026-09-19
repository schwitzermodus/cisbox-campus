import { useId } from 'react'
import { useI18n } from '../../../i18n/t'

/** Zeitschiene Deutschland 2025 bis 2028. */
export function TimelineFigure() {
  const { t } = useI18n()
  const id = useId()
  const points: { year: string; x: number; key: 'figure.timeline.2025' | 'figure.timeline.2027' | 'figure.timeline.2028' }[] = [
    { year: '2025', x: 80, key: 'figure.timeline.2025' },
    { year: '2027', x: 360, key: 'figure.timeline.2027' },
    { year: '2028', x: 560, key: 'figure.timeline.2028' },
  ]
  return (
    <svg className="figure" viewBox="0 0 640 220" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.timeline.title')}</title>
      <path d="M40 70H600" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 70H560" stroke="var(--ds-background-element-brand-primary, #215b33)" strokeWidth="3" />
      <text x="220" y="52" fontSize="12" textAnchor="middle" fill="currentColor" fillOpacity="0.7">2026</text>
      {points.map((p, i) => (
        <g key={p.year}>
          <circle cx={p.x} cy="70" r="11" fill="var(--ds-background-element-brand-primary, #215b33)" />
          <circle cx={p.x} cy="70" r="4" fill="#ffffff" />
          <text x={p.x} y="110" fontSize="18" fontWeight="700" textAnchor="middle" fill="currentColor">
            {p.year}
          </text>
          <foreignObject x={p.x - (i === 0 ? 70 : 90)} y="120" width={i === 0 ? 140 : 180} height="90">
            <div
              // @ts-expect-error xmlns ist im HTML-Namespace des foreignObject noetig
              xmlns="http://www.w3.org/1999/xhtml"
              className="fig-label"
            >
              {t(p.key)}
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  )
}
