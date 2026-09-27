# cisbox Campus — Lehrplan Accounts Payable

Stand: 27.09.2026 · Status: **Entwurf zum Review durch Sascha** · noch nicht in der App umgesetzt

Quellen: `campus_ap_grundlagen.md` (Lerndialog, Module 1 bis 6, Lektionen 1.1 bis 1.3, Backlog) und die bestehenden Kurse 101 (Rechnungen), 201 (E-Rechnung Grundlagen), 202 (E-Rechnung Vertiefung).

---

## 1. Ziel

Mitarbeitende ohne jedes Vorwissen werden Schritt für Schritt zu sehr fortgeschrittenen Fachleuten für Accounts Payable (AP, Kreditorenbuchhaltung). Der Weg deckt fünf Wissensarten ab:

| Wissensart | Beispiel |
|---|---|
| Grundwissen | Was ist eine Rechnung, was ist AP, wie läuft der Prozess |
| Hintergrund | Buchhaltung, Steuer, Kontrollen, warum Prozesse so sind, wie sie sind |
| Historie | Von Papier und Lochkarte über EDI und OCR bis zur KI |
| Technik | Capture, OCR, KI, Workflows, Schnittstellen, Datenflüsse |
| Aktuelles | E-Rechnungspflichten, ViDA, KI-Entwicklungen, Markt (nach dem MVP) |

**MVP:** höchstens fünf Classes aus zwei Bereichen, mit steigendem Schwierigkeitsgrad. Alles darüber hinaus steht in der Roadmap (Abschnitt 5) und wird erst später gebaut.

---

## 2. Neue Struktur einer Class

Die heutige Struktur (ein Kurs = neun Lernkarten + ein Test) reicht für das Ziel nicht. Die Didaktik-Regeln aus der Quelldatei verlangen kleinere Lerneinheiten, Zwischenchecks und ein Glossar. Neue Gliederung:

```
Class  (z.B. AP 101, 45 bis 60 Minuten)
 ├─ Steckbrief: Bereich, Stufe, Lernziele, empfohlene Voraussetzung, Dauer
 ├─ Etappe 1  (2 bis 3 Lektionen)
 │    ├─ Lektion 1.1  (5 bis 10 Min.)
 │    │    ├─ Inhalt: 2 bis 4 Karten, optional Grafik
 │    │    ├─ Vertiefung (optional, ausklappbar)
 │    │    └─ Produkt-Relevanz: warum das für Produkt, Vertrieb, Beratung zählt
 │    ├─ Lektion 1.2 ...
 │    ├─ Wissenscheck: 3 bis 5 Fragen, Feedback sofort nach jeder Frage
 │    └─ Glossar der Etappe: neue Abkürzungen und Fachbegriffe
 ├─ Etappe 2 ...
 └─ Abschlusstest: 10 Fragen aus einem eigenen Pool (heutiger Mechanismus, Bestehen ab 75 %)
```

**Regeln für alle Classes** (aus der Quelldatei übernommen):

- Jede Abkürzung wird beim ersten Auftreten ausgeschrieben und auf Deutsch erklärt.
- Jede Etappe endet mit Wissenscheck und Glossar. Eine Etappe gilt als erreicht, wenn der Wissenscheck bestanden ist.
- Jede Lektion hat einen Abschnitt „Produkt-Relevanz".
- Fragen der Quelldatei sind Freitextfragen. Die App kann Freitext ohne Server nicht auswerten, deshalb werden sie in die vorhandenen Typen umgebaut (Single Choice, Multiple Select, Schätzfrage, Zuordnung). Beispiel siehe Abschnitt 6.

**Zwei Testarten mit verschiedenem Zweck:**

| | Wissenscheck | Abschlusstest |
|---|---|---|
| Zeitpunkt | Ende jeder Etappe | Ende der Class |
| Umfang | 3 bis 5 Fragen | 10 aus 20 bis 25 |
| Feedback | sofort, mit Erklärung | erst am Ende (wie heute) |
| Zweck | Lernen festigen | Können nachweisen |
| Ergebnis | Etappe erreicht | Class bestanden, grüner Haken, Ergebniskarte |

