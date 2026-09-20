import { useId } from 'react'
import { useNarrow } from '../../../../app/useNarrow'
import { useI18n } from '../../../../i18n/t'
import type { MessageKey } from '../../../../i18n/t'

const BRAND = 'var(--ds-background-element-brand-primary, #215b33)'
const STEP_KEYS: MessageKey[] = ['figure.p2p.need', 'figure.p2p.order', 'figure.p2p.goods', 'figure.p2p.invoice', 'figure.p2p.pay']

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

/** Purchase-to-Pay-Kette: Bedarf, Bestellung, Wareneingang, Rechnung, Zahlung. */
export function P2PChainFigure() {
  const { t } = useI18n()
  const id = useId()
  const narrow = useNarrow()

  if (narrow) {
    const rowY = (i: number) => 28 + i * 62
    return (
      <svg className="figure" viewBox="0 0 360 340" role="img" aria-labelledby={id}>
        <title id={id}>{t('figure.p2p.title')}</title>
        <path d={`M30 ${rowY(0)}v${rowY(4) - rowY(0)}`} stroke={BRAND} strokeWidth="3" />
        {STEP_KEYS.map((key, i) => {
          const y = rowY(i)
          return (
            <g key={key}>
              <circle cx="30" cy={y} r="14" fill={BRAND} />
              <text x="30" y={y + 5} fontSize="14" fontWeight="700" textAnchor="middle" fill="#ffffff">
                {i + 1}
              </text>
              <text x="58" y={y + 5} fontSize="15" fontWeight="600" fill="currentColor">
                {t(key)}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  return (
    <svg className="figure" viewBox="0 0 640 150" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.p2p.title')}</title>
      <path d="M60 60h520" stroke={BRAND} strokeWidth="3" />
      {STEP_KEYS.map((key, i) => {
        const cx = 60 + i * 130
        const lines = wrap(t(key), 14)
        return (
          <g key={key}>
            <circle cx={cx} cy="60" r="16" fill={BRAND} />
            <text x={cx} y="65" fontSize="15" fontWeight="700" textAnchor="middle" fill="#ffffff">
              {i + 1}
            </text>
            <text x={cx} y="98" fontSize="13" fontWeight="600" textAnchor="middle" fill="currentColor">
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
