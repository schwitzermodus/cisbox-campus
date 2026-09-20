import { isCourseId } from '../content/registry'
import type { CourseId } from '../content/types'
import { LOCALES } from '../core/types'
import type { Difficulty, Locale } from '../core/types'

/**
 * v1 wird weiterhin gelesen (nie mehr geschrieben, nie geloescht), damit ein Rollback auf einen
 * alten Build oder ein gecachter alter Client die Daten eines Nutzers nicht verliert.
 */
export const HISTORY_KEY_V1 = 'cisbox-campus.v1'
export const HISTORY_KEY = 'cisbox-campus.v2'
export const MAX_ATTEMPTS = 20

export type ThemePreference = 'light' | 'dark' | 'system'

export type Attempt = {
  /** Unix ms */
  at: number
  courseId: CourseId
  difficulty: Difficulty
  score: number
  maxScore: number
  percent: number
  durationMs: number
}

/** Verdichteter Dauerzustand je Kurs. Bleibt erhalten, auch wenn attempts[] gekappt wird. */
export type CourseProgress = {
  learnDone?: boolean
  learnDoneAt?: number
  /** 0..100, monoton steigend */
  bestPercent?: number
  bestScore?: number
  bestMaxScore?: number
  bestAt?: number
  attemptCount?: number
}

export type LocalHistory = {
  version: 2
  /** globaler Ringpuffer ueber alle Kurse, max. MAX_ATTEMPTS, chronologisch */
  attempts: Attempt[]
  progress: Partial<Record<CourseId, CourseProgress>>
  preferredLocale?: Locale
  theme?: ThemePreference
}

export const EMPTY_HISTORY: LocalHistory = { version: 2, attempts: [], progress: {} }

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

/** Locker genug fuer zukuenftige/entfernte Kurs-IDs, streng genug gegen Muell. */
const COURSE_ID_SHAPE = /^[a-z0-9][a-z0-9-]{0,15}$/i

type AttemptVerdict = 'ok' | 'unknown-course' | 'invalid'

function checkAttempt(v: unknown): AttemptVerdict {
  if (typeof v !== 'object' || v === null) return 'invalid'
  const o = v as Record<string, unknown>
  const structurallyOk =
    isFiniteNumber(o.at) &&
    typeof o.courseId === 'string' &&
    COURSE_ID_SHAPE.test(o.courseId) &&
    (o.difficulty === 'basic' || o.difficulty === 'intermediate' || o.difficulty === 'advanced') &&
    isFiniteNumber(o.score) &&
    isFiniteNumber(o.maxScore) &&
    isFiniteNumber(o.percent) &&
    isFiniteNumber(o.durationMs) &&
    o.score >= 0 &&
    o.maxScore > 0 &&
    o.score <= o.maxScore &&
    o.percent >= 0 &&
    o.percent <= 100 &&
    o.durationMs >= 0
  if (!structurallyOk) return 'invalid'
  return isCourseId(o.courseId) ? 'ok' : 'unknown-course'
}

function checkProgress(v: unknown): 'ok' | 'invalid' {
  if (typeof v !== 'object' || v === null) return 'invalid'
  const o = v as Record<string, unknown>
  const keys = Object.keys(o)
  const allowed = ['learnDone', 'learnDoneAt', 'bestPercent', 'bestScore', 'bestMaxScore', 'bestAt', 'attemptCount']
  if (keys.some((k) => !allowed.includes(k))) return 'invalid'
  if (o.learnDone !== undefined && typeof o.learnDone !== 'boolean') return 'invalid'
  if (o.learnDoneAt !== undefined && !isFiniteNumber(o.learnDoneAt)) return 'invalid'
  if (o.bestPercent !== undefined && (!isFiniteNumber(o.bestPercent) || o.bestPercent < 0 || o.bestPercent > 100)) return 'invalid'
  if (o.bestScore !== undefined && !isFiniteNumber(o.bestScore)) return 'invalid'
  if (o.bestMaxScore !== undefined && !isFiniteNumber(o.bestMaxScore)) return 'invalid'
  if (o.bestAt !== undefined && !isFiniteNumber(o.bestAt)) return 'invalid'
  if (o.attemptCount !== undefined && (!isFiniteNumber(o.attemptCount) || o.attemptCount < 0)) return 'invalid'
  return 'ok'
}

