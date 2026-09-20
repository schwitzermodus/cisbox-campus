import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/** Kurskachel eindeutig ueber die Nummer-Badge finden (Fliesstext kann dieselbe Zahl in Hinweisen erwaehnen). */
function courseTile(page: Page, id: string) {
  return page.locator('a.course-card').filter({ has: page.locator('.course-card-id', { hasText: new RegExp('^' + id + '$') }) })
}

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

test('Happy Path Kurs 201: Uebersicht -> Kurs -> Test -> Ergebnis -> Bestleistung', async ({ page }) => {
  await page.goto('./')
  await expect(page).toHaveURL(/#\/(de|en)\/courses$/)
  await page.goto('./#/de/courses')
  await expect(page.getByRole('heading', { level: 1, name: 'cisbox Campus' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Rechnungen', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'E-Rechnung', exact: true })).toBeVisible()
  await expectNoAxeViolations(page)

  await page.goto('./#/de/201')
  await expect(page).toHaveURL(/#\/de\/201\/overview$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByText(/Rechtsstand/)).toBeVisible()
  await expect(page.getByText('Dein letztes Ergebnis')).toHaveCount(0)
  await expectNoAxeViolations(page)

  await page.getByRole('link', { name: /Direkt zum Test/ }).click()
  await expect(page).toHaveURL(/#\/de\/201\/quiz$/)
  await expect(page.getByText('Frage 1 von 10', { exact: true })).toBeVisible()
  await expectNoAxeViolations(page)

  // Sprachwechsel mitten im Test behaelt Frage, Antwort UND Kursbezug
  await page.locator('section.card').getByRole('radio').first().check()
  const firstPrompt = await page.locator('section.card legend').innerText()
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page).toHaveURL(/#\/en\/201\/quiz$/)
  await expect(page.getByText('Question 1 of 10', { exact: true })).toBeVisible()
  await expect(page.locator('section.card').getByRole('radio', { checked: true })).toHaveCount(1)
  await page.getByRole('button', { name: 'Deutsch' }).click()
  await expect(page.locator('section.card legend')).toHaveText(firstPrompt)

  const seenTypes: string[] = []
  for (let i = 0; i < 10; i++) {
    await expect(page.getByText(`Frage ${i + 1} von 10`, { exact: true })).toBeVisible()
    seenTypes.push(await page.locator('section.card .type-badge').innerText())
    await answerCurrent(page)
    if (i < 9) await page.getByRole('button', { name: 'Weiter' }).click()
  }
  // Verwoben: nie zwei gleiche Fragetypen hintereinander
  expect(seenTypes.slice(1).filter((x, k) => x === seenTypes[k])).toEqual([])
  expect(seenTypes.filter((x) => x === 'Zuordnung')).toHaveLength(1)
  expect(seenTypes.filter((x) => x === 'Schätzfrage')).toHaveLength(2)

  await page.getByRole('button', { name: 'Abgeben', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Alle Fragen sind beantwortet')).toBeVisible()
  await dialog.getByRole('button', { name: 'Ja, abgeben' }).click()

  await expect(page).toHaveURL(/#\/de\/201\/result$/)
  await expect(page.getByText(/von 1.000 Punkten/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Auflösung' })).toBeVisible()
  await expect(page.locator('ol.breakdown > li')).toHaveCount(10)
  const img = page.locator('img.card-preview')
  await expect(img).toBeVisible()
  await expect(page.getByRole('link', { name: 'Als Bild speichern' })).toHaveAttribute('href', /^blob:/)
  await expectNoAxeViolations(page)

  // Reload auf der Ergebnisseite bleibt stabil
  await page.reload()
  await expect(page.getByText(/von 1.000 Punkten/)).toBeVisible()

  // Kursseite zeigt jetzt das letzte Ergebnis und die Bestleistung
  await page.goto('./#/de/201')
  await expect(page.getByRole('heading', { name: 'Dein letztes Ergebnis' })).toBeVisible()
  await expect(page.getByText('Persönliche Bestleistung')).toBeVisible()

  // Uebersicht zeigt Fortschritt an der Kachel von Kurs 201
  await page.goto('./#/de/courses')
  await expect(courseTile(page, '201').getByText('Beste', { exact: false })).toBeVisible()

  // Lokale Daten loeschen entfernt den Verlauf
  await page.goto('./#/de/privacy')
  await page.getByRole('button', { name: 'Lokale Daten löschen' }).click()
  await expect(page.getByText('Lokale Daten wurden gelöscht.')).toBeVisible()
  await page.goto('./#/de/201')
  await expect(page.getByText('Dein letztes Ergebnis')).toHaveCount(0)
})

test('Kursuebersicht zeigt drei Kacheln in zwei Segmenten', async ({ page }) => {
  await page.goto('./#/de/courses')
  await expect(page.getByRole('heading', { name: 'Rechnungen', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'E-Rechnung', exact: true })).toBeVisible()
  await expect(page.locator('a.course-card')).toHaveCount(3)
  await expect(courseTile(page, '101')).toBeVisible()
  await expect(courseTile(page, '201')).toBeVisible()
  await expect(courseTile(page, '202')).toBeVisible()
  await expectNoAxeViolations(page)
})

test('Gruener Haken erscheint erst ab 75 Prozent', async ({ page }) => {
  await page.goto('./#/de/courses')
  await page.evaluate(() => {
    localStorage.setItem(
      'cisbox-campus.v2',
      JSON.stringify({
        version: 2,
        attempts: [{ at: 1, courseId: '101', difficulty: 'basic', score: 700, maxScore: 1000, percent: 70, durationMs: 1000 }],
        progress: { '101': { bestPercent: 70 } },
      }),
    )
  })
  await page.reload()
  await expect(courseTile(page, '101').locator('li[data-done="true"]', { hasText: 'Test bestanden' })).toHaveCount(0)

  await page.evaluate(() => {
    const h = JSON.parse(localStorage.getItem('cisbox-campus.v2')!)
    h.progress['101'].bestPercent = 80
    localStorage.setItem('cisbox-campus.v2', JSON.stringify(h))
  })
  await page.reload()
  await expect(courseTile(page, '101').locator('li[data-done="true"]', { hasText: 'Test bestanden' })).toHaveCount(1)
})

test('Angefangener Test in einem anderen Kurs wird nicht still verworfen', async ({ page }) => {
  await page.goto('./#/de/101/quiz')
  await expect(page.getByText('Frage 1 von 10', { exact: true })).toBeVisible()
  await answerCurrent(page)
  await page.getByRole('button', { name: 'Weiter' }).click()
  await expect(page.getByText('Frage 2 von 10', { exact: true })).toBeVisible()

  await page.goto('./#/de/201/quiz')
  await expect(page.getByRole('heading', { name: 'Anderer Test läuft noch' })).toBeVisible()
  await page.getByRole('link', { name: 'Anderen Test fortsetzen' }).click()
  await expect(page).toHaveURL(/#\/de\/101\/quiz$/)
  await expect(page.getByText('Frage 2 von 10', { exact: true })).toBeVisible()

  await page.goto('./#/de/201/quiz')
  await page.getByRole('button', { name: 'Diesen Test starten' }).click()
  await expect(page.getByText('Frage 1 von 10', { exact: true })).toBeVisible()
})

test('Alte v1-Daten werden beim ersten Laden zu Kurs 201 migriert', async ({ page }) => {
  // addInitScript laeuft VOR jedem Seitenskript, also bevor die App ueberhaupt einen eigenen
  // v2-Eintrag anlegen kann. Das bildet einen echten Erstbesuch mit vorhandenen Altdaten nach;
  // ein page.goto() gefolgt von einem spaeteren evaluate() waere zu spaet, weil die App beim
  // ersten Laden bereits einen leeren v2-Eintrag (z.B. fuer preferredLocale) schreibt und
  // dieser danach Vorrang vor v1 hat.
  await page.addInitScript(() => {
    localStorage.setItem(
      'cisbox-campus.v1',
      JSON.stringify({
        version: 1,
        attempts: [{ at: 1, topic: 'e-invoicing', difficulty: 'basic', score: 900, maxScore: 1000, percent: 90, durationMs: 1000 }],
        learnCardsSeen: true,
      }),
    )
  })
  await page.goto('./#/de/courses')
  const tile201 = courseTile(page, '201')
  await expect(tile201.locator('li[data-done="true"]')).toHaveCount(2)
  await expect(tile201.getByText('Beste 90 %')).toBeVisible()
})

test('Manipulierter localStorage fuehrt nicht zum Absturz', async ({ page }) => {
  await page.goto('./#/de/courses')
  await page.evaluate(() => {
    localStorage.setItem('cisbox-campus.v2', '{"version":2,"attempts":[{"at":"kaputt"}]')
  })
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'cisbox Campus' })).toBeVisible()
  await expect(page.getByText('Dein letztes Ergebnis')).toHaveCount(0)
})

test('Kein horizontales Scrollen bei 360px, Lernkarten mit Grafik', async ({ page }) => {
  for (const courseId of ['101', '201', '202']) {
    await page.goto(`./#/de/${courseId}/learn`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // Rechtsstand steht NICHT auf der Lernkarte, nur auf der Kursseite
    await expect(page.getByText(/Rechtsstand/)).toHaveCount(0)
    expect(await page.locator('.learn-text .learn-body').count()).toBeGreaterThanOrEqual(2)
    for (let i = 0; i < 8; i++) await page.getByRole('button', { name: 'Weiter' }).click()
    await expect(page.getByRole('link', { name: 'Zum Test' })).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, courseId).toBeLessThanOrEqual(0)
    await expectNoAxeViolations(page)
  }
})

test('Robots und noindex sind gesetzt', async ({ page, request }) => {
  const robots = await request.get('robots.txt')
  expect(await robots.text()).toContain('Disallow: /')
  await page.goto('./')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})
