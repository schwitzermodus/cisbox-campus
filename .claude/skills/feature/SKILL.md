---
name: feature
description: Fuehrt ein GitHub-Issue mit dem Agenten-Team (po, architect, developer, qa, reviewer) von der Story bis zum Pull Request. Nur auf ausdruecklichen Aufruf /feature <issue-nr>.
argument-hint: <issue-nr>
disable-model-invocation: true
---

# /feature $ARGUMENTS

Du bist die Steuerung (Orchestrator). Du rufst die Subagents aus `.claude/agents/` mit dem Agent-Tool auf (`subagent_type`: `po`, `architect`, `developer`, `qa`, `reviewer`) und gibst jedem die Issue-Nummer `$ARGUMENTS`, ab Phase 2 den Branch-Namen und die Ergebnisse der Vorgaenger mit. Du schreibst selbst keinen Produktcode und keine Tests.

Sascha ist kein Entwickler: Sag vor jeder Phase in 1 bis 2 einfachen Saetzen, was jetzt passiert, und fasse nach jeder Phase das Ergebnis kurz zusammen.

## Phase 0: Ausgangslage

1. `$ARGUMENTS` muss eine Issue-Nummer sein, sonst nachfragen und stoppen.
2. `gh issue view $ARGUMENTS --json number,title,state,labels` lesen. Geschlossenes Issue: stoppen.
3. Arbeitsverzeichnis muss sauber sein (`git status --porcelain` leer), sonst stoppen und melden. Dann `git switch main && git pull`.
4. Einstieg nach Label:
   - kein Status-Label oder `status:refinement` ohne Freigabe in diesem Gespraech -> Phase 1
   - `status:refinement` und Sascha hat die Story in diesem Gespraech freigegeben -> Phase 2
   - `status:ready` -> Phase 3
   - `status:in-progress` -> nachfragen, ob neu begonnen oder auf vorhandenem Branch weitergemacht werden soll
   - `status:review` -> melden, dass schon ein PR existiert, und stoppen

## Phase 1: Story (po)

1. Agent `po` mit Issue-Nummer aufrufen.
2. Story und offene Fragen zeigen, mit Link zum Issue.
3. **STOPP.** Sascha bitten, die Story im Issue zu pruefen. Offene Fragen muessen beantwortet sein (im Issue oder hier). Freigabe: Antwort "freigegeben" oder erneut `/feature $ARGUMENTS`, nachdem das Label `status:ready` im Issue gesetzt wurde. Hier endet der Zug. Ohne ausdrueckliche Freigabe von Sascha nie weitermachen.

## Phase 2: Freigabe festhalten

Bei Freigabe in diesem Gespraech: Antworten auf offene Fragen (falls hier gegeben) per `po` in die Story einarbeiten lassen. Dann
`gh issue edit $ARGUMENTS --add-label status:ready --remove-label status:refinement`.
Sind noch offene Fragen unbeantwortet: nicht weitermachen, nachfragen.

## Phase 3: Plan (architect)

1. `gh issue edit $ARGUMENTS --add-label status:in-progress --remove-label status:ready`
2. Agent `architect` aufrufen. Branch-Name aus dem Plan uebernehmen (`feature/$ARGUMENTS-<kurzname>`).
3. Sieht der Plan Aenderungen an `cards.ts`/`questions.ts` vor: **STOPP**, Sascha die genaue Aenderung zeigen und Zustimmung einholen. Ohne Zustimmung diese Teile streichen lassen.

## Phase 4: Umsetzung (developer)

Agent `developer` mit Issue-Nummer, Branch-Name, Plan und ggf. Saschas Zustimmung zu Fachinhalten aufrufen. Meldet er ein Problem, das den Plan sprengt: stoppen und Sascha fragen.

## Phase 5: Tests (qa)

Agent `qa` mit Issue-Nummer und Branch aufrufen. Meldet qa Fehler im Produktcode: zurueck an `developer` mit dem QA-Bericht, danach `qa` erneut (zaehlt als Nachbesserungsrunde, siehe Phase 6).

## Phase 6: Review (reviewer)

1. Agent `reviewer` mit Issue-Nummer, Branch und QA-Bericht aufrufen.
2. Kritische Findings: an `developer` (nur diese Findings), dann `qa`, dann `reviewer`. **Hoechstens 2 Nachbesserungsrunden** (inkl. Runden aus Phase 5). Danach noch kritische Findings: stoppen, Sascha Findings zeigen, keinen PR oeffnen.
3. Mittlere/geringe Findings: nicht nachbessern, im PR auffuehren.

## Phase 7: Pull Request

1. Selbst pruefen, dass `npm run typecheck`, `npm run lint`, `npm test`, `npm run e2e` gruen sind (letzter QA-Lauf nach dem letzten Commit genuegt, sonst neu laufen lassen).
2. `git push -u origin <branch>`
3. `gh pr create --base main --head <branch> --title "<Issue-Titel>" --body-file -` mit:

```
Closes #$ARGUMENTS

## Zusammenfassung je Rolle
- **po:** Story in einem Satz, Anzahl Akzeptanzkriterien
- **architect:** Kern des Plans, Risiken
- **developer:** was umgesetzt wurde, Abweichungen vom Plan
- **qa:** Akzeptanzkriterium -> Test -> Ergebnis; typecheck/lint/test/e2e
- **reviewer:** Urteil, offene mittlere/geringe Findings, Anzahl Nachbesserungsrunden

## Manuell pruefen
<aus QA-Bericht, oder "nichts">

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

4. `gh issue edit $ARGUMENTS --add-label status:review --remove-label status:in-progress`
5. Sascha PR-Link geben und erklaeren: CI abwarten, App pruefen, dann selbst mergen. Nie selbst mergen.

## Grundregeln

- Nie auf `main` committen oder pushen; nie mergen.
- Ehrlich berichten: fehlgeschlagene Checks, uebersprungene Schritte und offene Punkte immer nennen.