**Stufen:** Die Hunderterstelle der Class-Nummer ist die Stufe.

| Stufe | Nummer | Voraussetzung | Fragen-Schwierigkeit im Code |
|---|---|---|---|
| 1 Einstieg | 1xx | keine | `basic` |
| 2 Aufbau | 2xx | Stufe 1 | `intermediate` |
| 3 Fortgeschritten | 3xx | Stufe 2 | `advanced` |
| 4 Experte | 4xx | Stufe 3 | neu, nach dem MVP |

---

## 3. MVP: fünf Classes in zwei Bereichen

| Class | Bereich | Stufe | Titel | Basis |
|---|---|---|---|---|
| **AP 101** | Prozess & Business | 1 | Grundlagen der Kreditorenbuchhaltung | neu, übernimmt alten Kurs 101 und Datei 1.1 bis 1.2 |
| **AP 201** | Prozess & Business | 2 | Prozess, Kennzahlen & Wirtschaftlichkeit | neu, Datei 1.3, Vertiefung 1.3, Backlog 1.4 |
| **TC 201** | Technologie & Compliance | 2 | E-Rechnung: Grundlagen | Umbau des bestehenden Kurses 201 |
| **TC 202** | Technologie & Compliance | 2 | Invoice Capture, OCR & KI | neu, Datei Modul 2 |
| **TC 301** | Technologie & Compliance | 3 | AP im System-Ökosystem | neu, Datei Modul 3 und Backlog „System-Ökosystem" |

Empfohlener Lernweg: **AP 101 → AP 201 und TC 201 (parallel möglich) → TC 202 → TC 301**. Wie bisher nur Empfehlung, keine Sperre.

Der bestehende Kurs 202 (E-Rechnung Vertiefung) ist fertig, passt aber nicht mehr ins MVP-Budget von fünf. Er wird als erste Class nach dem MVP übernommen (TC 302).

---

### AP 101 — Grundlagen der Kreditorenbuchhaltung

Stufe 1 · keine Voraussetzung · ca. 50 Minuten · 6 Lektionen in 2 Etappen

**Lernziele:** Nach dieser Class kannst du erklären, was eine Rechnung ist und wozu sie dient, wie ein Unternehmen einkauft und bezahlt, was AP und AP Automation bedeuten, und die fünf Phasen des AP-Prozesses benennen.

**Etappe 1: Rechnung und Buchhaltung**

| Lektion | Inhalt | Wissensart | Quelle |
|---|---|---|---|
| 1.1 Wie ein Unternehmen einkauft und bezahlt | Einkauf, Lieferant, Bestellung, Verbindlichkeit; Kreditor und Debitor | Grundwissen | neu |
| 1.2 Die Rechnung | Zweck, Pflichtangaben, Kleinbetragsrechnung, Abgrenzung zu Angebot, Auftragsbestätigung, Lieferschein | Grundwissen | alter Kurs 101, Karten 1 bis 4 |
| 1.3 Buchhaltung in zehn Minuten | doppelte Buchführung, Soll und Haben, Konto, Vorsteuer, Kontierung | Hintergrund | alter Kurs 101, Karte 8, erweitert |

Wissenscheck Etappe 1 · Glossar u.a.: Kreditor, Debitor, Verbindlichkeit, Vorsteuer, Kontierung, Sachkonto, Kostenstelle

**Etappe 2: Der AP-Prozess**

| Lektion | Inhalt | Wissensart | Quelle |
|---|---|---|---|
| 1.4 Was ist AP Automation | manueller Prozess und seine Probleme, was Automation verbessert; Exkurs ERP | Grundwissen | Datei 1.1 |
| 1.5 Der AP-Prozess in fünf Phasen | Eingang, Erfassung, Prüfung mit 3-Way-Matching, Genehmigung, Zahlung und Buchung | Grundwissen | Datei 1.2, alter Kurs 101 Karten 5 bis 6 |
| 1.6 Eine kurze Geschichte der Rechnungsverarbeitung | Papier und Kontenbücher, Lochkarte und Großrechner, EDI, ERP, Scannen und OCR, E-Rechnung, KI | Historie | neu, Jahreszahlen `[prüfen]` |

