import { useId } from 'react'
import { useNarrow } from '../../../../app/useNarrow'
import { useI18n } from '../../../../i18n/t'
import type { MessageKey } from '../../../../i18n/t'

const BRAND = 'var(--ds-background-element-brand-primary, #215b33)'
const STEPS: MessageKey[] = [
  'figure.transmission.paper',
  'figure.transmission.fax',
  'figure.transmission.pdf',
  'figure.transmission.edi',
  'figure.transmission.einvoice',
]

/** Bricht einen Text nach Wortgrenzen in Zeilen. */
function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line)
      line = word
    } else {
      line = line ? line + ' ' + word : word
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Zeitschiene: Uebertragungswege von Papier bis zur E-Rechnung. */
export function TransmissionTimelineFigure() {
  const { t } = useI18n()
  const id = useId()
  const narrow = useNarrow()

  if (narrow) {
    const rowY = (i: number) => 34 + i * 78
    return (
      <svg className="figure" viewBox="0 0 360 420" role="img" aria-labelledby={id}>
        <title id={id}>{t('figure.transmission.title')}</title>
        <path d={`M56 ${rowY(0)}v${rowY(4) - rowY(0)}`} stroke={BRAND} strokeWidth="3" />
        {STEPS.map((key, i) => {
          const y = rowY(i)
          const isLast = i === STEPS.length - 1
          const lines = wrap(t(key), 24)
          return (
            <g key={key}>
              <circle cx="56" cy={y} r={isLast ? 12 : 10} fill={isLast ? BRAND : 'none'} stroke={BRAND} strokeWidth="2.5" />
              <text x="78" y={y + 1} fontSize="15" fontWeight={isLast ? 700 : 500} fill="currentColor">
                {lines.map((line, k) => (
                  <tspan key={k} x="78" dy={k === 0 ? 0 : 19}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  const x = (i: number) => 40 + i * 140
  return (
    <svg className="figure" viewBox="0 0 640 160" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.transmission.title')}</title>
      <path d="M40 60h560" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
      {STEPS.map((key, i) => {
        const cx = x(i)
        const isLast = i === STEPS.length - 1
        const lines = wrap(t(key), 12)
        return (
          <g key={key}>
            <circle cx={cx} cy="60" r={isLast ? 11 : 9} fill={isLast ? BRAND : 'none'} stroke={BRAND} strokeWidth="2.5" />
            <text x={cx} y="98" fontSize="13" fontWeight={isLast ? 700 : 500} textAnchor="middle" fill="currentColor">
              {lines.map((line, k) => (
                <tspan key={k} x={cx} dy={k === 0 ? 0 : 17}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
