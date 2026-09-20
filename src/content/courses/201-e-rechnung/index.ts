import type { Course } from '../../types'
import { CARDS } from './cards'
import { CONTENT_AS_OF, DIFFICULTY, ID_PREFIX, QUIZ_VERSION } from './meta'
import { figures } from './figures'
import { QUESTIONS } from './questions'

export const course: Course = {
  id: '201',
  segment: 'e-invoicing',
  order: 1,
  title: { de: 'Grundlagen', en: 'Basics' },
  subtitle: {
    de: 'Was eine E-Rechnung ausmacht, die wichtigsten Formate, Fristen und ViDA.',
    en: 'What makes an e-invoice, the main formats, deadlines and ViDA.',
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
  recommendedAfter: '101',
}
