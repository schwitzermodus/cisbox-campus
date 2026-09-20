# cisbox Campus

Lern- und Quiz-App für cisbox-Mitarbeitende, gegliedert in Segmente mit nummerierten Kursen.
Live: https://schwitzermodus.github.io/cisbox-campus/

## Was die App ist

- **Kursübersicht** nach Segmenten: Segment „Rechnungen" (Kurs 101) und Segment „E-Rechnung" (Kurs 201, 202).
  Reihenfolge ist nur eine Empfehlung, keine Sperre.
- Jeder Kurs: 9 Lernkarten (überspringbar), danach ein Test mit 10 Fragen aus einem Pool von 25
  (Mix 4 Single Choice, 3 Multiple Select, 2 Schätzfragen, 1 Zuordnung, Typen verwoben)
- Kein Feedback pro Frage, Auswertung am Ende mit Auflösung und Erklärung
- Pro Gerät gespeichert: Lernteil erledigt, bestes Ergebnis je Kurs, grüner Haken beim Test ab 75 %
- Ergebniskarte (1200 x 630 PNG) zum Speichern oder Teilen
- Deutsch und Englisch, Umschalter jederzeit (auch im Test), Dark Mode
- **Kein Login, kein Name, kein Leaderboard, kein Server.** Verlauf (max. 20 Versuche) nur im `localStorage`.

## Architektur-Entscheidung: rein statisch

Die App läuft ohne Backend auf GitHub Pages. Konsequenz: Auswertung und Fragenpools inklusive Lösungen
liegen im Client-Bundle (`src/content/courses/*/questions.ts`). Das ist bewusst akzeptiert, weil es
keine Rangliste gibt, gegen die man betrügen könnte. Sollte später ein Leaderboard kommen, muss die
Auswertung serverseitig nachgezogen werden (`src/core/scoring.ts` ist dafür als reine Funktion geschnitten).

## Stack

Vite + React + TypeScript (strict), Vitest, Playwright, cisbox `--ds-*` Design-Tokens, Hash-Routing
(`#/de/201/quiz`), keine externen Skripte oder Schriften.

## Befehle

```bash
npm install
npm run dev        # http://localhost:3200/cisbox-campus/
npm run typecheck
npm test           # Vitest (Scoring, Ziehung, Verlauf/Migration, Sessions, Routing, Content)
npm run e2e        # Playwright Happy-Path + Axe (360px)
npm run build      # -> dist/
```

## Struktur

```
src/core        Typen, Scoring, Ziehung/Verwebung (4/3/2/1), Bewertungsstufen, Bestehensgrenze  (rein, unit-getestet)
src/content     Registry (Segmente + Kurse), je Kurs: cards.ts, questions.ts, figures.ts, svgs/
src/i18n        UI-Texte (de/en vollständig, fr/no/vi Gerüste) + LocalizedText-Helfer
src/state       localStorage-Verlauf v2 mit v1-Migration, sessionStorage-Quiz mit Kursbezug, Theme
src/screens     Courses (Uebersicht), CourseOverview, Learn, Quiz, Result, Privacy
src/result      Canvas-Ergebniskarte, Antwort-Beschreibungen
```

### Kursstruktur

Ein neuer Kurs braucht ein Verzeichnis unter `src/content/courses/<id>-<slug>/` mit `cards.ts` (9 Karten),
`questions.ts` (25 Fragen: 15/5/3/2, Multiple Select immer 3 von 5 richtig), `figures.ts` (Grafiken-Map)
und `index.ts` (das `Course`-Objekt), danach Eintrag in `src/content/registry.ts`. Frage-IDs brauchen ein
kursspezifisches Präfix, das über `Course.idPrefix` erzwungen wird (Test: `tests/unit/content.test.ts`).
Neue i18n-Keys müssen in allen fünf Sprachdateien stehen, sonst schlägt der Paritätstest fehl.

## Fachliches Review

Alle Lernkarten und Fragen stehen unter fachlichem Review (Sascha). Besonders zu prüfen:

- **Kurs 201:** Norwegen-Fristen (Karte 7), EN 16931-1:2026 (Karte 3), die Falsch-Optionen in
  ei-b-017 und ei-b-019, Karte 9 (Produktzuordnung).
- **Kurs 101 und 202 (neu):** vollständiges fachliches Review steht noch aus. Bei Kurs 202 gilt
  besondere Vorsicht bei versionsabhängigen Details (ZUGFeRD/Factur-X-Profile, Peppol-Spezifika).
- Datenschutztexte.

## Deployment

Push auf `main` -> `.github/workflows/deploy.yml` baut und veröffentlicht auf GitHub Pages.
Der pre-commit-Hook (`git config core.hooksPath .githooks`) bumpt die Versionsanzeige `vYYYY-MM-DD.N`
in `index.html`; die QA prüft, dass sie sich pro Push ändert.
