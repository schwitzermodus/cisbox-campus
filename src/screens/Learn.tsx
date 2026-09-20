import { useEffect, useState } from 'react'
import { hashFor } from '../app/router'
import type { Route } from '../app/router'
import { Progress } from '../components/Progress'
import { CARDS } from '../content/e-invoicing/cards'
import { FormatsFigure } from '../content/e-invoicing/svgs/Formats'
import { ProcessFigure } from '../content/e-invoicing/svgs/Process'
import { TimelineFigure } from '../content/e-invoicing/svgs/Timeline'
import { useI18n } from '../i18n/t'
import { updateHistory } from '../state/localHistory'

export function LearnScreen({ route }: { route: Route }) {
  const { t, lt, num } = useI18n()
  const [i, setI] = useState(0)
  const card = CARDS[i] ?? CARDS[0]!
  const total = CARDS.length
  const isLast = i === total - 1

  useEffect(() => {
    if (isLast) updateHistory((h) => (h.learnCardsSeen ? h : { ...h, learnCardsSeen: true }))
  }, [isLast])

  useEffect(() => {
    document.getElementById('learn-title')?.focus()
  }, [i])

  return (
    <div className="stack">
      <Progress value={i + 1} max={total} label={t('learn.progress', { n: num(i + 1), total: num(total) })} />
      <article className="card learn-card" aria-labelledby="learn-title">
        <div className="learn-head">
          <div className="kicker">{t('learn.title')}</div>
          <h1 id="learn-title" tabIndex={-1}>
            {lt(card.title)}
          </h1>
        </div>
        {card.figure ? (
          <div className="learn-figure">
            {card.figure === 'process' ? <ProcessFigure /> : null}
            {card.figure === 'formats' ? <FormatsFigure /> : null}
            {card.figure === 'timeline' ? <TimelineFigure /> : null}
          </div>
        ) : null}
        <div className="learn-text">
          {card.body.map((paragraph, k) => (
            <p className="learn-body" key={k}>
              {lt(paragraph)}
            </p>
          ))}
        </div>
      </article>
      <div className="quiz-nav">
        <button type="button" className="btn btn-secondary" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}>
          {t('learn.prev')}
        </button>
        {isLast ? (
          <a className="btn btn-primary" href={hashFor({ locale: route.locale, screen: 'quiz' })}>
            {t('learn.toQuiz')}
          </a>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setI((x) => Math.min(total - 1, x + 1))}>
            {t('learn.next')}
          </button>
        )}
      </div>
      {!isLast ? (
        <p className="small" style={{ textAlign: 'center' }}>
          <a href={hashFor({ locale: route.locale, screen: 'quiz' })}>{t('learn.skip')}</a>
        </p>
      ) : null}
    </div>
  )
}
