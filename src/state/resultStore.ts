import type { AnswerMap, Question } from '../core/types'

export const RESULT_KEY = 'cisbox-campus.result.v1'

/** Abgegebener Test: eingefrorenes Set + Antworten. Ueberlebt einen Reload der Ergebnisseite. */
export type FinishedQuiz = {
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

export function readFinished(): FinishedQuiz | null {
  const s = storage()
  if (!s) return null
  try {
    const raw = s.getItem(RESULT_KEY)
    if (!raw) return null
    const v: unknown = JSON.parse(raw)
    if (typeof v !== 'object' || v === null) return null
    const o = v as Record<string, unknown>
    if (typeof o.startedAt !== 'number' || typeof o.submittedAt !== 'number' || !Array.isArray(o.questions)) return null
    if (typeof o.answers !== 'object' || o.answers === null || typeof o.quizVersion !== 'string') return null
    return v as FinishedQuiz
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
