# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

cisbox Campus: static learning/quiz app for cisbox employees (Vite + React 19 + TypeScript strict). Courses grouped into segments; each course = 9 learn cards + a quiz of 10 questions drawn from a pool of 25. No backend, no login, no leaderboard: hosted on GitHub Pages (`https://schwitzermodus.github.io/cisbox-campus/`). README, code comments, and commit messages are in German (comments use ae/oe/ue instead of umlauts).

## Commands

```bash
npm run dev          # http://localhost:3200/cisbox-campus/ (strictPort)
npm run typecheck    # tsc -b --noEmit
npm test             # Vitest, tests/unit/**/*.test.ts, node env
npx vitest run tests/unit/scoring.test.ts      # single unit test file
npx vitest run -t "name of test"               # single test by name
npm run e2e          # Playwright (chromium, 360x740 viewport, axe checks); starts its own vite on :3201
npx playwright test tests/e2e/happy.spec.ts -g "name"   # single e2e test
npm run lint         # oxlint --deny-warnings (.oxlintrc.json): warnings fail too
npm run build        # tsc -b && vite build -> dist/
```

CI (`.github/workflows/qa.yml`) runs typecheck, lint, unit, build, e2e on push/PR to `main`.

## Working rules (all agents)

- Always work on your own branch (e.g. `feat/...`, `fix/...`, `chore/...`), one branch per task. Never commit or push directly to `main`; changes reach `main` only via pull request.
- Before opening or updating a PR, run locally and make sure all pass: `npm run typecheck`, `npm run lint`, `npm test`, `npm run e2e`.
- Subject-matter content (`src/content/courses/*/cards.ts`, `questions.ts`) may only be changed after asking first: Sascha reviews it for accuracy. Structural/technical changes elsewhere don't need this.
- Shared agent config goes in `.claude/` (committed); personal settings stay in `.claude/settings.local.json` (gitignored). `.claude/settings.json` denies force pushes, pushes to `main`, `git reset --hard` and `gh pr merge`: only Sascha merges PRs. `main` is also branch-protected on GitHub (PR + green QA required, admins included).

## Agent team (`/feature <issue-nr>`)

Subagents in `.claude/agents/`, orchestrated by the skill `.claude/skills/feature/SKILL.md`:

1. `po` (read + `gh issue`): turns the issue into a user story (Als/moechte/damit), testable acceptance criteria, "Design" section, open questions; never invents subject-matter content. Label `status:refinement`. **Stops for Sascha's approval.**
2. `architect` (read + `gh issue comment`): implementation plan as issue comment (files, steps, tests per criterion, risks, branch `feature/<nr>-<kurzname>`). Label `status:in-progress`.
3. `developer` (edit): implements the plan on that branch, commits, never pushes.
4. `qa` (edit `tests/` only): one test per acceptance criterion, runs typecheck/lint/test/e2e, reports per criterion.
5. `reviewer` (read-only): findings by severity. Critical findings go back to developer, max. 2 rounds.

Then the orchestrator pushes, opens a PR with `Closes #<nr>` and a summary per role, and sets `status:review`. Labels on the issue show the current phase (`status:refinement` -> `status:ready` -> `status:in-progress` -> `status:review`).

### Before `/feature`: `/next`

Skill `.claude/skills/next/SKILL.md` finds the next issue so Sascha only sets direction and goals:

- `strategist` (read + `gh issue`/`gh label`): keeps goals in the issue labelled `strategie` ("Ziele und Richtung", editable in the browser, no repo file), ranks the backlog against them (labels `prio:1..3`), recommends the next issue, returns questions if context is missing.
- `ideation` (read + `gh issue create`): proposes 3-5 small ideas tied to the goals, creates issues only for ideas Sascha approved. Never invents subject-matter content.

Subagents cannot ask Sascha directly: they return a "Rueckfragen" section and the orchestrator asks. `/next` ends by starting `/feature <nr>` after Sascha agrees.

## Versioning / deploy

- The app version is generated at build time in `vite.config.ts` as `vYYYY-MM-DD-<short commit hash>` (UTC build date; hash from `GITHUB_SHA` in CI, else `git rev-parse`, fallback `dev`) and injected as the global `__APP_VERSION__` (declared in `src/env.d.ts`). The footer shows it, so the live version is visible on the page. No hook, no version file to bump: nothing to conflict between parallel branches.
- Merging/pushing to `main` deploys via `.github/workflows/deploy.yml`.

## Architecture

- `src/core`: pure, unit-tested logic: question types, `scoring.ts` (kept pure so it can move server-side if a leaderboard ever appears), `draw.ts` (draws 10 of 25 with fixed mix 4 single choice / 3 multiple select / 2 estimate / 1 matching, interleaved), `rating.ts` (rating tiers, 75 % pass threshold).
- `src/content`: `registry.ts` (segments + course list), `types.ts` (`SEGMENT_IDS`, `COURSE_IDS`, `Course`, `LearnCard`). Each course lives in `src/content/courses/<id>-<slug>/` with `cards.ts`, `questions.ts`, `figures.ts` (map of SVG figure components referenced by `LearnCard.figure`), `index.ts` exporting `course`. Solutions are shipped in the client bundle by design.
- `src/app/router.ts`: hash routing `#/<locale>/<courseId>/<screen>` (screens `overview|learn|quiz|result`; global `courses|privacy`). Invalid/legacy hashes parse to `null`.
- `src/state`: `localHistory.ts` (localStorage `cisbox-campus.v2`, migrates from `v1`, max 20 attempts), `quizSession.ts` and `resultStore.ts` (sessionStorage, survive reload). Storage access is wrapped so missing storage doesn't crash.
- `src/i18n`: UI strings in `messages.<locale>.json` (de/en complete, fr/no/vi scaffolds with empty values falling back to de). `translate()` for UI keys, `lt()` for `LocalizedText` content.
- `src/result`: canvas-rendered 1200x630 PNG result card.
- Styling via cisbox `--ds-*` design tokens (`src/styles/tokens-*.css`); no external scripts/fonts. Production build injects a strict CSP `<meta>` (see `vite.config.ts`), so no inline styles/scripts that break `style-src 'self'` in prod.

## Adding a course

1. Create `src/content/courses/<id>-<slug>/` with `cards.ts` (9 cards), `questions.ts` (25 questions: 15 single / 5 multiple select / 3 estimate / 2 matching; multiple select always 3 of 5 correct), `figures.ts`, `index.ts`.
2. Add the id to `COURSE_IDS` in `src/content/types.ts` and the course to `COURSES` in `src/content/registry.ts`.
3. All question IDs must start with the course's `idPrefix` (enforced by `tests/unit/content.test.ts`).
4. New i18n keys must exist in all five message files (parity test in `tests/unit/i18n.test.ts`).

## Content review

All cards/questions are under subject-matter review by Sascha; courses 101 and 202 are not yet reviewed (202: be careful with version-dependent ZUGFeRD/Factur-X/Peppol details). `docs/LEHRPLAN.md` is a draft for a new Accounts Payable curriculum (Class > Etappe > Lektion, with per-stage knowledge checks and immediate feedback) that is **not yet implemented** in the app.
