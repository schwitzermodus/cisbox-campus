# cisbox Campus

Lern- und Quiz-App für cisbox-Mitarbeitende. MVP-Thema: **E-Rechnung (Basis)**.
Live: https://schwitzermodus.github.io/cisbox-campus/

## Was die App ist

- 9 Lernkarten (überspringbar), danach ein Test mit 10 Fragen aus einem Pool von 25
  (Mix 6 Single Choice, 2 Multiple Select, 1 Schätzfrage, 1 Zuordnung)
- Kein Feedback pro Frage, Auswertung am Ende mit Auflösung und Erklärung
- Ergebniskarte (1200 x 630 PNG) zum Speichern oder Teilen
- Deutsch und Englisch, Umschalter jederzeit (auch im Test), Dark Mode
- **Kein Login, kein Name, kein Leaderboard, kein Server.** Verlauf (max. 20 Versuche) nur im `localStorage`.

## Architektur-Entscheidung: rein statisch

Die App läuft ohne Backend auf GitHub Pages. Konsequenz: Auswertung und Fragenpool inklusive Lösungen
liegen im Client-Bundle (`src/content/e-invoicing/questions.ts`). Das ist bewusst akzeptiert, weil es
keine Rangliste gibt, gegen die man betrügen könnte. Sollte später ein Leaderboard kommen, muss die
Auswertung serverseitig nachgezogen werden (`src/core/scoring.ts` ist dafür als reine Funktion geschnitten).

## Stack

Vite + React + TypeScript (strict), Vitest, Playwright, cisbox `--ds-*` Design-Tokens, Hash-Routing
(`#/de/quiz`), keine externen Skripte oder Schriften.

## Befehle

```bash
npm install
npm run dev        # http://localhost:3200/cisbox-campus/
npm run typecheck
npm test           # Vitest (Scoring, Ziehung, Verlauf, i18n, Content)
npm run e2e        # Playwright Happy-Path + Axe (360px)
npm run build      # -> dist/
```

## Struktur

```
src/core        Typen, Scoring, Ziehung (6/2/1/1), Bewertungsstufen  (rein, unit-getestet)
src/content     Lernkarten, Fragenpool, Inline-SVGs, Rechtsstand
src/i18n        UI-Texte (de/en vollständig, fr/no/vi Gerüste) + LocalizedText-Helfer
src/state       localStorage-Verlauf (cisbox-campus.v1), sessionStorage-Quiz, Theme
src/screens     Start, Learn, Quiz, Result, Privacy
src/result      Canvas-Ergebniskarte, Antwort-Beschreibungen
```

## Fachliches Review

Alle Lernkarten und Fragen stammen aus dem MVP-Plan und stehen unter fachlichem Review (Sascha).
Besonders zu prüfen: Norwegen-Fristen (Karte 7), EN 16931-1:2026 (Karte 3), die neuen Falsch-Optionen
in ei-b-017 und ei-b-019, Karte 9 (Produktzuordnung) und die Datenschutztexte.

## Deployment

Push auf `main` -> `.github/workflows/deploy.yml` baut und veröffentlicht auf GitHub Pages.
Der pre-commit-Hook (`git config core.hooksPath .githooks`) bumpt die Versionsanzeige `vYYYY-MM-DD.N`
in `index.html`; die QA prüft, dass sie sich pro Push ändert.
