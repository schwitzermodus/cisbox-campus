import { useEffect, useState } from 'react'
import { hashFor } from '../app/router'
import type { CourseRoute } from '../app/router'
import { courseById, segmentById } from '../content/registry'
import type { Course } from '../content/types'
import { isPass } from '../core/rating'
import { useI18n } from '../i18n/t'
import { bestAttemptFor, lastAttemptFor, progressOf, readHistory } from '../state/localHistory'
import type { LocalHistory } from '../state/localHistory'
import { readSession } from '../state/quizSession'

export function CourseOverviewScreen({ route, course }: { route: CourseRoute; course: Course }) {
  const { t, lt, num, date, isoDate } = useI18n()
  const [history, setHistory] = useState<LocalHistory | null>(null)
  const [resumable, setResumable] = useState(false)

  useEffect(() => {
    setHistory(readHistory())
    setResumable(readSession(course.id) !== null)
  }, [course.id])

  const segment = segmentById(course.segment)
  const prereq = course.recommendedAfter ? courseById(course.recommendedAfter) : undefined
  const prereqPassed = history && course.recommendedAfter ? isPass(progressOf(history, course.recommendedAfter).bestPercent ?? -1) : true

  const last = history ? lastAttemptFor(history, course.id) : undefined
  const best = history ? bestAttemptFor(history, course.id) : undefined
  const learnDone = history ? (progressOf(history, course.id).learnDone ?? false) : false

  const to = (screen: 'learn' | 'quiz') => hashFor({ locale: route.locale, screen, courseId: course.id })

  return (
    <div className="stack">
      <section className="card hero-card stack">
        <div>
          <div className="kicker">{segment ? lt(segment.title) : course.segment} · {course.id}</div>
          <h1>{lt(course.title)}</h1>
          <p>{lt(course.intro)}</p>
        </div>
        <div className="btn-stack">
          {resumable ? (
            <a className="btn btn-primary btn-two-line" href={to('quiz')}>
              {t('start.resume')}
              <span className="btn-hint">{t('start.resumeHint')}</span>
            </a>
          ) : null}
          <a className={'btn btn-two-line ' + (resumable ? 'btn-secondary' : 'btn-primary')} href={to('learn')}>
            {t('course.startLearn')}
            <span className="btn-hint">{t('course.learnHint', { n: num(course.cards.length) })}</span>
          </a>
          {!resumable ? (
            <a className="btn btn-secondary btn-two-line" href={to('quiz')}>
              {t('course.startQuiz')}
              <span className="btn-hint">{t('course.quizHint')}</span>
            </a>
          ) : null}
        </div>
        {learnDone ? <p className="small" style={{ marginBottom: 0 }}>{t('course.learnDone')}</p> : null}
      </section>

      {prereq && !prereqPassed ? (
        <p className="notice">{t('course.recommendedAfter', { id: prereq.id, course: lt(prereq.title) })}</p>
      ) : null}

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
                  {isPass(best.percent) ? ' · ' + t('course.testPassed') : ''}
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="muted small" style={{ marginBottom: 0 }}>
            {date(last.at)}
          </p>
        </section>
      ) : null}

      <p className="asof">{t('common.asOf', { date: isoDate(course.contentAsOf) })}</p>
    </div>
  )
}
