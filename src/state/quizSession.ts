import type { Answer, AnswerMap, Question } from '../core/types'

export const SESSION_KEY = 'cisbox-campus.quiz.v1'

/** Laufender Test. Liegt in sessionStorage, damit ein Reload nichts verliert. */
export type QuizSession = {
  quizVersion: string
  startedAt: number
  questions: Question[]
  answers: AnswerMap
  index: number
}

function storage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return window.sessionStorage
  } catch {
    return null
  }
}

function isSession(v: unknown): v is QuizSession {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return (
    typeof o.quizVersion === 'string' &&
    typeof o.startedAt === 'number' &&
    Array.isArray(o.questions) &&
    o.questions.length > 0 &&
    typeof o.answers === 'object' &&
    o.answers !== null &&
    typeof o.index === 'number'
  )
}

export function readSession(): QuizSession | null {
  const s = storage()
  if (!s) return null
  try {
    const raw = s.getItem(SESSION_KEY)
    if (!raw) return null
    const v: unknown = JSON.parse(raw)
    return isSession(v) ? v : null
  } catch {
    return null
  }
}

export function writeSession(session: QuizSession): void {
  const s = storage()
  if (!s) return
  try {
    s.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* ignorieren */
  }
}

export function clearSession(): void {
  const s = storage()
  if (!s) return
  try {
    s.removeItem(SESSION_KEY)
  } catch {
    /* ignorieren */
  }
}

export function withAnswer(session: QuizSession, id: string, answer: Answer | undefined): QuizSession {
  const answers = { ...session.answers }
  if (answer === undefined) delete answers[id]
  else answers[id] = answer
  return { ...session, answers }
}

export function unansweredCount(session: QuizSession): number {
  return session.questions.filter((q) => !isAnswered(session.answers[q.id])).length
}

export function isAnswered(a: Answer | undefined): boolean {
  if (!a) return false
  switch (a.type) {
    case 'single':
      return a.optionId !== ''
    case 'multi':
      return a.optionIds.length > 0
    case 'slider':
      return Number.isFinite(a.value)
    case 'matching':
      return Object.keys(a.pairs).length > 0
  }
}
