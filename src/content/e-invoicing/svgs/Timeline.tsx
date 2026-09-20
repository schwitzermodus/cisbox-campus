import { useId } from 'react'
import { useNarrow } from '../../../app/useNarrow'
import { useI18n } from '../../../i18n/t'
import type { MessageKey } from '../../../i18n/t'

const BRAND = 'var(--ds-background-element-brand-primary, #215b33)'

type Point = { year: string; key: MessageKey }
const POINTS: Point[] = [
  { year: '2025', key: 'figure.timeline.2025' },
  { year: '2027', key: 'figure.timeline.2027' },
  { year: '2028', key: 'figure.timeline.2028' },
]

/** Bricht einen Text nach Wortgrenzen in Zeilen (SVG kann das nicht von selbst). */
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

/** Zeitschiene Deutschland 2025 bis 2028. */
export function TimelineFigure() {
  const { t } = useI18n()
  const id = useId()
  const narrow = useNarrow()

  if (narrow) {
    // Hochformat: senkrechte Achse, Jahr links, Text rechts daneben.
    const rowY = (i: number) => 40 + i * 92
    return (
      <svg className="figure" viewBox="0 0 360 272" role="img" aria-labelledby={id}>
        <title id={id}>{t('figure.timeline.title')}</title>
        <path d="M74 18v232" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
        <path d={`M74 ${rowY(0)}v${rowY(2) - rowY(0)}`} stroke={BRAND} strokeWidth="3" />
        {POINTS.map((p, i) => {
          const y = rowY(i)
          const lines = wrap(t(p.key), 26)
          return (
            <g key={p.year}>
              <circle cx="74" cy={y} r="11" fill={BRAND} />
              <circle cx="74" cy={y} r="4" fill="#ffffff" />
              <text x="58" y={y + 7} fontSize="20" fontWeight="700" textAnchor="end" fill="currentColor">
                {p.year}
              </text>
              <text x="98" y={y + 1} fontSize="16" fill="currentColor" fillOpacity="0.9">
                {lines.map((line, k) => (
                  <tspan key={k} x="98" dy={k === 0 ? 0 : 20}>
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

  const x = (i: number) => [80, 360, 560][i] ?? 80
  return (
    <svg className="figure" viewBox="0 0 640 230" role="img" aria-labelledby={id}>
      <title id={id}>{t('figure.timeline.title')}</title>
      <path d="M40 70H600" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 70H560" stroke={BRAND} strokeWidth="3" />
      <text x="220" y="52" fontSize="15" textAnchor="middle" fill="currentColor" fillOpacity="0.7">
        2026
      </text>
      {POINTS.map((p, i) => {
        const cx = x(i)
        const lines = wrap(t(p.key), 22)
        return (
          <g key={p.year}>
            <circle cx={cx} cy="70" r="11" fill={BRAND} />
            <circle cx={cx} cy="70" r="4" fill="#ffffff" />
            <text x={cx} y="112" fontSize="22" fontWeight="700" textAnchor="middle" fill="currentColor">
              {p.year}
            </text>
            <text x={cx} y="140" fontSize="16" textAnchor="middle" fill="currentColor" fillOpacity="0.9">
              {lines.map((line, k) => (
                <tspan key={k} x={cx} dy={k === 0 ? 0 : 21}>
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
