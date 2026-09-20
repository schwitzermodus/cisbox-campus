import { useEffect, useMemo, useRef, useState } from 'react'
import { hashFor, navigate } from '../app/router'
import type { CourseRoute } from '../app/router'
import { ResultCard } from '../components/ResultCard'
import { segmentById } from '../content/registry'
import type { Course } from '../content/types'
import { ratingTier } from '../core/rating'
import { scoreQuiz } from '../core/scoring'
import { useI18n } from '../i18n/t'
import type { MessageKey } from '../i18n/t'
import { answerState, describeAnswer } from '../result/describe'
import { renderResultCard } from '../result/renderCard'
import type { CardData } from '../result/renderCard'
import { recordAttempt, updateHistory } from '../state/localHistory'
import type { ThemePreference } from '../state/localHistory'
import { clearFinished, readFinished } from '../state/resultStore'
import type { FinishedQuiz } from '../state/resultStore'
import { resolveTheme } from '../state/theme'

const LOGO = import.meta.env.BASE_URL + 'logo/cisbox-o.svg'

type Props = { route: CourseRoute; course: Course; themePref: ThemePreference }

export function ResultScreen({ route, course, themePref }: Props) {
  const i18n = useI18n()
  const { t, lt, num, duration, date } = i18n
  const [finished] = useState<FinishedQuiz | null>(() => readFinished(course.id))
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [canShare, setCanShare] = useState(false)
  const recorded = useRef(false)

  useEffect(() => {
    if (!finished) navigate({ locale: route.locale, screen: 'overview', courseId: course.id })
  }, [finished, route.locale, course.id])

  const result = useMemo(() => (finished ? scoreQuiz(finished.questions, finished.answers) : null), [finished])

  const card: CardData | null = useMemo(() => {
    if (!finished || !result) return null
    const segment = segmentById(course.segment)
    return {
      score: result.score,
      maxScore: result.maxScore,
      percent: result.percent,
      durationMs: finished.submittedAt - finished.startedAt,
      at: finished.submittedAt,
      tier: ratingTier(result.percent),
      segment: segment ? lt(segment.title) : course.segment,
      courseTitle: lt(course.title),
    }
  }, [finished, result, course, lt])

  // Versuch genau einmal in den lokalen Verlauf schreiben (Schluessel: submittedAt)
  useEffect(() => {
    if (!finished || !result || recorded.current) return
    recorded.current = true
    updateHistory((h) =>
      h.attempts.some((a) => a.at === finished.submittedAt)
        ? h
        : recordAttempt(h, {
            at: finished.submittedAt,
            courseId: course.id,
            difficulty: course.difficulty,
            score: result.score,
            maxScore: result.maxScore,
            percent: result.percent,
            durationMs: finished.submittedAt - finished.startedAt,
          }),
    )
  }, [finished, result, course.id, course.difficulty])

  // Ergebnisbild rendern (Locale- oder Theme-Wechsel rendert neu)
  useEffect(() => {
    if (!card) return
    let url: string | null = null
    let cancelled = false
    renderResultCard(card, resolveTheme(themePref), i18n, LOGO)
      .then((b) => {
        if (cancelled) return
        url = URL.createObjectURL(b)
        setBlob(b)
        setImgUrl(url)
        const file = new File([b], t('result.fileName'), { type: 'image/png' })
        setCanShare(typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] }))
      })
      .catch(() => setImgUrl(null))
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [card, themePref, i18n, t])

  if (!finished || !result || !card) return null

  const share = async () => {
    if (!blob) return
    const file = new File([blob], t('result.fileName'), { type: 'image/png' })
    try {
      await navigator.share({ files: [file], title: t('app.title') })
    } catch {
      /* abgebrochen */
    }
  }

  const retry = () => {
    clearFinished()
    navigate({ locale: route.locale, screen: 'quiz', courseId: course.id })
  }

  return (
    <div className="stack">
      <section className="card result-hero stack-sm">
        <div className="kicker">{t('result.title')}</div>
        <div className="score-big" aria-label={t('result.points', { score: num(result.score), max: num(result.maxScore) })}>
          {num(result.score)}
        </div>
        <div className="score-of">{t('result.points', { score: num(result.score), max: num(result.maxScore) })}</div>
        <h1 style={{ fontSize: '1.25rem' }}>{t(('rating.' + card.tier) as MessageKey)}</h1>
        <dl className="stats" style={{ textAlign: 'left' }}>
          <div>
            <dt>{t('result.percentLabel')}</dt>
            <dd>{num(result.percent)} %</dd>
          </div>
          <div>
            <dt>{t('result.duration')}</dt>
            <dd>{duration(card.durationMs)}</dd>
          </div>
          <div>
            <dt>{t('result.date')}</dt>
            <dd>{date(card.at)}</dd>
          </div>
          <div>
            <dt>{t('course.label')}</dt>
            <dd>{t('card.topicLine', { segment: card.segment, course: card.courseTitle })}</dd>
          </div>
        </dl>
        <p className="notice" style={{ textAlign: 'left', marginTop: 12 }}>
          {t('result.privacyNote')} <a href={hashFor({ locale: route.locale, screen: 'privacy' })}>{t('result.privacyLink')}</a>
        </p>
      </section>

      <section className="stack-sm" aria-labelledby="card-h">
        <h2 id="card-h">{t('result.card')}</h2>
        {imgUrl ? (
          <img
            className="card-preview"
            src={imgUrl}
            alt={t('result.imageAlt', { score: num(result.score), max: num(result.maxScore), percent: num(result.percent) })}
          />
        ) : (
          <div className="card-preview" aria-hidden="true">
            <ResultCard data={card} />
          </div>
        )}
        <div className="btn-stack">
          <a className="btn btn-primary" href={imgUrl ?? '#'} download={t('result.fileName')} aria-disabled={!imgUrl}>
            {t('result.save')}
          </a>
          {canShare ? (
            <button type="button" className="btn btn-secondary" onClick={share}>
              {t('result.share')}
            </button>
          ) : null}
        </div>
        <p className="muted small">{t('result.longPressHint')}</p>
      </section>

      <section className="stack-sm" aria-labelledby="bd-h">
        <h2 id="bd-h">{t('result.breakdown')}</h2>
        <p className="muted">{t('result.breakdownIntro')}</p>
        <ol className="breakdown">
          {finished.questions.map((q, i) => {
            const r = result.breakdown[i]!
            const state = answerState(r.points, r.maxPoints)
            const d = describeAnswer(q, finished.answers[q.id], i18n)
            const stateLabel =
              state === 'correct' ? t('result.stateCorrect') : state === 'partial' ? t('result.statePartial') : t('result.stateWrong')
            const icon = state === 'correct' ? '✓' : state === 'partial' ? '◐' : '✕'
            return (
              <li key={q.id} className="bd-item">
                <div className="bd-head">
                  <div className="bd-q">
                    {num(i + 1)}. {lt(q.prompt)}
                  </div>
                  <span className="bd-state" data-state={state}>
                    <span aria-hidden="true">{icon}</span> {stateLabel} · {t('result.pointsShort', { points: num(r.points), max: num(r.maxPoints) })}
                  </span>
                </div>
                <dl className="bd-kv">
                  <dt>{t('result.yourAnswer')}</dt>
                  <dd>{d.yours.length === 1 ? d.yours[0] : <ul>{d.yours.map((s, k) => <li key={k}>{s}</li>)}</ul>}</dd>
                  <dt>{t('result.correctAnswer')}</dt>
                  <dd>{d.correct.length === 1 ? d.correct[0] : <ul>{d.correct.map((s, k) => <li key={k}>{s}</li>)}</ul>}</dd>
                </dl>
                <p className="bd-expl">{lt(q.explanation)}</p>
              </li>
            )
          })}
        </ol>
      </section>

      <div className="btn-stack">
        <button type="button" className="btn btn-primary" onClick={retry}>
          {t('result.retry')}
        </button>
        <a className="btn btn-secondary" href={hashFor({ locale: route.locale, screen: 'learn', courseId: course.id })}>
          {t('result.toLearn')}
        </a>
        <a className="btn btn-tertiary" href={hashFor({ locale: route.locale, screen: 'overview', courseId: course.id })}>
          {t('course.backToOverview')}
        </a>
      </div>
    </div>
  )
}
