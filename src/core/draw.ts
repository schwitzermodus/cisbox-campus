import type { Question, QuestionType } from './types'

/** Erzwungener Typ-Mix pro Test. Zuordnung kommt immer zuletzt. */
export const DRAW_MIX: Record<QuestionType, number> = { single: 6, multi: 2, slider: 1, matching: 1 }
export const DRAW_ORDER: readonly QuestionType[] = ['single', 'multi', 'slider', 'matching']
export const QUESTIONS_PER_QUIZ = Object.values(DRAW_MIX).reduce((a, b) => a + b, 0)

export type Rng = () => number

export function cryptoRng(): number {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return (buf[0] ?? 0) / 4294967296
}

/** Fisher-Yates, liefert eine Kopie. */
export function shuffle<T>(items: readonly T[], rng: Rng = cryptoRng): T[] {
  const arr = items.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = arr[i] as T
    arr[i] = arr[j] as T
    arr[j] = tmp
  }
  return arr
}

/** Optionen innerhalb einer Frage shuffeln (bei Zuordnung nur die rechte Seite). */
export function shuffleOptions(q: Question, rng: Rng = cryptoRng): Question {
  switch (q.type) {
    case 'single':
    case 'multi':
      return { ...q, options: shuffle(q.options, rng) }
    case 'matching':
      return { ...q, right: shuffle(q.right, rng) }
    case 'slider':
      return q
  }
}

/**
 * Zieht das Fragen-Set: pro Typ Shuffle innerhalb der Typ-Gruppe, dann DRAW_MIX Stueck,
 * in DRAW_ORDER aneinandergehaengt (Single zuerst, Zuordnung zuletzt).
 */
export function drawQuestions(pool: readonly Question[], rng: Rng = cryptoRng): Question[] {
  const result: Question[] = []
  for (const type of DRAW_ORDER) {
    const group = pool.filter((q) => q.type === type)
    const want = DRAW_MIX[type]
    if (group.length < want) {
      throw new Error('Fragenpool: zu wenige Fragen vom Typ ' + type + ' (' + group.length + ' < ' + want + ')')
    }
    result.push(...shuffle(group, rng).slice(0, want).map((q) => shuffleOptions(q, rng)))
  }
  return result
}
