import { LOCALES } from '../core/types'
import type { Difficulty, Locale, Topic } from '../core/types'

export const HISTORY_KEY = 'cisbox-campus.v1'
export const MAX_ATTEMPTS = 20

export type ThemePreference = 'light' | 'dark' | 'system'

export type Attempt = {
  /** Unix ms */
  at: number
  topic: Topic
  difficulty: Difficulty
  score: number
  maxScore: number
  percent: number
  durationMs: number
}

export type LocalHistory = {
  version: 1
  attempts: Attempt[]
  preferredLocale?: Locale
  theme?: ThemePreference
  learnCardsSeen?: boolean
}

export const EMPTY_HISTORY: LocalHistory = { version: 1, attempts: [] }

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

function isAttempt(v: unknown): v is Attempt {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return (
    isFiniteNumber(o.at) &&
    o.topic === 'e-invoicing' &&
    (o.difficulty === 'basic' || o.difficulty === 'intermediate' || o.difficulty === 'advanced') &&
    isFiniteNumber(o.score) &&
    isFiniteNumber(o.maxScore) &&
    isFiniteNumber(o.percent) &&
    isFiniteNumber(o.durationMs) &&
    o.score >= 0 &&
    o.maxScore > 0 &&
    o.score <= o.maxScore
  )
}

/**
 * Schema-Pruefung. Kaputter oder fremder Inhalt wird als Ganzes verworfen, nicht repariert.
 */
export function parseHistory(raw: string | null): LocalHistory {
  if (!raw) return EMPTY_HISTORY
  try {
    const v: unknown = JSON.parse(raw)
    if (typeof v !== 'object' || v === null) return EMPTY_HISTORY
    const o = v as Record<string, unknown>
    if (o.version !== 1 || !Array.isArray(o.attempts)) return EMPTY_HISTORY
    if (!o.attempts.every(isAttempt)) return EMPTY_HISTORY
    const out: LocalHistory = { version: 1, attempts: o.attempts.slice(-MAX_ATTEMPTS) }
    if (typeof o.preferredLocale === 'string' && (LOCALES as readonly string[]).includes(o.preferredLocale)) {
      out.preferredLocale = o.preferredLocale as Locale
    }
    if (o.theme === 'light' || o.theme === 'dark' || o.theme === 'system') out.theme = o.theme
    if (typeof o.learnCardsSeen === 'boolean') out.learnCardsSeen = o.learnCardsSeen
    return out
  } catch {
    return EMPTY_HISTORY
  }
}

function storage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage
  } catch {
    return null
  }
}

export function readHistory(): LocalHistory {
  const s = storage()
  if (!s) return EMPTY_HISTORY
  try {
    return parseHistory(s.getItem(HISTORY_KEY))
  } catch {
    return EMPTY_HISTORY
  }
}

export function writeHistory(h: LocalHistory): void {
  const s = storage()
  if (!s) return
  try {
    s.setItem(HISTORY_KEY, JSON.stringify(h))
  } catch {
    /* Quota oder privater Modus: still ignorieren */
  }
}

export function updateHistory(fn: (h: LocalHistory) => LocalHistory): LocalHistory {
  const next = fn(readHistory())
  writeHistory(next)
  return next
}

/** Haengt einen Versuch an, aeltester fliegt raus. */
export function appendAttempt(h: LocalHistory, a: Attempt): LocalHistory {
  const attempts = [...h.attempts, a].slice(-MAX_ATTEMPTS)
  return { ...h, attempts }
}

export function clearHistory(): void {
  const s = storage()
  if (!s) return
  try {
    s.removeItem(HISTORY_KEY)
  } catch {
    /* ignorieren */
  }
}

export function lastAttempt(h: LocalHistory): Attempt | undefined {
  return h.attempts[h.attempts.length - 1]
}

export function bestAttempt(h: LocalHistory): Attempt | undefined {
  let best: Attempt | undefined
  for (const a of h.attempts) {
    if (!best || a.percent > best.percent) best = a
  }
  return best
}