Wissenscheck Etappe 2 · Glossar: AP, ERP, OCR, EDI, PO, KI, 3-Way-Matching, Approval Workflow, Invoice Capture, Lieferantenportal

---

### AP 201 — Prozess, Kennzahlen & Wirtschaftlichkeit

Stufe 2 · empfohlen nach AP 101 · ca. 60 Minuten · 7 Lektionen in 3 Etappen

**Lernziele:** Du kannst Prüf- und Freigabelogik im Detail beschreiben, den Nutzen von AP Automation mit Kennzahlen belegen, Risiken im Zahlungsprozess benennen und typische Fehler bei der Einführung vermeiden.

**Etappe 1: Prozesssteuerung**

| Lektion | Inhalt | Quelle |
|---|---|---|
| 2.1 Matching im Detail | 2-, 3- und 4-Way-Matching, Toleranzen, Rechnungen ohne Bestellbezug (Non-PO) | Datei 1.2, vertieft |
| 2.2 Genehmigungsworkflows | Freigaberegeln, Wertgrenzen, Vier-Augen-Prinzip, Vertretung, Eskalation | Datei 1.2, Vertiefung 1.3 |

**Etappe 2: Wirtschaftlichkeit**

| Lektion | Inhalt | Quelle |
|---|---|---|
| 2.3 Kosten und ROI | Kosten pro Rechnung manuell und automatisiert, Beispielrechnung, Amortisation | Datei 1.3 `[prüfen]` |
| 2.4 Durchlaufzeit und KPIs | Cycle Time, Zeitfresser im manuellen Prozess, Dunkelverarbeitungsquote, Kosten pro Rechnung | Datei Vertiefung 1.3 `[prüfen]` |
| 2.5 Skonto, Zahlungslauf und Liquidität | Skonto richtig nutzen, Zahlungsvorschlag, Cashflow, DPO (Days Payable Outstanding) | Datei 1.3, erweitert |

**Etappe 3: Sicherheit und Einführung**

| Lektion | Inhalt | Quelle |
|---|---|---|
| 2.6 Risiken und Kontrollen | Doppelzahlung, Scheinrechnung, geänderte Bankdaten, Audit Trail, IKS (internes Kontrollsystem) | neu |
| 2.7 Einführung von AP Automation | typische Fehler: Stammdaten, Prozess nicht vorher bereinigt, fehlende Akzeptanz, zu viele Ausnahmen | Datei Backlog 1.4 |

Glossare u.a.: ROI, KPI, Cycle Time, Skonto, Early Payment Discount, Audit Trail, Cashflow, Eskalationsregel, DPO, IKS, Non-PO

---

### TC 201 — E-Rechnung: Grundlagen

Stufe 2 · empfohlen nach AP 101 · ca. 45 Minuten · 6 Lektionen in 2 Etappen

Inhaltlich der bestehende Kurs 201. Die neun Karten und 25 Fragen werden auf Lektionen verteilt, um Wissenschecks, Glossar und Produkt-Relevanz ergänzt. Die offenen Review-Punkte aus Kurs 201 bleiben bestehen.

| Etappe | Lektionen |
|---|---|
| 1 Begriff und Formate | Was eine E-Rechnung ist und warum es sie gibt · EN 16931 · XRechnung, ZUGFeRD, Factur-X |
| 2 Transport und Pflichten | Peppol · Fristen in Deutschland · Europa und ViDA |

---

### TC 202 — Invoice Capture, OCR & KI

Stufe 2 · empfohlen nach AP 101 · ca. 55 Minuten · 6 Lektionen in 2 Etappen

