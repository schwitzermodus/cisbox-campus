import { hashFor } from '../app/router'
import type { ActiveLocale } from '../core/types'
import { isPass } from '../core/rating'
import { useI18n } from '../i18n/t'
import type { CourseProgress } from '../state/localHistory'
import type { Course, CourseId } from '../content/types'

type Props = {
  locale: ActiveLocale
  course: Course
  progress: CourseProgress
  /**
   * Nur ein Hinweistext, keine Sperre: dieser Kurs wird nach diesem anderen Kurs empfohlen.
   * Braucht die ID zusaetzlich zum Titel, weil mehrere Kurse "Grundlagen" heissen koennen.
   */
  recommendedAfter?: { id: CourseId; title: string }
  /** Dezente Markierung "als Naechstes empfohlen" fuer genau einen Kurs auf der Uebersicht. */
  isNextRecommended?: boolean
}

function CheckIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" className="check-icon">
      <circle cx="10" cy="10" r="9" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 10.2l2.6 2.6L14 7.4"
        fill="none"
        stroke={filled ? 'var(--cc-surface-card)' : 'currentColor'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CourseCard({ locale, course, progress, recommendedAfter, isNextRecommended }: Props) {
  const { t, lt, num } = useI18n()
  const learnDone = progress.learnDone === true
  const passed = isPass(progress.bestPercent ?? -1)

  return (
    <a className="course-card" href={hashFor({ locale, screen: 'overview', courseId: course.id })}>
      <div className="course-card-head">
        <span className="course-card-id">{course.id}</span>
        <div>
          <div className="course-card-title">{lt(course.title)}</div>
          <div className="course-card-subtitle">{lt(course.subtitle)}</div>
        </div>
      </div>
      <ul className="course-card-status">
        <li data-done={learnDone ? 'true' : 'false'}>
          <CheckIcon filled={learnDone} /> {t('course.learnDone')}
        </li>
        <li data-done={passed ? 'true' : 'false'}>
          <CheckIcon filled={passed} /> {t('course.testPassed')}
        </li>
      </ul>
      {progress.bestPercent !== undefined ? (
        <p className="course-card-best">{t('course.best', { percent: num(progress.bestPercent) })}</p>
      ) : null}
      {isNextRecommended ? <p className="course-card-hint course-card-hint-next">{t('course.recommendedNext')}</p> : null}
      {recommendedAfter ? (
        <p className="course-card-hint">{t('course.recommendedAfter', { id: recommendedAfter.id, course: recommendedAfter.title })}</p>
      ) : null}
    </a>
  )
}