/**
 * v2-Schema aus rohem JSON aufbauen.
 * - ein strukturell ungueltiger Versuch/Fortschrittseintrag verwirft ALLES (Schutz gegen Manipulation).
 * - ein Versuch/Fortschritt mit wohlgeformter, aber unbekannter Kurs-ID wird NUR selbst uebersprungen
 *   (Vorwaerts-/Rueckwaertskompatibilitaet, kein Anlass zum Verwerfen).
 */
function parseV2(o: Record<string, unknown>): LocalHistory | null {
  if (!Array.isArray(o.attempts)) return null
  const attempts: Attempt[] = []
  for (const raw of o.attempts) {
    const verdict = checkAttempt(raw)
    if (verdict === 'invalid') return null
    if (verdict === 'ok') attempts.push(raw as Attempt)
  }

  const progress: Partial<Record<CourseId, CourseProgress>> = {}
  if (o.progress !== undefined) {
    if (typeof o.progress !== 'object' || o.progress === null) return null
    for (const [id, raw] of Object.entries(o.progress as Record<string, unknown>)) {
      if (checkProgress(raw) === 'invalid') return null
      if (isCourseId(id)) progress[id] = raw as CourseProgress
      // unbekannte Kurs-ID im Fortschritt: still ueberspringen
    }
  }

  const out: LocalHistory = { version: 2, attempts: attempts.slice(-MAX_ATTEMPTS), progress }
  if (typeof o.preferredLocale === 'string' && (LOCALES as readonly string[]).includes(o.preferredLocale)) {
    out.preferredLocale = o.preferredLocale as Locale
  }
  if (o.theme === 'light' || o.theme === 'dark' || o.theme === 'system') out.theme = o.theme
  return out
}

// ---------- Migration v1 -> v2 ----------

type V1Attempt = {
  at: number
  topic: 'e-invoicing'
  difficulty: Difficulty
  score: number
  maxScore: number
  percent: number
  durationMs: number
}
type V1History = {
  version: 1
  attempts: V1Attempt[]
  preferredLocale?: Locale
  theme?: ThemePreference
  learnCardsSeen?: boolean
}

/** Der einzige Kurs, den es gab, bevor es Kurse gab. */
export const LEGACY_COURSE_ID: CourseId = '201'

