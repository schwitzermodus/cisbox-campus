import type { Question, QuestionType } from './types'

/**
 * Erzwungener Typ-Mix pro Test. Die Typen werden anschliessend verwoben (siehe interleave),
 * damit nicht mehrere gleiche Fragetypen hintereinander stehen.
 */
export const DRAW_MIX: Record<QuestionType, number> = { single: 4, multi: 3, slider: 2, matching: 1 }
export const DRAW_TYPES: readonly QuestionType[] = ['single', 'multi', 'slider', 'matching']
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
 * Verwebt die gezogenen Fragen: Round-Robin ueber die Typ-Gruppen.
 *
 * Die groesste Gruppe steht bewusst fest an erster Stelle jeder Runde. Nur so ist garantiert,
 * dass ihre Fragen nie direkt aufeinander folgen, wenn die kleineren Gruppen schon leer sind.
 * Die uebrigen Gruppen werden zufaellig rotiert, das variiert die Abfolge von Test zu Test.
 * Nebeneffekt: Position 1 ist immer der haeufigste Typ (Single Choice) — ein ruhiger Einstieg,
 * und die grosse Zuordnungsfrage steht nie ganz vorn.
 */
export function interleave(questions: readonly Question[], rng: Rng = cryptoRng): Question[] {
  const groups = DRAW_TYPES.map((type) => questions.filter((q) => q.type === type)).filter((g) => g.length > 0)
  if (groups.length <= 1) return questions.slice()
  // Grosse Gruppen zuerst, damit sie sich gleichmaessig verteilen
  groups.sort((a, b) => b.length - a.length)
  const [biggest, ...rest] = groups
  const offset = rest.length > 1 ? Math.floor(rng() * rest.length) : 0
  const queues = [biggest as Question[], ...rest.slice(offset), ...rest.slice(0, offset)].map((g) => g.slice())

  const result: Question[] = []
  let remaining = questions.length
  while (remaining > 0) {
    for (const queue of queues) {
      const next = queue.shift()
      if (next) {
        result.push(next)
        remaining--
      }
    }
  }
  return result
}

/**
 * Zieht das Fragen-Set: pro Typ Shuffle innerhalb der Typ-Gruppe, dann DRAW_MIX Stueck,
 * Optionen gemischt, am Ende die Typen verwoben.
 */
export function drawQuestions(pool: readonly Question[], rng: Rng = cryptoRng): Question[] {
  const drawn: Question[] = []
  for (const type of DRAW_TYPES) {
    const group = pool.filter((q) => q.type === type)
    const want = DRAW_MIX[type]
    if (group.length < want) {
      throw new Error('Fragenpool: zu wenige Fragen vom Typ ' + type + ' (' + group.length + ' < ' + want + ')')
    }
    drawn.push(...shuffle(group, rng).slice(0, want).map((q) => shuffleOptions(q, rng)))
  }
  return interleave(drawn, rng)
}
