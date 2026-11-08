import AxeBuilder from '@axe-core/playwright'
import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import type { Question } from '../../../src/core/types'

/** Mitschnitt der Session aus sessionStorage (enthaelt die gezogenen Fragen samt Loesung). */
export type StoredSession = {
  courseId: string
  quizVersion: string
  index: number
  questions: Question[]
  answers: Record<string, unknown>
  checked: string[]
}

export const SESSION_KEY = 'cisbox-campus.quiz.v2'

export type Intent = 'correct' | 'partial' | 'wrong'

/** Erwartete Kopfzeile je Absicht, de und en. */
export const LABEL = {
  de: { correct: 'Richtig', partial: 'Teilweise richtig', wrong: 'Falsch' },
  en: { correct: 'Correct', partial: 'Partly correct', wrong: 'Wrong' },
} as const

export async function readStored(page: Page): Promise<StoredSession> {
  const raw = await page.evaluate((k) => sessionStorage.getItem(k), SESSION_KEY)
  expect(raw, 'Session im sessionStorage').not.toBeNull()
  return JSON.parse(raw!) as StoredSession
}

export async function writeStored(page: Page, s: StoredSession): Promise<void> {
  await page.evaluate(([k, v]) => sessionStorage.setItem(k!, v!), [SESSION_KEY, JSON.stringify(s)])
}

/** Startet einen frischen Test (Kurs 201: feste Mischung 4 single / 3 multi / 2 slider / 1 matching). */
export async function startQuiz(page: Page, courseId = '201'): Promise<StoredSession> {
  await page.goto(`./#/de/${courseId}/quiz`)
  await expect(page.getByText('Frage 1 von 10', { exact: true })).toBeVisible()
  return readStored(page)
}

export function indexOfType(s: StoredSession, type: Question['type'], nth = 0): number {
  const idx = s.questions.map((q, i) => (q.type === type ? i : -1)).filter((i) => i >= 0)
  const i = idx[nth]
  if (i === undefined) throw new Error(`Kein ${nth + 1}. Fragetyp ${type} in der Session`)
  return i
}

export const section = (page: Page) => page.locator('section.card')
export const checkButton = (page: Page) => page.getByRole('button', { name: 'Antwort prüfen' })
export const nextButton = (page: Page) => page.getByRole('button', { name: 'Weiter' })
export const prevButton = (page: Page) => page.getByRole('button', { name: 'Zurück' })
export const feedback = (page: Page) => section(page).locator('.fb')
export const feedbackHeader = (page: Page) => section(page).locator('.fb .bd-state')

/** "Zu Frage n" (1-basiert) ueber die Leiste. */
export async function jumpTo(page: Page, n: number): Promise<void> {
  await page.getByRole('button', { name: new RegExp('^Zu Frage ' + n + ',') }).click()
  await expect(page.getByText(`Frage ${n} von 10`, { exact: true })).toBeVisible()
}

/**
 * Beantwortet die aktuell sichtbare Frage mit der gewuenschten Qualitaet und liefert die tatsaechlich
 * erreichte (Single Choice kennt kein "partial", dann "correct").
 */
export async function answer(page: Page, q: Question, intent: Intent): Promise<Intent> {
  const sec = section(page)
  switch (q.type) {
    case 'single': {
      const correct = q.options.findIndex((o) => o.id === q.correctOptionId)
      const wrong = q.options.findIndex((o) => o.id !== q.correctOptionId)
      await sec.getByRole('radio').nth(intent === 'wrong' ? wrong : correct).check()
      return intent === 'wrong' ? 'wrong' : 'correct'
    }
    case 'multi': {
      const boxes = sec.getByRole('checkbox')
      const idxOf = (ids: string[]) => ids.map((id) => q.options.findIndex((o) => o.id === id))
      const wrongIdx = q.options.findIndex((o) => !q.correctOptionIds.includes(o.id))
      const toCheck =
        intent === 'correct' ? idxOf(q.correctOptionIds) : intent === 'partial' ? idxOf(q.correctOptionIds.slice(0, 2)) : [wrongIdx]
      for (const i of toCheck) await boxes.nth(i).check()
      return intent
    }
    case 'slider': {
      let value = q.target
      if (intent === 'partial') {
        const d = Math.max(1, Math.round(q.zeroAt / 2))
        value = q.target - d >= q.min ? q.target - d : q.target + d
        expect(Math.abs(value - q.target)).toBeGreaterThan(q.tolerance)
        expect(Math.abs(value - q.target)).toBeLessThan(q.zeroAt)
      } else if (intent === 'wrong') {
        value = q.target - q.min >= q.max - q.target ? q.min : q.max
        expect(Math.abs(value - q.target), 'Schaetzfrage: Extremwert muss 0 Punkte ergeben').toBeGreaterThanOrEqual(q.zeroAt)
      }
      await sec.getByRole('spinbutton').fill(String(value))
      return intent
    }
    case 'matching': {
      const selects = sec.locator('select')
      const rows = q.left.length
      for (let i = 0; i < rows; i++) {
        const l = q.left[i]!
        const correct = q.pairs[l.id]!
        if (intent === 'correct') await selects.nth(i).selectOption(correct)
        else if (intent === 'partial') {
          if (i === 0) await selects.nth(i).selectOption(correct)
        } else {
          const wrong = q.right.find((r) => r.id !== correct)!
          await selects.nth(i).selectOption(wrong.id)
        }
      }
      return rows >= 2 ? intent : intent === 'partial' ? 'correct' : intent
    }
  }
}

