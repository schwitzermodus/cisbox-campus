import { useEffect, useState } from 'react'
import { hashFor } from '../app/router'
import type { GlobalRoute } from '../app/router'
import { CourseCard } from '../components/CourseCard'
import { COURSES, coursesOfSegment, courseById, SEGMENTS } from '../content/registry'
import { isPass } from '../core/rating'
import { useI18n } from '../i18n/t'
import { progressOf, readHistory } from '../state/localHistory'
import type { LocalHistory } from '../state/localHistory'
import { peekSession } from '../state/quizSession'
import type { QuizSession } from '../state/quizSession'

export function CoursesScreen({ route }: { route: GlobalRoute }) {
  const { t, lt } = useI18n()
  // localStorage/sessionStorage erst nach dem Mount lesen (kein Zugriff waehrend des ersten Renders)
  const [history, setHistory] = useState<LocalHistory | null>(null)
  const [session, setSession] = useState<QuizSession | null>(null)

  useEffect(() => {
    setHistory(readHistory())
    setSession(peekSession())
  }, [])

  // Naechster empfohlener Kurs: erster Kurs in Segment- und Kursreihenfolge, dessen Test noch nicht bestanden ist.
  const nextRecommended = history
    ? COURSES.slice()
        .sort((a, b) => a.segment.localeCompare(b.segment) || a.order - b.order)
        .find((c) => !isPass(progressOf(history, c.id).bestPercent ?? -1))?.id
    : undefined

  const sessionCourse = session ? courseById(session.courseId) : undefined

  return (
    <div className="stack">
      <section className="card hero-card stack">
        <div>
          <div className="kicker">{t('overview.kicker')}</div>
          <h1>{t('overview.title')}</h1>
          <p>{t('overview.intro')}</p>
        </div>
        <p className="small" style={{ marginBottom: 0 }}>
          {t('quiz.noTimer')}
        </p>
      </section>

      {session && sessionCourse ? (
        <a className="notice notice-link" href={hashFor({ locale: route.locale, screen: 'quiz', courseId: session.courseId })}>
          {t('course.resumeBanner', { course: lt(sessionCourse.title) })}
        </a>
      ) : null}

      {SEGMENTS.slice()
        .sort((a, b) => a.order - b.order)
        .map((segment) => {
          const courses = coursesOfSegment(segment.id)
          if (courses.length === 0) return null
          return (
            <section key={segment.id} className="stack-sm" aria-labelledby={'segment-' + segment.id}>
              <div>
                <h2 id={'segment-' + segment.id}>{lt(segment.title)}</h2>
                <p className="muted small">{lt(segment.intro)}</p>
              </div>
              <div className="course-grid">
                {courses.map((course) => {
                  const prereq = course.recommendedAfter ? courseById(course.recommendedAfter) : undefined
                  const prereqPassed = history && course.recommendedAfter ? isPass(progressOf(history, course.recommendedAfter).bestPercent ?? -1) : true
                  return (
                    <CourseCard
                      key={course.id}
                      locale={route.locale}
                      course={course}
                      progress={history ? progressOf(history, course.id) : {}}
                      isNextRecommended={nextRecommended === course.id}
                      recommendedAfter={prereq && !prereqPassed ? { id: prereq.id, title: lt(prereq.title) } : undefined}
                    />
                  )
                })}
              </div>
            </section>
          )
        })}
    </div>
  )
}
