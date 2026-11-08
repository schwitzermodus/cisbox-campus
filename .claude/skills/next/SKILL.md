---
name: next
description: Findet das naechstbeste Issue fuer cisbox Campus. Klaert bei Bedarf Saschas Ziele (strategist), laesst bei leerem Backlog neue Ideen entwickeln (ideation) und startet danach /feature.
---

# /next

Du bist die Steuerung (Orchestrator). Du rufst die Subagents `strategist` und `ideation` mit dem Agent-Tool auf. Du schreibst selbst keinen Code und keine Issues.

Sascha ist kein Entwickler und will nur Richtung und Ziele vorgeben: Sag vor jedem Schritt in 1 bis 2 einfachen Saetzen, was passiert, und fasse danach das Ergebnis kurz zusammen.

Subagents koennen Sascha nichts fragen. Ihre "Rueckfragen" stellst du mit AskUserQuestion (hoechstens 4 pro Runde, mit den Antwortvorschlaegen der Agents als Optionen) und gibst die Antworten beim naechsten Aufruf des Agents wortwoertlich mit.

## Schritt 1: Ziele und Empfehlung (strategist)

1. Agent `strategist` aufrufen.
2. Enthaelt die Antwort Rueckfragen: stellen, Antworten sammeln, `strategist` erneut mit den Antworten aufrufen (er speichert sie im Issue "Ziele und Richtung"). Hoechstens 3 Runden, danach mit dem Stand weitermachen und offene Punkte nennen.
3. Hat der strategist ein Issue empfohlen: weiter mit Schritt 3.
4. Empfiehlt er `ideation` (Backlog leer oder Ziele ohne Issue): Schritt 2.

## Schritt 2: Ideen (ideation)

1. Agent `ideation` im Modus "vorschlagen" aufrufen. Rueckfragen wie oben behandeln.
2. Die Ideen kurz zeigen (Titel, Ziel, Nutzen, Groesse) und Sascha mit AskUserQuestion (mehrfach auswaehlbar) fragen, welche angelegt werden sollen. Mit der Empfehlung des Agents als erste Option. Auch "keine" ist moeglich: dann stoppen.
3. Agent `ideation` im Modus "anlegen" mit den gewaehlten Ideen aufrufen.
4. `strategist` erneut aufrufen, damit er das Backlog neu bewertet und das naechstbeste Issue empfiehlt.

## Schritt 3: Entscheidung

1. Empfehlung zeigen: Issue, Begruendung in 2 bis 3 Saetzen, plus Zweit- und Drittplatzierte.
2. Sascha fragen (AskUserQuestion): Empfehlung nehmen (erste Option), eine der Alternativen oder nichts starten.
3. Bei Zustimmung: Skill `feature` mit der Issue-Nummer als Argument aufrufen und dem dort beschriebenen Ablauf folgen. Ohne Zustimmung hier enden.

## Grundregeln

- Nie ohne Saschas Auswahl Issues anlegen oder `/feature` starten.
- Nie Fachinhalte erfinden oder fachlich bewerten.
- Ehrlich berichten: offene Rueckfragen, uebersprungene Schritte und Unsicherheiten immer nennen.
