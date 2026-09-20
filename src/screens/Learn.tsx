import { useEffect, useState } from 'react'
import { hashFor } from '../app/router'
import type { CourseRoute } from '../app/router'
import { Progress } from '../components/Progress'
import type { Course } from '../content/types'
import { useI18n } from '../i18n/t'
import { markLearnDone, updateHistory } from '../state/localHistory'

export function LearnScreen({ route, course }: { route: CourseRoute; course: Course }) {
  const { t, lt, num } = useI18n()
  const [i, setI] = useState(0)
  const cards = course.cards
  const card = cards[i] ?? cards[0]!
  const total = cards.length
  const isLast = i === total - 1
  const Figure = card.figure ? course.figures[card.figure] : undefined

  useEffect(() => {
    if (isLast) updateHistory((h) => markLearnDone(h, course.id))
  }, [isLast, course.id])

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
        {Figure ? (
          <div className="learn-figure">
            <Figure />
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
          <a className="btn btn-primary" href={hashFor({ locale: route.locale, screen: 'quiz', courseId: course.id })}>
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
          <a href={hashFor({ locale: route.locale, screen: 'quiz', courseId: course.id })}>{t('learn.skip')}</a>
        </p>
      ) : null}
    </div>
  )
}
