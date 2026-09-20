import { useI18n } from '../i18n/t'

type Props = {
  total: number
  /** 0-basierter Index der aktuellen Frage */
  index: number
  /** je Frage: beantwortet ja/nein, in Reihenfolge des Sets */
  answered: readonly boolean[]
  onJump: (index: number) => void
}

/**
 * Eine Leiste statt zweier Anzeigen: die Segmente zeigen den Fortschritt (wie ein Balken)
 * und erlauben gleichzeitig den Sprung zu einer bestimmten Frage.
 */
export function QuestionNav({ total, index, answered, onJump }: Props) {
  const { t, num } = useI18n()
  const done = answered.filter(Boolean).length

  return (
    <nav className="qnav" aria-label={t('quiz.title')}>
      <p className="qnav-label">
        <b aria-live="polite">{t('quiz.progress', { n: num(index + 1), total: num(total) })}</b>
        <span>{t('quiz.answeredCount', { n: num(done), total: num(total) })}</span>
      </p>
      <ol className="qnav-segs">
        {Array.from({ length: total }, (_, i) => (
          <li key={i}>
            <button
              type="button"
              className="qnav-seg"
              data-answered={answered[i] ? 'true' : 'false'}
              aria-current={i === index ? 'step' : undefined}
              aria-label={
                t('quiz.jumpTo', { n: num(i + 1) }) +
                ', ' +
                (answered[i] ? t('quiz.answeredState') : t('quiz.unansweredState'))
              }
              onClick={() => onJump(i)}
            >
              {num(i + 1)}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
