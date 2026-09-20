import { beforeEach, describe, expect, it } from 'vitest'
import { courseById } from '../../src/content/registry'
import { readFinished, writeFinished } from '../../src/state/resultStore'
import type { FinishedQuiz } from '../../src/state/resultStore'
import { installMemoryStorage } from './helpers/memoryStorage'

const course = courseById('201')!

function finished(over: Partial<FinishedQuiz> = {}): FinishedQuiz {
  return {
    courseId: '201',
    quizVersion: course.quizVersion,
    startedAt: Date.now() - 1000,
    submittedAt: Date.now(),
    questions: course.questions.slice(0, 10),
    answers: {},
    ...over,
  }
}

beforeEach(() => {
  installMemoryStorage()
})

describe('readFinished', () => {
  it('liefert das Ergebnis fuer den passenden Kurs', () => {
    writeFinished(finished())
    expect(readFinished('201')?.courseId).toBe('201')
  })
  it('liefert kein Ergebnis eines anderen Kurses', () => {
    writeFinished(finished({ courseId: '101' }))
    expect(readFinished('201')).toBeNull()
  })
  it('verwirft ein Ergebnis mit veralteter quizVersion', () => {
    writeFinished(finished({ quizVersion: 'irgendwas-altes' }))
    expect(readFinished('201')).toBeNull()
  })
  it('nichts vorhanden -> null', () => {
    expect(readFinished('201')).toBeNull()
  })
})
