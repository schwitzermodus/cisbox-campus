import { beforeEach, describe, expect, it } from 'vitest'
import { courseById } from '../../src/content/registry'
import { peekSession, readSession, writeSession } from '../../src/state/quizSession'
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