function isV1Attempt(v: unknown): v is V1Attempt {
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

function parseV1(o: Record<string, unknown>): V1History | null {
  if (!Array.isArray(o.attempts) || !o.attempts.every(isV1Attempt)) return null
  const out: V1History = { version: 1, attempts: o.attempts }
  if (typeof o.preferredLocale === 'string' && (LOCALES as readonly string[]).includes(o.preferredLocale)) {
    out.preferredLocale = o.preferredLocale as Locale
  }
  if (o.theme === 'light' || o.theme === 'dark' || o.theme === 'system') out.theme = o.theme
  if (typeof o.learnCardsSeen === 'boolean') out.learnCardsSeen = o.learnCardsSeen
  return out
}

/** Rein, ohne Zeitbezug: fuer denselben Input immer derselbe Output (Idempotenz-Grundlage). */
export function migrateV1(v1: V1History): LocalHistory {
  const attempts: Attempt[] = v1.attempts.map((a) => ({
    at: a.at,
    courseId: LEGACY_COURSE_ID,
    difficulty: a.difficulty,
    score: a.score,
    maxScore: a.maxScore,
    percent: a.percent,
    durationMs: a.durationMs,
  }))
  const out: LocalHistory = { version: 2, attempts, progress: {} }
  if (v1.preferredLocale) out.preferredLocale = v1.preferredLocale
  if (v1.theme) out.theme = v1.theme

  const progress: CourseProgress = {}
  if (v1.learnCardsSeen === true) progress.learnDone = true
  let best: V1Attempt | undefined
  for (const a of v1.attempts) if (!best || a.percent > best.percent) best = a
  if (best) {
    progress.bestPercent = best.percent
    progress.bestScore = best.score
    progress.bestMaxScore = best.maxScore
    progress.bestAt = best.at
  }
  if (v1.attempts.length > 0) progress.attemptCount = v1.attempts.length
  if (Object.keys(progress).length > 0) out.progress[LEGACY_COURSE_ID] = progress
  return out
}

/**
 * Schema-Pruefung fuer beliebiges JSON, v1 wird transparent nach v2 migriert.
 * Unbekannte Version (weder 1 noch 2) wird verworfen, nicht interpretiert.
 */
export function parseHistory(raw: string | null): LocalHistory {
  if (!raw) return EMPTY_HISTORY
  try {
    const v: unknown = JSON.parse(raw)
    if (typeof v !== 'object' || v === null) return EMPTY_HISTORY
    const o = v as Record<string, unknown>
    if (o.version === 1) {
      const v1 = parseV1(o)
      return v1 ? migrateV1(v1) : EMPTY_HISTORY
    }
    if (o.version === 2) return parseV2(o) ?? EMPTY_HISTORY
    return EMPTY_HISTORY
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

/**
 * Liest v2, wenn vorhanden. Sonst wird ein vorhandener v1-Verlauf einmalig migriert und
 * unter dem neuen Key gespeichert (idempotent: ab dann greift immer der v2-Zweig).
 * Der v1-Eintrag bleibt unangetastet stehen (Rollback-Sicherheit).
 */
export function readHistory(): LocalHistory {
  const s = storage()
  if (!s) return EMPTY_HISTORY
  try {
    const own = s.getItem(HISTORY_KEY)
    if (own !== null) return parseHistory(own)
    const legacy = parseHistory(s.getItem(HISTORY_KEY_V1))
    const legacyIsEmpty =
      legacy.attempts.length === 0 && Object.keys(legacy.progress).length === 0 && !legacy.theme && !legacy.preferredLocale
    if (legacyIsEmpty) return EMPTY_HISTORY
    writeHistory(legacy)
    return legacy
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

/** Haengt einen Versuch an, aeltester fliegt raus. Fuer den globalen Verlauf ohne Fortschritts-Update. */
export function appendAttempt(h: LocalHistory, a: Attempt): LocalHistory {
  const attempts = [...h.attempts, a].slice(-MAX_ATTEMPTS)
  return { ...h, attempts }
}

/** Versuch anhaengen UND den verdichteten Kursfortschritt aktualisieren (bestPercent bleibt monoton). */
export function recordAttempt(h: LocalHistory, a: Attempt): LocalHistory {
  const withLog = appendAttempt(h, a)
  const prev = h.progress[a.courseId] ?? {}
  const better = (prev.bestPercent ?? -1) < a.percent
  const next: CourseProgress = {
    ...prev,
    attemptCount: (prev.attemptCount ?? 0) + 1,
    ...(better ? { bestPercent: a.percent, bestScore: a.score, bestMaxScore: a.maxScore, bestAt: a.at } : {}),
  }
  return { ...withLog, progress: { ...h.progress, [a.courseId]: next } }
}

export function markLearnDone(h: LocalHistory, id: CourseId, at: number = Date.now()): LocalHistory {
  const prev = h.progress[id] ?? {}
  if (prev.learnDone) return h
  return { ...h, progress: { ...h.progress, [id]: { ...prev, learnDone: true, learnDoneAt: at } } }
}

export function progressOf(h: LocalHistory, id: CourseId): CourseProgress {
  return h.progress[id] ?? {}
}

export function clearHistory(): void {
  const s = storage()
  if (!s) return
  try {
    s.removeItem(HISTORY_KEY)
    s.removeItem(HISTORY_KEY_V1)
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

export function lastAttemptFor(h: LocalHistory, id: CourseId): Attempt | undefined {
  for (let i = h.attempts.length - 1; i >= 0; i--) {
    const a = h.attempts[i]
    if (a?.courseId === id) return a
  }
  return undefined
}

export function bestAttemptFor(h: LocalHistory, id: CourseId): Attempt | undefined {
  let best: Attempt | undefined
  for (const a of h.attempts) {
    if (a.courseId === id && (!best || a.percent > best.percent)) best = a
  }
  return best
}
