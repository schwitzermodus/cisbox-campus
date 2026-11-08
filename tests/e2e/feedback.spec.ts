import { expect, test } from '@playwright/test'
import {
  LABEL,
  answer,
  check,
  checkButton,
  expectNoAxeViolations,
  feedback,
  feedbackHeader,
  horizontalOverflow,
  indexOfType,
  jumpTo,
  measureContrast,
  nextButton,
  prevButton,
  readStored,
  section,
  setTheme,
  startQuiz,
  writeStored,
} from './helpers/quiz'
import type { Intent } from './helpers/quiz'
import { QUESTIONS as Q101 } from '../../src/content/courses/101-rechnungsgrundlagen/questions'
import { QUESTIONS as Q201 } from '../../src/content/courses/201-e-rechnung/questions'
import { QUESTIONS as Q202 } from '../../src/content/courses/202-e-rechnung-vertiefung/questions'
import { scoreQuestion } from '../../src/core/scoring'
import type { Question } from '../../src/core/types'

const TYPES: Question['type'][] = ['single', 'multi', 'slider', 'matching']

/** Normalisiert Leerraum, damit toContainText Erklaerungen aus den Daten sicher trifft. */
const expl = (q: Question, locale: 'de' | 'en' = 'de') => (q.explanation[locale] ?? q.explanation.de).replace(/\s+/g, ' ').trim()

async function expectLocked(page: import('@playwright/test').Page) {
  const controls = section(page).locator('input, select')
  const n = await controls.count()
  expect(n).toBeGreaterThan(0)
  for (let i = 0; i < n; i++) await expect(controls.nth(i)).toBeDisabled()
}

async function expectOpen(page: import('@playwright/test').Page) {
  const controls = section(page).locator('input, select')
  const n = await controls.count()
  expect(n).toBeGreaterThan(0)
  for (let i = 0; i < n; i++) await expect(controls.nth(i)).toBeEnabled()
}

async function expectNoFeedback(page: import('@playwright/test').Page) {
  await expect(feedback(page)).toHaveCount(0)
  await expect(section(page).locator('.mark')).toHaveCount(0)
  await expect(section(page).locator('[data-mark]')).toHaveCount(0)
  await expect(section(page).locator('[role="status"]')).toBeEmpty()
}

