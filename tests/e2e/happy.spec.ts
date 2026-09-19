import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  expect(critical.map((v) => v.id + ': ' + v.nodes.map((n) => n.target.join(' ')).join(', '))).toEqual([])
}

/** Beantwortet die aktuell sichtbare Frage je nach Typ. */
async function answerCurrent(page: Page) {
  const section = page.locator('section.card')
  const radios = section.getByRole('radio')
  const checks = section.getByRole('checkbox')
  const slider = section.getByRole('slider')
  const selects = section.locator('select')
  if (await radios.count()) {
    await radios.first().check()
  } else if (await checks.count()) {
    await checks.nth(0).check()
    await checks.nth(1).check()
  } else if (await slider.count()) {
    await section.getByRole('spinbutton').fill('800000')
  } else if (await selects.count()) {
    const n = await selects.count()
    for (let i = 0; i < n; i++) await selects.nth(i).selectOption({ index: 1 })
  }
}

test('Happy Path: Start -> Test -> Ergebnis -> Bestleistung auf Start', async ({ page }) => {
  await page.goto('./')
  await expect(page).toHaveURL(/#\/(de|en)\/start$/)
  await page.goto('./#/de/start')
  await expect(page.getByRole('heading', { level: 1, name: 'E-Rechnung' })).toBeVisible()
  // Kein Verlauf: keine Ergebnis-Box
  await expect(page.getByText('Dein letztes Ergebnis')).toHaveCount(0)
  await expectNoAxeViolations(page)

  await page.getByRole('link', { name: /Direkt zum Test/ }).click()
  await expect(page).toHaveURL(/#\/de\/quiz$/)
  await expect(page.getByText('Frage 1 von 10', { exact: true })).toBeVisible()
  await expectNoAxeViolations(page)

  // Sprachwechsel mitten im Test behaelt Frage und Antwort
  await page.locator('section.card').getByRole('radio').first().check()
  const firstPrompt = await page.locator('section.card legend').innerText()
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page).toHaveURL(/#\/en\/quiz$/)
  await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible()
  await expect(page.locator('section.card').getByRole('radio', { checked: true })).toHaveCount(1)
  await page.getByRole('button', { name: 'Deutsch' }).click()
  await expect(page.locator('section.card legend')).toHaveText(firstPrompt)

  for (let i = 0; i < 10; i++) {
    await expect(page.getByText(`Frage ${i + 1} von 10`, { exact: true })).toBeVisible()
    await answerCurrent(page)
    if (i < 9) await page.getByRole('button', { name: 'Weiter' }).click()
  }
  // Zuordnung kommt zuletzt
  await expect(page.getByText('Zuordnung', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Abgeben', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Alle Fragen sind beantwortet')).toBeVisible()
  await dialog.getByRole('button', { name: 'Ja, abgeben' }).click()

  await expect(page).toHaveURL(/#\/de\/result$/)
  await expect(page.getByText(/von 1.000 Punkten/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Auflösung' })).toBeVisible()
  await expect(page.locator('ol.breakdown > li')).toHaveCount(10)
  // Ergebnisbild wurde gerendert
  const img = page.locator('img.card-preview')
  await expect(img).toBeVisible()
  await expect(page.getByRole('link', { name: 'Als Bild speichern' })).toHaveAttribute('href', /^blob:/)
  await expectNoAxeViolations(page)

  // Reload auf der Ergebnisseite bleibt stabil
  await page.reload()
  await expect(page.getByText(/von 1.000 Punkten/)).toBeVisible()

  // Start zeigt jetzt das letzte Ergebnis und die Bestleistung
  await page.goto('./#/de/start')
  await expect(page.getByRole('heading', { name: 'Dein letztes Ergebnis' })).toBeVisible()
  await expect(page.getByText('Persönliche Bestleistung')).toBeVisible()
  await expect(page.getByText('1 Versuch auf diesem Gerät')).toBeVisible()

  // Lokale Daten loeschen entfernt den Verlauf
  await page.goto('./#/de/privacy')
  await page.getByRole('button', { name: 'Lokale Daten löschen' }).click()
  await expect(page.getByText('Lokale Daten wurden gelöscht.')).toBeVisible()
  await page.goto('./#/de/start')
  await expect(page.getByText('Dein letztes Ergebnis')).toHaveCount(0)
})

test('Manipulierter localStorage fuehrt nicht zum Absturz', async ({ page }) => {
  await page.goto('./#/de/start')
  await page.evaluate(() => {
    localStorage.setItem('cisbox-campus.v1', '{"version":1,"attempts":[{"at":"kaputt"}],"theme":"neon"')
  })
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'E-Rechnung' })).toBeVisible()
  await expect(page.getByText('Dein letztes Ergebnis')).toHaveCount(0)
})

test('Kein horizontales Scrollen bei 360px, Lernkarten mit Grafik', async ({ page }) => {
  await page.goto('./#/de/learn')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByText('Rechtsstand:')).toBeVisible()
  for (let i = 0; i < 8; i++) await page.getByRole('button', { name: 'Weiter' }).click()
  await expect(page.getByRole('link', { name: 'Zum Test' })).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  await expectNoAxeViolations(page)
})

test('Robots und noindex sind gesetzt', async ({ page, request }) => {
  const robots = await request.get('robots.txt')
  expect(await robots.text()).toContain('Disallow: /')
  await page.goto('./')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})
