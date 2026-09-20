import { courseById, isCourseId } from '../content/registry'
import type { CourseId } from '../content/types'
import type { AnswerMap, Question } from '../core/types'

export const RESULT_KEY = 'cisbox-campus.result.v2'

/** Abgegebener Test: eingefrorenes Set + Antworten. Ueberlebt einen Reload der Ergebnisseite. */
export type FinishedQuiz = {
  courseId: CourseId
  quizVersion: string
  startedAt: number
  submittedAt: number
  questions: Question[]
  answers: AnswerMap
}

function storage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return window.sessionStorage
  } catch {
    return null
  }
}

function isFinished(v: unknown): v is FinishedQuiz {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return (
    isCourseId(o.courseId) &&
    typeof o.quizVersion === 'string' &&
    typeof o.startedAt === 'number' &&
    typeof o.submittedAt === 'number' &&
    Array.isArray(o.questions) &&
    o.questions.length > 0 &&
    typeof o.answers === 'object' &&
    o.answers !== null
  )
}

/** Ergebnis nur, wenn es zu genau diesem Kurs und der aktuellen Inhaltsversion gehoert. */
export function readFinished(courseId: CourseId): FinishedQuiz | null {
  const s = storage()
  if (!s) return null
  try {
    const raw = s.getItem(RESULT_KEY)
    if (!raw) return null
    const v: unknown = JSON.parse(raw)
    if (!isFinished(v) || v.courseId !== courseId) return null
    const course = courseById(courseId)
    if (!course || v.quizVersion !== course.quizVersion) return null
    return v
  } catch {
    return null
  }
}

export function writeFinished(f: FinishedQuiz): void {
  const s = storage()
  if (!s) return
  try {
    s.setItem(RESULT_KEY, JSON.stringify(f))
  } catch {
    /* ignorieren */
  }
}

export function clearFinished(): void {
  const s = storage()
  if (!s) return
  try {
    s.removeItem(RESULT_KEY)
  } catch {
    /* ignorieren */
  }
}
