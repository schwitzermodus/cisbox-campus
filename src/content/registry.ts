import { course as course101 } from './courses/101-rechnungsgrundlagen'
import { course as course201 } from './courses/201-e-rechnung'
import { course as course202 } from './courses/202-e-rechnung-vertiefung'
import { COURSE_IDS, SEGMENT_IDS } from './types'
import type { Course, CourseId, Segment, SegmentId } from './types'

export const SEGMENTS: readonly Segment[] = [
  {
    id: 'invoicing',
    order: 0,
    title: { de: 'Rechnungen', en: 'Invoices' },
    intro: {
      de: 'Grundwissen rund um Rechnungen, unabhängig vom Format.',
      en: 'Basic knowledge about invoices, independent of the format.',
    },
  },
  {
    id: 'e-invoicing',
    order: 1,
    title: { de: 'E-Rechnung', en: 'E-invoicing' },
    intro: {
      de: 'Die elektronische Rechnung im Detail.',
      en: 'The electronic invoice in detail.',
    },
  },
]

export const COURSES: readonly Course[] = [course101, course201, course202]

export const COURSES_BY_ID: Partial<Record<CourseId, Course>> = Object.fromEntries(COURSES.map((c) => [c.id, c]))

export function isCourseId(v: unknown): v is CourseId {
  return typeof v === 'string' && (COURSE_IDS as readonly string[]).includes(v)
}

export function courseById(id: CourseId): Course | undefined {
  return COURSES_BY_ID[id]
}

export function coursesOfSegment(segment: SegmentId): Course[] {
  return COURSES.filter((c) => c.segment === segment).sort((a, b) => a.order - b.order)
}

export function segmentById(id: SegmentId): Segment | undefined {
  return SEGMENTS.find((s) => s.id === id)
}

export { SEGMENT_IDS, COURSE_IDS }
