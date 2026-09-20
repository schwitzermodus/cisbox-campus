import type { ComponentType } from 'react'
import type { Difficulty, LocalizedText, Question } from '../core/types'

export const SEGMENT_IDS = ['invoicing', 'e-invoicing'] as const
export type SegmentId = (typeof SEGMENT_IDS)[number]

export const COURSE_IDS = ['101', '201', '202'] as const
export type CourseId = (typeof COURSE_IDS)[number]

export type Segment = {
  id: SegmentId
  order: number
  title: LocalizedText
  /** eine Zeile unter der Segment-Ueberschrift auf der Kursuebersicht */
  intro: LocalizedText
}

export type LearnCard = {
  id: string
  title: LocalizedText
  /** Absaetze. Wortlaut wie gehabt, nur in lesbare Bloecke geteilt. */
  body: LocalizedText[]
  /** Schluessel in Course.figures, kein globales Literal mehr. */
  figure?: string
}

/** Kursweite Grafiken. Zugriff liefert unter noUncheckedIndexedAccess `| undefined`. */
export type FigureMap = Readonly<Record<string, ComponentType>>

export type Course = {
  id: CourseId
  segment: SegmentId
  /** Reihenfolge innerhalb des Segments. */
  order: number
  /** z.B. "Grundlagen" / "Vertiefung" */
  title: LocalizedText
  /** ein Satz fuer die Kachel */
  subtitle: LocalizedText
  /** laengerer Absatz fuer die Kursdetailseite */
  intro: LocalizedText
  difficulty: Difficulty
  /** Praefix aller Frage-IDs dieses Kurses, durch Tests erzwungen. */
  idPrefix: string
  quizVersion: string
  /** Rechtsstand der Inhalte, ISO-Datum. */
  contentAsOf: string
  cards: readonly LearnCard[]
  questions: readonly Question[]
  figures: FigureMap
  /** Nur ein Hinweis auf der Kachel, keine Sperre. */
  recommendedAfter?: CourseId
}