/** Prueft die Frage und wartet auf das Feedback. */
export async function check(page: Page): Promise<void> {
  await checkButton(page).click()
  await expect(feedback(page)).toBeVisible()
}

export async function expectNoAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  expect(bad.map((v) => v.id + ': ' + v.nodes.map((n) => n.target.join(' ')).join(', '))).toEqual([])
}

export async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.locator('#theme-select').selectOption(theme)
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
}

export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
}

export type ContrastSample = { selector: string; text: string; ratio: number; fg: string; bg: string }

/**
 * Misst das WCAG-Kontrastverhaeltnis (Textfarbe gegen den effektiven Hintergrund, inkl. Alpha und
 * opacity der Vorfahren) fuer alle Treffer der Selektoren. axe nimmt deaktivierte Elemente
 * vom Kontrast aus, deshalb wird das hier selbst gemessen.
 */
export async function measureContrast(page: Page, selectors: string[]): Promise<ContrastSample[]> {
  return page.evaluate((sels) => {
    type RGBA = [number, number, number, number]
    const parse = (c: string): RGBA | null => {
      let m = c.match(/^rgba?\(([^)]+)\)$/)
      if (m) {
        const p = m[1]!.split(/[ ,/]+/).filter(Boolean).map(Number)
        return [p[0]!, p[1]!, p[2]!, p[3] ?? 1]
      }
      m = c.match(/^color\(srgb ([^)]+)\)$/)
      if (m) {
        const p = m[1]!.split(/[ /]+/).filter(Boolean).map(Number)
        return [p[0]! * 255, p[1]! * 255, p[2]! * 255, p[3] ?? 1]
      }
      return null
    }
    const over = (fg: RGBA, bg: RGBA): RGBA => {
      const a = fg[3] + bg[3] * (1 - fg[3])
      if (a === 0) return [0, 0, 0, 0]
      const ch = (i: number) => (fg[i]! * fg[3] + bg[i]! * bg[3] * (1 - fg[3])) / a
      return [ch(0), ch(1), ch(2), a]
    }
    const lum = (c: RGBA) => {
      const f = (v: number) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
      }
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
    }
    const out: { selector: string; text: string; ratio: number; fg: string; bg: string }[] = []
    for (const sel of sels) {
      for (const el of Array.from(document.querySelectorAll<HTMLElement>(sel))) {
        const cs = getComputedStyle(el)
        const fg = parse(cs.color)
        let bg: RGBA = [0, 0, 0, 0]
        let opacity = 1
        for (let n: HTMLElement | null = el; n; n = n.parentElement) {
          const s = getComputedStyle(n)
          opacity *= Number(s.opacity)
          const b = parse(s.backgroundColor)
          if (b && b[3] > 0) bg = over(bg, b)
          if (bg[3] >= 1) break
        }
        const text = (el.textContent ?? el.getAttribute('value') ?? '').trim().slice(0, 40)
        if (!fg || bg[3] < 1) {
          out.push({ selector: sel, text: text + ' [Farbe nicht lesbar: ' + cs.color + ' auf ' + cs.backgroundColor + ']', ratio: 0, fg: cs.color, bg: cs.backgroundColor })
          continue
        }
        const white: RGBA = [255, 255, 255, 1]
        const solidBg = over(bg, white)
        const solidFg = over([fg[0], fg[1], fg[2], fg[3] * opacity], solidBg)
        const l1 = lum(solidFg)
        const l2 = lum(solidBg)
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
        out.push({ selector: sel, text, ratio, fg: cs.color, bg: cs.backgroundColor })
      }
    }
    return out
  }, selectors)
}
