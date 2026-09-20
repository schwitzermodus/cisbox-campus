import type { Course } from '../../types'
import { CARDS } from './cards'
import { CONTENT_AS_OF, DIFFICULTY, ID_PREFIX, QUIZ_VERSION } from './meta'
import { figures } from './figures'
import { QUESTIONS } from './questions'

export const course: Course = {
  id: '101',
  segment: 'invoicing',
  order: 1,
  title: { de: 'Grundlagen', en: 'Basics' },
  subtitle: {
    de: 'Was eine Rechnung ausmacht, Pflichtangaben, der Weg von der Bestellung bis zur Bezahlung.',
    en: 'What makes an invoice, mandatory details, the path from order to payment.',
  },
  intro: {
    de: 'Neun kurze Lernkarten, danach ein Test mit zehn Fragen. Kein Login, kein Name, nichts wird an cisbox übertragen.',
    en: 'Nine short learning cards, then a test with ten questions. No login, no name, nothing is sent to cisbox.',
  },
  difficulty: DIFFICULTY,
  idPrefix: ID_PREFIX,
  quizVersion: QUIZ_VERSION,
  contentAsOf: CONTENT_AS_OF,
  cards: CARDS,
  questions: QUESTIONS,
  figures,
}
