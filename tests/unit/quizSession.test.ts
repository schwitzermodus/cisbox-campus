import { beforeEach, describe, expect, it } from 'vitest'
import { courseById } from '../../src/content/registry'
import { SESSION_KEY, isChecked, peekSession, readSession, withAnswer, withChecked, writeSession } from '../../src/state/quizSession'
import type { QuizSession } from '../../src/state/quizSession'
import { installMemoryStorage } from './helpers/memoryStorage'

const course = courseById('201')!

function session(over: Partial<QuizSession> = {}): QuizSession {
  return {
    courseId: '201',
    quizVersion: course.quizVersion,
    startedAt: Date.now(),
    questions: course.questions.slice(0, 10),
    answers: {},
    index: 0,
    checked: [],
    ...over,
  }
}

beforeEach(() => {
  installMemoryStorage()
})

describe('readSession', () => {
  it('liefert die Session fuer den passenden Kurs', () => {
    writeSession(session())
    expect(readSession('201')?.courseId).toBe('201')
  })
  it('liefert nichts fuer einen fremden Kurs', () => {
    writeSession(session({ courseId: '101' }))
    expect(readSession('201')).toBeNull()
  })
  it('verwirft eine Session mit veralteter quizVersion', () => {
    writeSession(session({ quizVersion: 'irgendwas-altes' }))
    expect(readSession('201')).toBeNull()
  })
  it('verwirft einen index ausserhalb des Fragensets', () => {
    writeSession(session({ index: 99 }))
    expect(readSession('201')).toBeNull()
  })
  it('verwirft ein negatives index', () => {
    writeSession(session({ index: -1 }))
    expect(readSession('201')).toBeNull()
  })
  it('nichts vorhanden -> null', () => {
    expect(readSession('201')).toBeNull()
  })
})

describe('peekSession', () => {
  it('sieht auch die Session eines anderen Kurses (Grundlage fuer den Konflikt-Dialog)', () => {
    writeSession(session({ courseId: '101' }))
    expect(peekSession()?.courseId).toBe('101')
    expect(readSession('201')).toBeNull()
  })
})

describe('checked (Sofort-Feedback)', () => {
  const qid = (i: number) => course.questions[i]!.id

  it('Roundtrip: geprueft-Liste bleibt nach Schreiben und Lesen erhalten', () => {
    writeSession(session({ checked: [qid(0), qid(2)] }))
    expect(readSession('201')?.checked).toEqual([qid(0), qid(2)])
  })
  it('alte Session ohne checked bleibt lesbar, checked ist leer', () => {
    const legacy: Record<string, unknown> = { ...session() }
    delete legacy.checked
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(legacy))
    expect(readSession('201')?.checked).toEqual([])
    expect(peekSession()?.checked).toEqual([])
  })
  it('kaputtes checked (kein Array) wird zu leerer Liste', () => {
    for (const bad of ['x', 5, null, { a: 1 }]) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...session(), checked: bad }))
      expect(readSession('201')?.checked).toEqual([])
    }
  })
  it('Nicht-Strings in checked werden entfernt, Strings bleiben', () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...session(), checked: [qid(1), 7, null, {}, qid(3)] }))
    expect(readSession('201')?.checked).toEqual([qid(1), qid(3)])
  })
  it('withChecked fuegt hinzu, ist idempotent und veraendert die Eingabe nicht', () => {
    const s = session()
    const a = withChecked(s, qid(0))
    expect(a.checked).toEqual([qid(0)])
    expect(s.checked).toEqual([])
    expect(withChecked(a, qid(0))).toBe(a)
    expect(withChecked(a, qid(1)).checked).toEqual([qid(0), qid(1)])
  })
  it('isChecked unterscheidet geprueft und ungeprueft', () => {
    const s = withChecked(session(), qid(4))
    expect(isChecked(s, qid(4))).toBe(true)
    expect(isChecked(s, qid(5))).toBe(false)
  })
  it('withAnswer laesst checked unberuehrt', () => {
    const s = withChecked(session(), qid(0))
    expect(withAnswer(s, qid(0), { type: 'single', optionId: 'x' }).checked).toEqual([qid(0)])
  })
})
