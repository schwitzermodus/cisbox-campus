import type { LearnCard } from '../../types'

/**
 * Lernkarten Rechnungen, Grundlagen. Quellsprache Deutsch.
 * Alle Karten stehen unter fachlichem [REVIEW] durch Sascha, siehe README.
 */
export const CARDS: readonly LearnCard[] = [
  {
    id: 'r1',
    title: { de: 'Was eine Rechnung ist', en: 'What an invoice is' },
    body: [
      {
        de: 'Eine Rechnung ist die Abrechnung einer Lieferung oder Leistung: Sie hält fest, wer was für wen erbracht hat und welcher Betrag dafür zu zahlen ist. Damit ist sie mehr als eine Zahlungsaufforderung.',
        en: 'An invoice bills a delivery or service: it records who provided what to whom and how much is owed for it. That makes it more than just a payment request.',
      },
      {
        de: 'Sie ist ein Dokument mit Rechtsfolgen. Sie begründet eine Forderung, dient als Nachweis gegenüber Finanzamt und Betriebsprüfung und ist die Voraussetzung dafür, dass der Empfänger die enthaltene Umsatzsteuer als Vorsteuer abziehen kann.',
        en: 'It is a document with legal consequences. It establishes a claim, serves as evidence for the tax office and audits, and is the precondition for the recipient to deduct the included VAT as input tax.',
      },
    ],
  },
  {
    id: 'r2',
    title: { de: 'Wozu Rechnungen dienen', en: 'What invoices are for' },
    body: [
      {
        de: 'Für den Rechnungssteller ist die Rechnung die Aufforderung zur Zahlung und zugleich der Buchungsbeleg, mit dem der Umsatz in der eigenen Buchhaltung erfasst wird. Ohne Rechnung kein ordentlicher Ertrag in den Büchern.',
        en: 'For the issuer, the invoice is both the request for payment and the accounting document that records the revenue in their own books. Without an invoice, there is no proper revenue entry.',
      },
      {
        de: 'Für den Empfänger ist sie der Nachweis einer Ausgabe und die Grundlage für den Vorsteuerabzug. Beide Seiten brauchen die Rechnung außerdem für die Aufbewahrung: Sie muss über Jahre nachvollziehbar bleiben, falls Finanzamt oder Wirtschaftsprüfung nachfragen.',
        en: 'For the recipient, it is proof of an expense and the basis for the input tax deduction. Both sides also need the invoice for retention: it must stay traceable for years in case the tax office or an audit asks.',
      },
    ],
  },
  {
    id: 'r3',
    title: { de: 'Pflichtangaben einer Rechnung', en: 'Mandatory invoice details' },
    figure: 'sample',
    body: [
      {
        de: 'Das deutsche Umsatzsteuerrecht schreibt vor, was auf einer Rechnung stehen muss: vollständiger Name und Anschrift von Rechnungssteller und Empfänger, Steuernummer oder USt-IdNr., Rechnungsdatum, eine fortlaufende Rechnungsnummer, Menge und Art der Leistung, Zeitpunkt der Lieferung, Entgelt nach Steuersätzen aufgeschlüsselt, der anzuwendende Steuersatz sowie der Steuerbetrag.',
        en: 'German VAT law specifies what must appear on an invoice: the full name and address of both issuer and recipient, tax number or VAT ID, invoice date, a sequential invoice number, the quantity and type of the goods or service, the delivery date, the amount broken down by tax rate, the applicable tax rate and the tax amount.',
      },
      {
        de: 'Eine Ausnahme sind Kleinbetragsrechnungen bis 250 Euro: Sie dürfen ohne Empfängeranschrift, Rechnungsnummer und Steuerausweis auskommen, brauchen aber trotzdem Rechnungssteller, Datum, Leistung und den Bruttobetrag samt Steuersatz.',
        en: 'An exception applies to small-amount invoices up to 250 euros: they may omit the recipient address, invoice number and separate tax breakdown, but still need the issuer, date, description and gross amount including the tax rate.',
      },
    ],
  },
  {
    id: 'r4',
    title: { de: 'Rechnung, Angebot, Auftragsbestätigung, Lieferschein', en: 'Invoice, quote, order confirmation, delivery note' },
    body: [
      {
        de: 'Vier Dokumente, vier verschiedene Zeitpunkte. Das Angebot kommt vom Verkäufer vor dem Geschäft und ist unverbindlich oder befristet bindend. Die Auftragsbestätigung folgt, nachdem der Kunde bestellt hat, und bestätigt die konkreten Bedingungen.',
        en: 'Four documents, four different points in time. The quote comes from the seller before the deal and is non-binding or binding only for a limited period. The order confirmation follows once the customer has ordered, confirming the specific terms.',
      },
      {
        de: 'Der Lieferschein begleitet die Ware und bestätigt, was tatsächlich geliefert wurde, meist ohne Preise. Die Rechnung kommt zuletzt: Sie fordert die Zahlung für das, was laut Lieferschein oder Leistungsnachweis tatsächlich erbracht wurde. Nur die Rechnung begründet eine Zahlungspflicht und den Vorsteuerabzug.',
        en: 'The delivery note travels with the goods and confirms what was actually delivered, usually without prices. The invoice comes last: it demands payment for what was actually provided according to the delivery note or proof of service. Only the invoice creates a payment obligation and an input tax deduction.',
      },
    ],
  },
  {
    id: 'r5',
    title: { de: 'Von der Bestellung bis zur Bezahlung', en: 'From order to payment' },
    figure: 'p2p',
    body: [
      {
        de: 'Der Weg heißt Purchase-to-Pay: Bedarf erkennen, Bestellung auslösen, Wareneingang oder Leistung bestätigen, Rechnung erhalten, Rechnung gegen Bestellung und Wareneingang prüfen, freigeben, buchen, bezahlen.',
        en: 'The path is called purchase-to-pay: identify a need, place the order, confirm goods receipt or the service, receive the invoice, match the invoice against order and goods receipt, approve, post, pay.',
      },
      {
        de: 'Jede Station hinterlässt ein eigenes Dokument, und die Rechnung ist nur eine Station von vielen. Erst wenn Bestellung, Lieferung und Rechnung zusammenpassen, wird bezahlt. Diese Prüfung heißt Drei-Wege-Abgleich und ist der Kern jeder ordentlichen Kreditorenbuchhaltung.',
        en: 'Each stage leaves its own document, and the invoice is just one stop among several. Payment happens only once order, delivery and invoice match up. This check is called three-way matching and sits at the core of any proper accounts payable process.',
      },
    ],
  },
  {
    id: 'r6',
    title: { de: 'Wo die Rechnung im Prozess sitzt', en: 'Where the invoice sits in the process' },
    body: [
      {
        de: 'Die Rechnung trifft nach der Lieferung ein und läuft dann durch fünf Schritte: Eingang, also wo und wie sie ankommt; Prüfung gegen Bestellung und Wareneingang; Freigabe durch die zuständige Person oder Kostenstelle; Buchung in die Finanzbuchhaltung; und schließlich Zahlung zum passenden Termin.',
        en: 'The invoice arrives after delivery and then runs through five steps: intake, meaning where and how it arrives; matching against the order and goods receipt; approval by the responsible person or cost centre; posting to the general ledger; and finally payment on the right date.',
      },
      {
        de: 'Jeder Schritt kann Verzögerung oder Fehler erzeugen, deshalb ist der Rechnungseingang in vielen Unternehmen der Prozess mit dem größten Verbesserungspotenzial.',
        en: 'Every step can introduce delay or error, which is why invoice receipt is, in many companies, the process with the greatest room for improvement.',
      },
    ],
  },
  {
    id: 'r7',
    title: { de: 'Warum Rechnungen verarbeitet werden müssen', en: 'Why invoices must be processed' },
    body: [
      {
        de: 'Verarbeitung ist keine Kür. Zahlungsfristen und Skonto-Fenster laufen ab dem Rechnungsdatum, nicht ab dem Tag, an dem jemand Zeit findet, sie anzusehen. Wer zu spät prüft, verpasst den Skonto oder zahlt Verzugszinsen.',
        en: 'Processing is not optional. Payment terms and early-payment discount windows run from the invoice date, not from whenever someone gets around to looking at it. Checking too late means missing the discount or paying late fees.',
      },
      {
        de: 'Dazu kommen gesetzliche Aufbewahrungspflichten von in der Regel zehn Jahren und die sachliche und rechnerische Prüfpflicht: Stimmt die Leistung, stimmt die Rechnung? Ohne strukturierte Verarbeitung bleibt beides Zufall.',
        en: 'On top of that come statutory retention periods, usually ten years, and the duty to check invoices both factually and arithmetically: does the service match, does the invoice add up? Without structured processing, both are left to chance.',
      },
    ],
  },
  {
    id: 'r8',
    title: { de: 'Buchhaltung und Kontierung', en: 'Accounting and coding' },
    body: [
      {
        de: 'Kontieren heißt, eine Rechnung den richtigen Konten zuzuordnen: einem Sachkonto für die Art der Ausgabe, oft einer Kostenstelle für den verursachenden Bereich und einem Steuerschlüssel für die korrekte Umsatzsteuerbehandlung.',
        en: 'Coding means assigning an invoice to the right accounts: a general ledger account for the type of expense, often a cost centre for the responsible area, and a tax code for the correct VAT treatment.',
      },
      {
        de: 'Davor steht die Prüfung: sachlich, ob die Leistung wirklich erbracht wurde, und rechnerisch, ob Mengen, Preise und Steuer stimmen. Erst danach wird gebucht. Strukturierte Daten machen genau diese beiden Schritte automatisierbar.',
        en: 'Before that comes the check: factually, whether the service was actually provided, and arithmetically, whether quantities, prices and tax add up. Only then is it posted. Structured data is exactly what makes these two steps automatable.',
      },
    ],
  },
  {
    id: 'r9',
    title: { de: 'Formen und Übertragungswege im Wandel', en: 'Forms and transmission paths in transition' },
    figure: 'timeline',
    body: [
      {
        de: 'Rechnungen liefen lange auf Papier, dann per Fax, dann als PDF im E-Mail-Anhang. Zwischen Unternehmen mit hohem Volumen setzte sich EDI durch, ein strukturierter Datenaustausch nach festen Regeln, meist über Portale oder direkte Anbindungen.',
        en: 'Invoices long travelled on paper, then by fax, then as a PDF email attachment. Between businesses with high volumes, EDI took hold, a structured data exchange under fixed rules, usually via portals or direct connections.',
      },
      {
        de: 'Der gemeinsame Nenner all dieser Wege war lange: Am Ende musste ein Mensch die Daten wieder eintippen. Die E-Rechnung schließt genau diese Lücke, weil sie das Datenformat selbst strukturiert und maschinenlesbar macht. Damit beginnt der nächste Kurs.',
        en: 'The common denominator of all these paths was, for a long time: someone had to re-type the data at the end. The e-invoice closes exactly that gap, because it makes the data format itself structured and machine-readable. That is where the next course picks up.',
      },
    ],
  },
]
