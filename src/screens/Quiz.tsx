import { useEffect, useRef, useState } from 'react'
import { navigate } from '../app/router'
import type { Route } from '../app/router'
import { QuestionNav } from '../components/QuestionNav'
import { MatchingQuestionView } from '../components/questions/Matching'
import { MultiQuestion } from '../components/questions/Multi'
import { SingleQuestion } from '../components/questions/Single'
import { SliderQuestionView } from '../components/questions/Slider'
import { QUIZ_VERSION } from '../content/e-invoicing/meta'
import { QUESTIONS } from '../content/e-invoicing/questions'
import { drawQuestions } from '../core/draw'
import type { Answer } from '../core/types'
import { useI18n } from '../i18n/t'
import { clearSession, isAnswered, readSession, unansweredCount, withAnswer, writeSession } from '../state/quizSession'
import type { QuizSession } from '../state/quizSession'
import { clearFinished, writeFinished } from '../state/resultStore'

function newSession(): QuizSession {
  return { quizVersion: QUIZ_VERSION, startedAt: Date.now(), questions: drawQuestions(QUESTIONS), answers: {}, index: 0 }
}

export function QuizScreen({ route }: { route: Route }) {
  const { t, lt, num } = useI18n()
  const [session, setSession] = useState<QuizSession>(() => {
    const existing = readSession()
    if (existing) return existing
    clearFinished()
    const s = newSession()
    writeSession(s)
    return s
  })
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const update = (next: QuizSession) => {
    setSession(next)
    writeSession(next)
  }

  const total = session.questions.length
  const q = session.questions[session.index]!
  const answer = session.answers[q.id]
  const open = unansweredCount(session)

  useEffect(() => {
    headingRef.current?.focus()
  }, [session.index])

  const go = (idx: number) => update({ ...session, index: Math.min(total - 1, Math.max(0, idx)) })
  const onAnswer = (a: Answer | undefined) => update(withAnswer(session, q.id, a))

  const submit = () => {
    const submittedAt = Date.now()
    writeFinished({
      quizVersion: session.quizVersion,
      startedAt: session.startedAt,
      submittedAt,
      questions: session.questions,
      answers: session.answers,
    })
    clearSession()
    dialogRef.current?.close()
    navigate({ locale: route.locale, screen: 'result' })
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