**Lernziele:** Du verstehst, wie aus einer Rechnung auf Papier oder als PDF strukturierte Daten werden, wo die Grenzen von OCR liegen, was KI daran ändert und warum Capture trotz E-Rechnung gebraucht wird.

| Etappe | Lektion | Inhalt |
|---|---|---|
| 1 Erfassung | 3.1 Eingangskanäle | Post und Scan, E-Mail-Postfach, Lieferantenportal, EDI, E-Rechnung |
| | 3.2 OCR | wie Texterkennung funktioniert, typische Fehlerquellen |
| | 3.3 Von Vorlagen zu KI | vorlagenbasiert, Machine Learning, LLM (Large Language Model); Konfidenzwerte |
| 2 Intelligenz und Workflow | 3.4 Validierung und Mensch im Prozess | Plausibilitätsprüfung, Stammdatenabgleich, Korrekturschleife, Lernen aus Korrekturen |
| | 3.5 Workflow-Technik | Regeln, Routing, Eskalation, parallele Freigaben |
| | 3.6 Capture und E-Rechnung | warum strukturierte Rechnungen Capture nicht sofort ersetzen: Übergangszeit, Auslandsrechnungen, Anhänge |

---

### TC 301 — AP im System-Ökosystem

Stufe 3 · empfohlen nach AP 201 und TC 202 · ca. 60 Minuten · 7 Lektionen in 2 Etappen

**Lernziele:** Du kannst die Systemlandschaft rund um AP skizzieren, begründen, warum AP meist eine eigenständige Lösung ist, und die Datenflüsse vor und nach AP samt Schnittstellentechnik erklären.

Die Leitfragen aus dem Backlog der Quelldatei sind vollständig abgedeckt.

| Etappe | Lektion | Inhalt | Leitfrage aus der Quelle |
|---|---|---|---|
| 1 Landschaft und Abgrenzung | 4.1 Die Systemlandschaft | ERP, FiBu (Finanzbuchhaltung, z.B. DATEV), Einkauf, Archiv, Banking, Lieferantenportal | Wie hängt AP mit Vor- und Nachsystemen zusammen? |
| | 4.2 Was AP übernimmt und was nicht | Verantwortung je System, führendes System je Datenart | Was übernimmt AP, was nicht? |
| | 4.3 Warum eigenständig | ERP-Modul gegen Speziallösung, mehrere ERPs, Tabelle aus Datei 1.1 | Warum Standalone statt Bestandteil? |
| 2 Datenflüsse und Technik | 4.4 Datenflüsse | Stammdaten, Bestellungen und Wareneingänge hinein; Buchungssätze, Zahlungsvorschläge, Status hinaus | Wie sehen die Datenflüsse aus? |
| | 4.5 Schnittstellen | Dateiaustausch (CSV, XML), API (Application Programming Interface), Konnektoren, Middleware; Echtzeit gegen Batch | |
| | 4.6 Stammdaten | Qualität, Dubletten, Pflege, typische Integrationsprobleme | Warum ist das notwendig? |
| | 4.7 Zwei Architekturen im Vergleich | Mittelstand mit DATEV gegen Konzern mit SAP | Wo fügt sich AP ein? |

---

## 4. Umfang des MVP

| Class | Lektionen | Etappen | Wissenscheck-Fragen | Abschlusstest-Pool |
|---|---|---|---|---|
| AP 101 | 6 | 2 | ca. 8 | 25 |
| AP 201 | 7 | 3 | ca. 12 | 25 |
| TC 201 | 6 | 2 | ca. 8 | 25 (vorhanden) |
| TC 202 | 6 | 2 | ca. 8 | 25 |
| TC 301 | 7 | 2 | ca. 8 | 25 |
| **Summe** | **32** | **11** | **ca. 44** | **125** |

Alles zweisprachig. Neu zu schreiben und fachlich zu prüfen sind 26 Lektionen und rund 140 Fragen (100 für die Abschlusstests, 44 für die Wissenschecks). Das ist der größte Aufwand, nicht der Code.

---

## 5. Roadmap nach dem MVP

