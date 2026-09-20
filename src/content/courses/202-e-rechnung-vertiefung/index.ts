import type { Course } from '../../types'
import { CARDS } from './cards'
import { CONTENT_AS_OF, DIFFICULTY, ID_PREFIX, QUIZ_VERSION } from './meta'
import { figures } from './figures'
import { QUESTIONS } from './questions'

export const course: Course = {
  id: '202',
  segment: 'e-invoicing',
  order: 2,
  title: { de: 'Vertiefung', en: 'Advanced' },
  subtitle: {
    de: 'Datenmodell, Validierung, Profile, Peppol und Archivierung im Detail.',
    en: 'Data model, validation, profiles, Peppol and archiving in detail.',
  },
  intro: {
    de: 'Neun kurze Lernkarten, danach ein Test mit zehn Fragen. Baut auf Kurs 201 auf, kein Login, kein Name.',
    en: 'Nine short learning cards, then a test with ten questions. Builds on course 201, no login, no name.',
  },
  difficulty: DIFFICULTY,
  idPrefix: ID_PREFIX,
  quizVersion: QUIZ_VERSION,
  contentAsOf: CONTENT_AS_OF,
  cards: CARDS,
  questions: QUESTIONS,
  figures,
  recommendedAfter: '201',
}