test.describe('AK1, AK4: Feedback je Fragetyp mit Loesung und Erklaerung', () => {
  test('richtig beantwortet: "Richtig", Erklaerung und richtige Loesung', async ({ page }) => {
    const s = await startQuiz(page)
    for (const type of TYPES) {
      const i = indexOfType(s, type)
      const q = s.questions[i]!
      await jumpTo(page, i + 1)
      expect(await answer(page, q, 'correct')).toBe('correct')
      await check(page)
      await expect(feedbackHeader(page)).toContainText(LABEL.de.correct)
      await expect(feedbackHeader(page)).not.toContainText('Falsch')
      await expect(section(page).locator('.fb-expl')).toContainText(expl(q))
      await expect(section(page).locator('.fb')).toContainText('Richtige Antwort')
      if (q.type === 'single' || q.type === 'multi') {
        const ids = q.type === 'single' ? [q.correctOptionId] : q.correctOptionIds
        for (const id of ids) {
          const label = q.options.find((o) => o.id === id)!.label.de
          await expect(section(page).locator('.fb dd li', { hasText: label }).first()).toBeVisible()
        }
        await expect(section(page).locator('.option .mark[data-mark="correct"]')).toHaveCount(ids.length)
        await expect(section(page).locator('.mark[data-mark="wrong-chosen"]')).toHaveCount(0)
      }
      if (q.type === 'slider') {
        await expect(section(page).locator('.fb')).toContainText('Dein Wert')
      }
      if (q.type === 'matching') {
        await expect(section(page).locator('.fb .mark[data-mark="correct"]')).toHaveCount(q.left.length)
        await expect(section(page).locator('.mark[data-mark="wrong-chosen"]')).toHaveCount(0)
      }
    }
  })

  test('falsch beantwortet: "Falsch", falsche Eigenwahl erkennbar, richtige Loesung sichtbar', async ({ page }) => {
    const s = await startQuiz(page)
    for (const type of TYPES) {
      const i = indexOfType(s, type)
      const q = s.questions[i]!
      await jumpTo(page, i + 1)
      expect(await answer(page, q, 'wrong')).toBe('wrong')
      await check(page)
      await expect(feedbackHeader(page)).toContainText(LABEL.de.wrong)
      await expect(section(page).locator('.fb-expl')).toContainText(expl(q))
      if (q.type === 'single') {
        await expect(section(page).locator('.option .mark[data-mark="wrong-chosen"]')).toHaveCount(1)
        await expect(section(page).locator('.option .mark[data-mark="missed"]')).toHaveCount(1)
        const label = q.options.find((o) => o.id === q.correctOptionId)!.label.de
        await expect(section(page).locator('.fb dd li', { hasText: label }).first()).toBeVisible()
      }
      if (q.type === 'multi') {
        await expect(section(page).locator('.option .mark[data-mark="wrong-chosen"]')).toHaveCount(1)
        await expect(section(page).locator('.option .mark[data-mark="missed"]')).toHaveCount(q.correctOptionIds.length)
        await expect(section(page).locator('.fb dd li')).toHaveCount(q.correctOptionIds.length)
      }
      if (q.type === 'slider') {
        await expect(section(page).locator('.fb')).toContainText('Dein Wert')
        await expect(section(page).locator('.fb')).toContainText('Richtige Antwort')
        await expect(section(page).locator('.fb dd').last()).toContainText(q.target.toLocaleString('de-DE'))
      }
      if (q.type === 'matching') {
        await expect(section(page).locator('.fb .mark[data-mark="wrong-chosen"]')).toHaveCount(q.left.length)
        for (const l of q.left) {
          const right = q.right.find((r) => r.id === q.pairs[l.id])!.label.de
          await expect(section(page).locator('.fb li', { hasText: l.label.de + ' → ' + right }).first()).toBeVisible()
        }
      }
    }
  })

  test('teilweise richtig: Multiple Select und Zuordnung zeigen "Teilweise richtig"', async ({ page }) => {
    const s = await startQuiz(page)
    for (const type of ['multi', 'matching'] as const) {
      const i = indexOfType(s, type)
      const q = s.questions[i]!
      await jumpTo(page, i + 1)
      expect(await answer(page, q, 'partial')).toBe('partial')
      await check(page)
      await expect(feedbackHeader(page)).toContainText(LABEL.de.partial)
      await expect(section(page).locator('.fb-expl')).toContainText(expl(q))
    }
  })

  test('Schaetzfrage: Wert zwischen Toleranz und Nullpunkt ergibt "Teilweise richtig"', async ({ page }) => {
    const s = await startQuiz(page)
    const i = indexOfType(s, 'slider')
    await jumpTo(page, i + 1)
    expect(await answer(page, s.questions[i]!, 'partial')).toBe('partial')
    await check(page)
    await expect(feedbackHeader(page)).toContainText(LABEL.de.partial)
  })
})

test('AK2: "Antwort pruefen" ist ohne Antwort nicht bedienbar, mit Antwort schon', async ({ page }) => {
  const s = await startQuiz(page)
  for (const type of TYPES) {
    const i = indexOfType(s, type)
    await jumpTo(page, i + 1)
    await expect(checkButton(page)).toBeVisible()
    await expect(checkButton(page)).toBeDisabled()
    await answer(page, s.questions[i]!, 'correct')
    await expect(checkButton(page)).toBeEnabled()
  }
})