| Class | Bereich | Stufe | Thema | Hinweis |
|---|---|---|---|---|
| TC 302 | Technologie & Compliance | 3 | E-Rechnung: Vertiefung | bestehender Kurs 202, nur Umbau |
| AP 301 | Prozess & Business | 3 | Compliance und Steuer im AP | GoBD, Aufbewahrung, Vorsteuerabzug, Reverse Charge, Datenschutz |
| TC 401 | Technologie & Compliance | 4 | KI im AP | KI-Agenten, Anomalie- und Betrugserkennung, Grenzen, EU AI Act |
| AP 401 | Prozess & Business | 4 | Markt und Wettbewerb | Datei Modul 5, **Vertraulichkeit vorher klären** |
| AP 402 | Prozess & Business | 4 | Trends und Zukunft | Datei Modul 6, lebender Inhalt mit Pflegedatum |

Offene Backlog-Issues, die zu dieser Struktur passen: #3 (Feedback zu Inhalten) und #4 (Einstiegstest). Das Stufenmodell aus Abschnitt 2 ist die Grundlage für die Empfehlung im Einstiegstest.

---

## 6. Beispiel: Freitextfrage umgebaut

Quelle, Wissenscheck 1.1 + 1.2, Frage 2: *„Was ist 3-Way-Matching und warum ist es wichtig?"*

Umgebaut als Zuordnung:

| Beleg | Was er belegt |
|---|---|
| Bestellung | was vereinbart wurde |
| Wareneingang | was tatsächlich geliefert wurde |
| Rechnung | was bezahlt werden soll |

Ergänzt um eine Single-Choice-Frage zum Zweck: *„Wann gibt das 3-Way-Matching eine Rechnung frei?"* → wenn alle drei Belege zusammenpassen.

---

## 7. Technische Folgen (erst bei der Umsetzung)

- **Datenmodell:** `Course` wird zur Class mit Etappen, Lektionen, Wissenschecks und Glossar. Neue Screens: Lektionsansicht, Wissenscheck mit Sofort-Feedback, Glossar pro Class und gesamt.
- **Neue IDs:** Die Classes bekommen eigene Kennungen (z.B. `ap-101`, `tc-201`), damit alter Fortschritt aus den Kursen 101, 201 und 202 nicht fälschlich einer neuen Class zugeordnet wird. Die heutige Speicherlogik verwirft Einträge mit unbekannter Kennung bereits einzeln, ohne den restlichen Verlauf zu verlieren.
- **Fortschritt** wird feiner: Lektion gelesen, Etappe erreicht, Class bestanden.
- **Reihenfolge der Umsetzung:** zuerst Datenmodell und Screens mit AP 101 als Pilot, dann Review durch Sascha, dann die übrigen vier Classes.

---

## 8. Offene Entscheidungen für Sascha

1. **Alte Kurse:** Die fünf Classes ersetzen die Kurse 101, 201 und 202. Empfehlung: Die alten Kurse bleiben live, bis AP 101 fertig und abgenommen ist.
2. **Sofort-Feedback im Wissenscheck:** Empfehlung ja, der Abschlusstest bleibt ohne Feedback bis zum Ende.
3. **Achievements:** Die Quelldatei erwähnt sie, die App hat bewusst keine. Empfehlung: Etappenziele und grüne Haken reichen fürs MVP, Achievements später.
4. **Vertraulichkeit:** Das Repo und die Seite sind öffentlich. „Produkt-Relevanz" und später Markt und Wettbewerb können interne Positionierung enthalten. Empfehlung: im MVP nur öffentlich unkritische Aussagen; vor AP 401 das Repo privat stellen (GitHub Pro) oder anders hosten.
5. **Bezeichnung:** In der App heißt es heute „Kurs". Soll die Oberfläche künftig „Class" sagen?
6. **Zahlen mit `[prüfen]`:** Kosten pro Rechnung, Durchlaufzeiten, Amortisation, Anbieterlisten und die Jahreszahlen der Historien-Lektion brauchen dein Review, bevor sie live gehen.
