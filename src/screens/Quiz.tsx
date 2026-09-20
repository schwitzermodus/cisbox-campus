import { useEffect, useRef, useState } from 'react'
import { hashFor, navigate } from '../app/router'
import type { CourseRoute } from '../app/router'
import { QuestionNav } from '../components/QuestionNav'
import { MatchingQuestionView } from '../components/questions/Matching'
import { MultiQuestion } from '../components/questions/Multi'
import { SingleQuestion } from '../components/questions/Single'
import { SliderQuestionView } from '../components/questions/Slider'
import { courseById } from '../content/registry'
import type { Course } from '../content/types'
import { drawQuestions } from '../core/draw'
import type { Answer } from '../core/types'
import { useI18n } from '../i18n/t'
import {
  clearSession,
  isAnswered,
  peekSession,
  readSession,
  unansweredCount,
  withAnswer,
  writeSession,
} from '../state/quizSession'
import type { QuizSession } from '../state/quizSession'
import { clearFinished, writeFinished } from '../state/resultStore'

function newSession(course: Course): QuizSession {
  return {
    courseId: course.id,
    quizVersion: course.quizVersion,
    startedAt: Date.now(),
    questions: drawQuestions(course.questions),
    answers: {},
    index: 0,
  }
}

type QuizState = { session: QuizSession | null; conflict: QuizSession | null }

/**
 * Session fuer diesen Kurs? Weiter damit. Session fuer einen ANDEREN Kurs? Nicht still
 * verwerfen, sondern zur Entscheidung vorlegen (siehe Konflikt-Ansicht unten).
 * Sonst: neue Session anlegen.
 */
function initQuizState(course: Course): QuizState {
  const existing = readSession(course.id)
  if (existing) return { session: existing, conflict: null }
  const foreign = peekSession()
  if (foreign && foreign.courseId !== course.id) return { session: null, conflict: foreign }
  clearFinished()
  const s = newSession(course)
  writeSession(s)
  return { session: s, conflict: null }
}

export function QuizScreen({ route, course }: { route: CourseRoute; course: Course }) {
  const { t, lt, num } = useI18n()
  const [state, setState] = useState<QuizState>(() => initQuizState(course))
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const discardForeign = () => {
    clearSession()
    clearFinished()
    const s = newSession(course)
    writeSession(s)
    setState({ session: s, conflict: null })
  }

  useEffect(() => {
    headingRef.current?.focus()
  }, [state.session?.index])

  if (state.conflict) {
    const foreignCourse = courseById(state.conflict.courseId)
    const foreignTitle = foreignCourse ? lt(foreignCourse.title) : state.conflict.courseId
    return (
      <div className="card stack" role="alertdialog" aria-labelledby="conflict-h">
        <h1 id="conflict-h">{t('quiz.conflictTitle')}</h1>
        <p>
          {t('quiz.conflictBody', {
            course: foreignTitle,
            n: num(state.conflict.index + 1),
            total: num(state.conflict.questions.length),
          })}
        </p>
        <div className="btn-stack">
          <a
            className="btn btn-primary"
            href={hashFor({ locale: route.locale, screen: 'quiz', courseId: state.conflict.courseId })}
          >
            {t('quiz.conflictResume')}
          </a>
          <button type="button" className="btn btn-secondary" onClick={discardForeign}>
            {t('quiz.conflictDiscard')}
          </button>
        </div>
      </div>
    )
  }

  const session = state.session!

  const update = (next: QuizSession) => {
    setState({ session: next, conflict: null })
    writeSession(next)
  }

  const total = session.questions.length
  const q = session.questions[session.index]!
  const answer = session.answers[q.id]
  const open = unansweredCount(session)

  const go = (idx: number) => update({ ...session, index: Math.min(total - 1, Math.max(0, idx)) })
  const onAnswer = (a: Answer | undefined) => update(withAnswer(session, q.id, a))

  const submit = () => {
    const submittedAt = Date.now()
    writeFinished({
      courseId: course.id,
      quizVersion: session.quizVersion,
      startedAt: session.startedAt,
      submittedAt,
      questions: session.questions,
      answers: session.answers,
    })
    clearSession()
    dialogRef.current?.close()
    navigate({ locale: route.locale, screen: 'result', courseId: course.id })
  }

  let view
  switch (q.type) {
    case 'single':
      view = <SingleQuestion question={q} answer={answer} onChange={onAnswer} />
      break
    case 'multi':
      view = <MultiQuestion question={q} answer={answer} onChange={onAnswer} />
      break
    case 'slider':
      view = <SliderQuestionView question={q} answer={answer} onChange={onAnswer} />
      break
    case 'matching':
      view = <MatchingQuestionView question={q} answer={answer} onChange={onAnswer} />
      break
  }

  const isLast = session.index === total - 1

  return (
    <div className="stack">
      <h1 ref={headingRef} tabIndex={-1} className="vh">
        {t('quiz.title')}: {t('quiz.progress', { n: num(session.index + 1), total: num(total) })}
      </h1>
      <QuestionNav
        total={total}
        index={session.index}
        answered={session.questions.map((qq) => isAnswered(session.answers[qq.id]))}
        onJump={go}
      />
      <section className="card" key={q.id}>
        {view}
      </section>
      <div className="quiz-nav">
        <button type="button" className="btn btn-secondary" onClick={() => go(session.index - 1)} disabled={session.index === 0}>
          {t('quiz.prev')}
        </button>
        {isLast ? (
          <button type="button" className="btn btn-primary" onClick={() => dialogRef.current?.showModal()}>
            {t('quiz.submit')}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => go(session.index + 1)}>
            {t('quiz.next')}
          </button>
        )}
      </div>

      <dialog ref={dialogRef} className="dialog" aria-labelledby="confirm-h">
        <h2 id="confirm-h">{t('quiz.confirmTitle')}</h2>
        <p>
          {open === 0
            ? t('quiz.confirmAll')
            : open === 1
              ? t('quiz.confirmUnansweredOne')
              : t('quiz.confirmUnanswered', { n: num(open) })}
        </p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={() => dialogRef.current?.close()}>
            {t('quiz.confirmNo')}
          </button>
          <button type="button" className="btn btn-primary" onClick={submit}>
            {t('quiz.confirmYes')}
          </button>
        </div>
      </dialog>
      <p className="vh">{lt(q.prompt)}</p>
    </div>
  )
}