test('AK3: nach dem Pruefen sind alle Eingaben gesperrt, auch nach Weiter/Zurueck und "Zu Frage n"', async ({ page }) => {
  const s = await startQuiz(page)
  for (const type of TYPES) {
    const i = indexOfType(s, type)
    const q = s.questions[i]!
    await jumpTo(page, i + 1)
    await expectOpen(page)
    await answer(page, q, 'wrong')
    await check(page)
    await expectLocked(page)
    await expect(checkButton(page)).toHaveCount(0)

    // Weiter und wieder Zurueck
    if (i < 9) {
      await nextButton(page).click()
      await expect(page.getByText(`Frage ${i + 2} von 10`, { exact: true })).toBeVisible()
      await prevButton(page).click()
    } else {
      await prevButton(page).click()
      await nextButton(page).click()
    }
    await expect(page.getByText(`Frage ${i + 1} von 10`, { exact: true })).toBeVisible()
    await expectLocked(page)
    await expect(feedback(page)).toBeVisible()

    // Weg- und per "Zu Frage n" zurueckspringen
    await jumpTo(page, i === 0 ? 2 : 1)
    await jumpTo(page, i + 1)
    await expectLocked(page)
    await expect(feedback(page)).toBeVisible()
  }
  // Antworten der geprueften Fragen sind unveraendert
  const after = await readStored(page)
  expect(after.checked).toHaveLength(4)
})

test('AK5: ohne "Antwort pruefen" ist kein Feedback und keine Loesung sichtbar', async ({ page }) => {
  const s = await startQuiz(page)
  await expectNoFeedback(page)
  for (const type of TYPES) {
    const i = indexOfType(s, type)
    await jumpTo(page, i + 1)
    await expectNoFeedback(page)
    await answer(page, s.questions[i]!, 'correct')
    await expectNoFeedback(page)
    await expect(section(page).locator('.fb-expl, .fb dt')).toHaveCount(0)
  }
  // Nach Navigation weiterhin nichts
  await jumpTo(page, 1)
  await nextButton(page).click()
  await prevButton(page).click()
  await expectNoFeedback(page)
  expect((await readStored(page)).checked).toEqual([])
})

test('AK6: Ueberspringen und Zurueckblaettern; ungepruefte Fragen bleiben offen, gepruefte gesperrt', async ({ page }) => {
  const s = await startQuiz(page)
  // Frage 1 beantworten + pruefen
  await answer(page, s.questions[0]!, 'correct')
  await check(page)
  await nextButton(page).click()
  // Frage 2 beantworten, NICHT pruefen, ueberspringen
  await expect(page.getByText('Frage 2 von 10', { exact: true })).toBeVisible()
  await answer(page, s.questions[1]!, 'wrong')
  await nextButton(page).click()
  // Frage 3 ueberspringen ohne Antwort
  await expect(page.getByText('Frage 3 von 10', { exact: true })).toBeVisible()
  await nextButton(page).click()
  await expect(page.getByText('Frage 4 von 10', { exact: true })).toBeVisible()

  // Frage 3: unbeantwortet, offen, Pruefen gesperrt, aber jetzt beantwortbar
  await prevButton(page).click()
  await expect(page.getByText('Frage 3 von 10', { exact: true })).toBeVisible()
  await expectOpen(page)
  await expect(checkButton(page)).toBeDisabled()
  await answer(page, s.questions[2]!, 'correct')
  await expect(checkButton(page)).toBeEnabled()

  // Frage 2: offen und aenderbar (Antwort wird ueberschrieben)
  await prevButton(page).click()
  await expectOpen(page)
  await expectNoFeedback(page)
  const before = JSON.stringify((await readStored(page)).answers[s.questions[1]!.id])
  await answer(page, s.questions[1]!, 'correct')
  const afterAnswer = JSON.stringify((await readStored(page)).answers[s.questions[1]!.id])
  if (s.questions[1]!.type === 'single' || s.questions[1]!.type === 'multi' || s.questions[1]!.type === 'slider') {
    expect(afterAnswer).not.toEqual(before)
  }
  await expect(checkButton(page)).toBeEnabled()

  // Frage 1: gesperrt mit Feedback
  await prevButton(page).click()
  await expect(page.getByText('Frage 1 von 10', { exact: true })).toBeVisible()
  await expectLocked(page)
  await expect(feedbackHeader(page)).toContainText(LABEL.de.correct)

  // Leiste markiert beantwortet/offen weiter wie bisher
  await expect(page.getByText('3 von 10 beantwortet')).toBeVisible()
})

