import { useEffect, useState } from 'react'
import { hashFor } from '../app/router'
import { CONTENT_AS_OF } from '../content/e-invoicing/meta'
import type { Route } from '../app/router'
import { useI18n } from '../i18n/t'
import { bestAttempt, lastAttempt, readHistory } from '../state/localHistory'
import type { Attempt } from '../state/localHistory'
import { readSession } from '../state/quizSession'

export function StartScreen({ route }: { route: Route }) {
  const { t, num, date, isoDate } = useI18n()
  // localStorage erst nach dem Mount lesen (kein Zugriff waehrend des ersten Renders)
  const [last, setLast] = useState<Attempt | undefined>()
  const [best, setBest] = useState<Attempt | undefined>()
  const [count, setCount] = useState(0)
  const [resumable, setResumable] = useState(false)

  useEffect(() => {
    const h = readHistory()
    setLast(lastAttempt(h))
    setBest(bestAttempt(h))
    setCount(h.attempts.length)
    setResumable(readSession() !== null)
  }, [])

  const to = (screen: Route['screen']) => hashFor({ locale: route.locale, screen })

  return (
    <div className="stack">
      <section className="card hero-card stack">
        <div>
          <div className="kicker">{t('start.kicker')}</div>
          <h1>{t('start.title')}</h1>
          <p>{t('start.intro')}</p>
        </div>
        <div className="btn-stack">
          {resumable ? (
            <a className="btn btn-primary btn-two-line" href={to('quiz')}>
              {t('start.resume')}
              <span className="btn-hint">{t('start.resumeHint')}</span>
            </a>
          ) : null}
          <a className={'btn btn-two-line ' + (resumable ? 'btn-secondary' : 'btn-primary')} href={to('learn')}>
            {t('start.learn')}
            <span className="btn-hint">{t('start.learnHint')}</span>
          </a>
          {!resumable ? (
            <a className="btn btn-secondary btn-two-line" href={to('quiz')}>
              {t('start.quiz')}
              <span className="btn-hint">{t('start.quizHint')}</span>
            </a>
          ) : null}
        </div>
        <p className="small" style={{ marginBottom: 0 }}>
          {t('quiz.noTimer')}
        </p>
      </section>

      {last ? (
        <section className="card stack-sm" aria-labelledby="last-h">
          <h2 id="last-h">{t('start.lastResult')}</h2>
          <dl className="stats">
            <div>
              <dt>{t('start.lastResult')}</dt>
              <dd>
                {t('start.pointsOf', { score: num(last.score), max: num(last.maxScore) })} · {num(last.percent)} %
              </dd>
            </div>
            {best ? (
              <div>
                <dt>{t('start.best')}</dt>
                <dd>
                  {t('start.pointsOf', { score: num(best.score), max: num(best.maxScore) })} · {num(best.percent)} %
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="muted small" style={{ marginBottom: 0 }}>
            {count === 1 ? t('start.attemptsCountOne') : t('start.attemptsCount', { n: num(count) })} · {date(last.at)}
          </p>
        </section>
      ) : null}

      <p className="asof">{t('common.asOf', { date: isoDate(CONTENT_AS_OF) })}</p>
    </div>
  )
}