test('AK7, AK13, AK14: letzte Frage -> Abgeben nach dem Feedback; Ergebnis und Aufloesung stimmen mit dem Feedback ueberein', async ({
  page,
}) => {
  test.setTimeout(90_000)
  const s = await startQuiz(page)
  const intents: Intent[] = ['correct', 'wrong', 'partial']
  const shown: string[] = []
  let expectedScore = 0

  for (let i = 0; i < 10; i++) {
    const q = s.questions[i]!
    await expect(page.getByText(`Frage ${i + 1} von 10`, { exact: true })).toBeVisible()
    await answer(page, q, intents[i % 3]!)
    const stored = (await readStored(page)).answers[q.id] as Parameters<typeof scoreQuestion>[1]
    expectedScore += scoreQuestion(q, stored)
    await check(page)
    shown.push((await feedbackHeader(page).innerText()).replace(/^\S+\s/, '').trim())
    if (i < 9) await nextButton(page).click()
  }

  // AK7: auf der letzten Frage ist nach dem Feedback "Abgeben" der naechste Schritt
  await expect(nextButton(page)).toHaveCount(0)
  await page.getByRole('button', { name: 'Abgeben', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Alle Fragen sind beantwortet')).toBeVisible()
  await dialog.getByRole('button', { name: 'Ja, abgeben' }).click()

  // AK13: Ergebnis, Punktzahl, Bewertungsstufe, Aufloesung
  await expect(page).toHaveURL(/#\/de\/201\/result$/)
  await expect(page.getByText(/von 1.000 Punkten/).first()).toBeVisible()
  await expect(page.locator('.score-big')).toHaveText(expectedScore.toLocaleString('de-DE'))
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Auflösung' })).toBeVisible()
  const items = page.locator('ol.breakdown > li')
  await expect(items).toHaveCount(10)

  // AK14: Status je Frage im Feedback == Status in der Aufloesung
  for (let i = 0; i < 10; i++) {
    const state = (await items.nth(i).locator('.bd-state').innerText()).replace(/^\S+\s/, '').split('·')[0]!.trim()
    expect(state, `Frage ${i + 1}`).toBe(shown[i])
  }
  // Test deckt alle drei Stati ab
  expect(new Set(shown)).toEqual(new Set(['Richtig', 'Falsch', 'Teilweise richtig']))
})

test('AK8: Richtig/Falsch ist nicht nur Farbe (Symbol + Text); axe in Hell und Dunkel ohne Verstoesse', async ({ page }) => {
  test.setTimeout(120_000)
  const s = await startQuiz(page)
  const intents: Intent[] = ['wrong', 'partial', 'correct', 'wrong']
  const order: Question['type'][] = ['single', 'multi', 'matching', 'slider']
  for (const [k, type] of order.entries()) {
    const i = indexOfType(s, type)
    await jumpTo(page, i + 1)
    await answer(page, s.questions[i]!, intents[k]!)
    await check(page)
    // Symbol UND Text in der Kopfzeile
    const header = (await feedbackHeader(page).innerText()).trim()
    expect(header).toMatch(/^(✓|◐|✕)\s+(Richtig|Teilweise richtig|Falsch)$/)
    await expect(feedbackHeader(page).locator('[aria-hidden="true"]')).toHaveCount(1)
    // Marken enthalten Text, nicht nur Farbe
    const marks = section(page).locator('.mark')
    for (let m = 0; m < (await marks.count()); m++) {
      await expect(marks.nth(m)).toHaveText(/\S{2,}/)
      await expect(marks.nth(m)).toContainText(/richtig|falsch/i)
    }
  }
  for (const theme of ['light', 'dark'] as const) {
    await setTheme(page, theme)
    for (const type of order) {
      await jumpTo(page, indexOfType(s, type) + 1)
      await expect(feedback(page)).toBeVisible()
      await expectNoAxeViolations(page)
    }
  }
})

test('AK8: Kontrast (WCAG AA 4.5:1) von Kopfzeile, Marken, Erklaerung und gesperrten Feldern in Hell und Dunkel', async ({
  page,
}) => {
  test.setTimeout(120_000)
  const s = await startQuiz(page)
  const intents: Intent[] = ['wrong', 'partial', 'correct', 'wrong']
  const order: Question['type'][] = ['single', 'multi', 'matching', 'slider']
  for (const [k, type] of order.entries()) {
    const i = indexOfType(s, type)
    await jumpTo(page, i + 1)
    await answer(page, s.questions[i]!, intents[k]!)
    await check(page)
  }
  const selectors = [
    '.fb .bd-state',
    '.fb-expl',
    '.mark',
    'fieldset:disabled legend',
    'fieldset:disabled .option-text',
    'fieldset:disabled .match-left',
    'fieldset:disabled select',
    'fieldset:disabled .num-input',
    'fieldset:disabled .slider-value',
  ]
  const failures: string[] = []
  for (const theme of ['light', 'dark'] as const) {
    await setTheme(page, theme)
    for (const type of order) {
      await jumpTo(page, indexOfType(s, type) + 1)
      const samples = await measureContrast(page, selectors)
      expect(samples.length).toBeGreaterThan(0)
      for (const c of samples) {
        if (c.ratio < 4.5) failures.push(`${theme}/${type} ${c.selector} "${c.text}" ${c.ratio.toFixed(2)} (${c.fg} auf ${c.bg})`)
      }
    }
  }
  expect(failures).toEqual([])
})

test('AK9: Live-Region, Tastaturbedienung und Fokus', async ({ page }) => {
  const s = await startQuiz(page)
  // Live-Region steht schon VOR dem Pruefen im DOM, ist leer und wird erst danach befuellt
  const region = section(page).locator('[role="status"]')
  await expect(region).toHaveCount(1)
  await expect(region).toBeEmpty()

  // Frage 1 per Tastatur pruefen (Enter)
  await answer(page, s.questions[0]!, 'correct')
  await checkButton(page).focus()
  await expect(checkButton(page)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(feedback(page)).toBeVisible()
  await expect(region).not.toBeEmpty()
  await expect(region.locator('.fb')).toHaveCount(1)
  // Fokus geht nicht verloren: er liegt auf "Weiter"
  await expect(nextButton(page)).toBeFocused()
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BUTTON')
  await expectNoAxeViolations(page)

  // Weiter per Tastatur
  await page.keyboard.press('Enter')
  await expect(page.getByText('Frage 2 von 10', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(false)
  await expect(region).toBeEmpty()

  // Frage 2 per Leertaste pruefen
  await answer(page, s.questions[1]!, 'wrong')
  await checkButton(page).focus()
  await page.keyboard.press('Space')
  await expect(feedback(page)).toBeVisible()
  await expect(nextButton(page)).toBeFocused()
  await expectNoAxeViolations(page)
})

test('AK9: "Abgeben" auf der letzten Frage erhaelt nach dem Pruefen den Fokus', async ({ page }) => {
  const s = await startQuiz(page)
  await jumpTo(page, 10)
  await answer(page, s.questions[9]!, 'correct')
  await check(page)
  await expect(page.getByRole('button', { name: 'Abgeben', exact: true })).toBeFocused()
})

test.describe('AK10: 360 px ohne horizontales Scrollen, lange Erklaerung', () => {
  test('Feedback je Fragetyp mit sehr langer Erklaerung', async ({ page }) => {
    test.setTimeout(90_000)
    const s = await startQuiz(page)
    const longWord = 'Donaudampfschifffahrtsgesellschaftskapitaensmuetzenabzeichenherstellungsunternehmen'
    const longText = Array.from({ length: 25 }, (_, k) => `Satz ${k + 1} der sehr langen Erklaerung mit Inhalt.`).join(' ') + ' ' + longWord
    for (const q of s.questions) {
      q.explanation = { ...q.explanation, de: longText, en: longText }
    }
    await writeStored(page, s)
    await page.reload()
    await expect(page.getByText('Frage 1 von 10', { exact: true })).toBeVisible()

    for (const type of TYPES) {
      const i = indexOfType(s, type)
      const q = s.questions[i]!
      await jumpTo(page, i + 1)
      await answer(page, q, 'wrong')
      await check(page)
      await expect(section(page).locator('.fb-expl')).toContainText(longWord)
      expect(await horizontalOverflow(page), type).toBeLessThanOrEqual(0)

      // Schaltflaechen erreichbar und nicht ueberdeckt: Klick wird von Playwright auf Sichtbarkeit/Abdeckung geprueft
      const next = i < 9 ? nextButton(page) : page.getByRole('button', { name: 'Abgeben', exact: true })
      await next.scrollIntoViewIfNeeded()
      await expect(next).toBeVisible()
      const box = await next.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(360)
      if (i < 9) {
        await next.click()
        await expect(page.getByText(`Frage ${i + 2} von 10`, { exact: true })).toBeVisible()
      }
    }
  })

  for (const [courseId, pool] of [
    ['101', Q101],
    ['201', Q201],
    ['202', Q202],
  ] as const) {
    test(`Feedback ohne Ueberlauf fuer jede Frage des Pools, Kurs ${courseId}`, async ({ page }) => {
      test.setTimeout(240_000)
      const s = await startQuiz(page, courseId)
      const offenders: string[] = []
      for (const q of pool) {
        // Die Zufallsauswahl wuerde Fragen auslassen: jede Frage des Pools einzeln als Frage 1 einsetzen
        s.questions = [q, ...s.questions.slice(1)]
        s.index = 0
        s.answers = {}
        s.checked = []
        await writeStored(page, s)
        await page.reload()
        await expect(section(page)).toBeVisible()
        await answer(page, q, 'wrong')
        await check(page)
        const overflow = await horizontalOverflow(page)
        if (overflow > 0) offenders.push(`${q.id} (${q.type}): ${overflow}px`)
      }
      expect(offenders, 'Fragen mit horizontalem Scrollen bei 360 px nach dem Pruefen').toEqual([])
    })
  }

  test('Hilfsmessung: Overflow-Pruefung schlaegt bei einem kuenstlich breiten Element an', async ({ page }) => {
    await startQuiz(page)
    await page.evaluate(() => {
      const d = document.createElement('div')
      d.style.width = '600px'
      d.style.height = '2px'
      document.body.appendChild(d)
    })
    expect(await horizontalOverflow(page)).toBeGreaterThan(0)
  })
})

test('AK11: Sprachwechsel nach dem Pruefen: Feedback in neuer Sprache, Frage bleibt gesperrt', async ({ page }) => {
  const s = await startQuiz(page)
  const cases: [Question['type'], Intent][] = [
    ['single', 'wrong'],
    ['multi', 'partial'],
    ['matching', 'correct'],
  ]
  for (const [type, intent] of cases) {
    const i = indexOfType(s, type)
    const q = s.questions[i]!
    await jumpTo(page, i + 1)
    await answer(page, q, intent)
    await check(page)
    await expect(feedbackHeader(page)).toContainText(LABEL.de[intent])

    await page.getByRole('button', { name: 'English' }).click()
    await expect(page).toHaveURL(/#\/en\/201\/quiz$/)
    await expect(page.getByText(`Question ${i + 1} of 10`, { exact: true })).toBeVisible()
    await expect(feedbackHeader(page)).toContainText(LABEL.en[intent])
    await expect(section(page).locator('.fb-expl')).toContainText(expl(q, 'en'))
    await expect(section(page).locator('.fb-expl strong')).toHaveText('Explanation:')
    await expect(section(page).locator('.fb dt').first()).toHaveText(type === 'slider' ? 'Your value' : 'Correct answer')
    await expectLocked(page)
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()

    await page.getByRole('button', { name: 'Deutsch' }).click()
    await expect(feedbackHeader(page)).toContainText(LABEL.de[intent])
    await expectLocked(page)
  }
})

test('AK11: auch nach Sprachwechsel bleibt eine ungepruefte Frage ohne Feedback und offen', async ({ page }) => {
  const s = await startQuiz(page)
  await answer(page, s.questions[0]!, 'correct')
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible()
  await expectNoFeedback(page)
  await expectOpen(page)
  await expect(page.getByRole('button', { name: 'Check answer' })).toBeEnabled()
})

test('AK12: Reload mitten im Test: gepruefte Fragen gesperrt mit Feedback, ungepruefte offen mit erhaltener Antwort', async ({
  page,
}) => {
  test.setTimeout(60_000)
  const s = await startQuiz(page)

  // Frage 1 pruefen, Reload direkt auf der gepruefte Frage
  await answer(page, s.questions[0]!, 'wrong')
  await check(page)
  await page.reload()
  await expect(page.getByText('Frage 1 von 10', { exact: true })).toBeVisible()
  await expectLocked(page)
  await expect(feedbackHeader(page)).toContainText(LABEL.de.wrong)
  await expect(section(page).locator('.fb-expl')).toContainText(expl(s.questions[0]!))
  expect((await readStored(page)).checked).toEqual([s.questions[0]!.id])

  // Frage 2 beantworten ohne Pruefen, Reload
  await nextButton(page).click()
  const q2 = s.questions[1]!
  await answer(page, q2, 'correct')
  const answerBefore = JSON.stringify((await readStored(page)).answers[q2.id])
  await page.reload()
  await expect(page.getByText('Frage 2 von 10', { exact: true })).toBeVisible()
  await expectOpen(page)
  await expectNoFeedback(page)
  await expect(checkButton(page)).toBeEnabled()
  expect(JSON.stringify((await readStored(page)).answers[q2.id])).toBe(answerBefore)
  // Antwort ist auch in der Oberflaeche wieder gesetzt
  if (q2.type === 'single') await expect(section(page).getByRole('radio', { checked: true })).toHaveCount(1)
  if (q2.type === 'multi') await expect(section(page).getByRole('checkbox', { checked: true })).toHaveCount(q2.correctOptionIds.length)
  if (q2.type === 'slider') await expect(section(page).getByRole('spinbutton')).toHaveValue(String(q2.target))

  // Zurueck zu Frage 1: weiterhin gesperrt mit Feedback; Frage 2 laesst sich nach dem Reload noch pruefen
  await prevButton(page).click()
  await expectLocked(page)
  await expect(feedback(page)).toBeVisible()
  await nextButton(page).click()
  await check(page)
  await expect(feedbackHeader(page)).toContainText(LABEL.de.correct)
})

test('AK12: Reload nach "Zu Frage n" behaelt mehrere gepruefte Fragen', async ({ page }) => {
  const s = await startQuiz(page)
  for (const n of [3, 7]) {
    await jumpTo(page, n)
    await answer(page, s.questions[n - 1]!, 'correct')
    await check(page)
  }
  await page.reload()
  await expect(page.getByText('Frage 7 von 10', { exact: true })).toBeVisible()
  await expectLocked(page)
  await jumpTo(page, 3)
  await expectLocked(page)
  await expect(feedback(page)).toBeVisible()
  await jumpTo(page, 5)
  await expectOpen(page)
  await expectNoFeedback(page)
})
