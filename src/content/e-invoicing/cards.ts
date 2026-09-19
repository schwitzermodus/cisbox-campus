import type { LocalizedText } from '../../core/types'

export type LearnCard = {
  id: string
  title: LocalizedText
  body: LocalizedText
  /** Optionale Inline-Grafik (siehe svgs/). */
  figure?: 'process' | 'formats' | 'timeline'
}

/**
 * Lernkarten E-Rechnung, Schwierigkeit Basis. Quellsprache Deutsch.
 * Alle Karten stehen unter fachlichem [REVIEW] durch Sascha, siehe README.
 */
export const CARDS: readonly LearnCard[] = [
  {
    id: 'c1',
    title: { de: 'Was eine E-Rechnung ist', en: 'What an e-invoice is' },
    figure: 'process',
    body: {
      de: 'Eine E-Rechnung ist eine Rechnung, die in einem strukturierten elektronischen Format ausgestellt, übermittelt und empfangen wird, sodass sie ohne manuelle Erfassung weiterverarbeitet werden kann. Entscheidend ist nicht der Versandweg, sondern das Format. Ein PDF per E-Mail ist keine E-Rechnung, auch wenn es digital ankommt, denn ein Mensch muss die Daten wieder abtippen oder auslesen lassen. Eine E-Rechnung enthält die Rechnungsdaten als maschinenlesbaren Datensatz, typischerweise XML. Im deutschen Umsatzsteuerrecht gilt seit Anfang 2025 genau diese engere Definition. Rechnungen, die sie nicht erfüllen, heißen dort „sonstige Rechnungen“.',
      en: 'An e-invoice is an invoice that is issued, transmitted and received in a structured electronic format, so it can be processed further without manual data entry. What matters is not the delivery channel but the format. A PDF sent by email is not an e-invoice, even though it arrives digitally, because a person has to re-type the data or run it through an extraction tool. An e-invoice carries the invoice data as a machine-readable data set, typically XML. German VAT law has used exactly this narrower definition since the start of 2025. Invoices that do not meet it are called “other invoices” there.',
    },
  },
  {
    id: 'c2',
    title: { de: 'Warum es die E-Rechnung gibt', en: 'Why e-invoicing exists' },
    body: {
      de: 'Zwei Treiber. Erstens Steuern: Der Umsatzsteuerausfall in der EU liegt im zweistelligen Milliardenbereich. Strukturierte Rechnungsdaten lassen sich prüfen und später auch nahezu in Echtzeit an die Finanzverwaltung melden, was Karussellbetrug schwerer macht. Zweitens Effizienz: In vielen Unternehmen wandern Rechnungen noch als Papier oder PDF durch Postfächer, werden abgetippt, gescannt, per Mail zur Genehmigung weitergeleitet. Das kostet Zeit, verursacht Fehler und macht Skonto-Fristen zum Glücksspiel. Strukturierte Daten sind die Voraussetzung dafür, dass Erfassung, Prüfung und Verbuchung automatisch laufen können.',
      en: 'Two drivers. First, tax: the VAT gap in the EU runs into tens of billions of euros. Structured invoice data can be validated and, later on, reported to the tax authorities almost in real time, which makes carousel fraud harder. Second, efficiency: in many companies invoices still travel as paper or PDF through mailboxes, get re-typed, scanned and forwarded by email for approval. That costs time, causes errors and turns early-payment discount deadlines into a gamble. Structured data is the prerequisite for capture, validation and posting to run automatically.',
    },
  },
  {
    id: 'c3',
    title: { de: 'Die Norm dahinter: EN 16931', en: 'The standard behind it: EN 16931' },
    body: {
      de: 'EN 16931 ist die europäische Norm, die festlegt, welche Inhalte eine E-Rechnung hat und wie sie strukturiert sind. Sie definiert ein semantisches Datenmodell, also die Bedeutung der Felder, und legt zwei erlaubte Syntaxen fest: UBL und UN/CEFACT CII. Nationale Formate sind Ausprägungen dieser Norm, keine Gegenentwürfe. Genau das macht grenzüberschreitende Verarbeitung möglich: Wer EN 16931 versteht, versteht auch die nationalen Varianten mit überschaubarem Zusatzaufwand. Die Norm wurde 2026 überarbeitet (EN 16931-1:2026), unter anderem um Felder für die kommenden Meldepflichten.',
      en: 'EN 16931 is the European standard that defines what an e-invoice contains and how it is structured. It specifies a semantic data model, i.e. the meaning of the fields, and permits two syntaxes: UBL and UN/CEFACT CII. National formats are specialisations of this standard, not competing designs. That is exactly what makes cross-border processing possible: if you understand EN 16931, you understand the national variants with manageable extra effort. The standard was revised in 2026 (EN 16931-1:2026), among other things to add fields for the upcoming reporting obligations.',
    },
  },
  {
    id: 'c4',
    title: { de: 'Formate in der Praxis', en: 'Formats in practice' },
    figure: 'formats',
    body: {
      de: 'In Deutschland sind zwei Formate üblich. XRechnung ist ein reines XML-Format, eine nationale Ausprägung von EN 16931, ursprünglich für Rechnungen an öffentliche Auftraggeber entwickelt. ZUGFeRD 2.x ist ein Hybridformat: eine PDF-Datei, in die der XML-Datensatz eingebettet ist. Menschen sehen ein Dokument, Systeme lesen die Daten. Praktisch wichtig: ZUGFeRD 2.x und das französische Factur-X sind technisch dasselbe Format unter zwei Namen. Wer das eine verarbeitet, kann mit geringem Aufwand auch das andere. Beim Hybridformat gilt im Zweifel der XML-Teil als führend.',
      en: 'Two formats are common in Germany. XRechnung is a pure XML format, a national specialisation of EN 16931, originally developed for invoices to public-sector buyers. ZUGFeRD 2.x is a hybrid format: a PDF file with the XML data set embedded in it. People see a document, systems read the data. Important in practice: ZUGFeRD 2.x and the French Factur-X are technically the same format under two names. If you can process one, you can handle the other with little extra effort. In the hybrid format, the XML part is authoritative in case of doubt.',
    },
  },
  {
    id: 'c5',
    title: { de: 'Peppol als Transportweg', en: 'Peppol as the transport network' },
    body: {
      de: 'Format und Transport sind zwei verschiedene Dinge. Peppol ist ein Netzwerk für den Austausch: Sender und Empfänger sind jeweils bei einem Dienstleister angebunden, einem Access Point, und die beiden Dienstleister sprechen miteinander (Vier-Corner-Modell). Jeder Teilnehmer hat eine eindeutige Peppol-ID, über die er adressierbar ist. Peppol BIS Billing 3.0 ist das dort verwendete Rechnungsformat, ebenfalls auf EN 16931 aufbauend. Der Vorteil gegenüber klassischem EDI: Man braucht keine bilaterale Vereinbarung pro Geschäftspartner. Eine Anbindung, alle erreichbaren Teilnehmer. Mehrere EU-Länder setzen ihre Pflicht auf Peppol auf.',
      en: 'Format and transport are two different things. Peppol is a network for exchanging documents: sender and receiver are each connected to a service provider, an Access Point, and the two providers talk to each other (four-corner model). Every participant has a unique Peppol ID through which it can be addressed. Peppol BIS Billing 3.0 is the invoice format used there, also built on EN 16931. The advantage over classic EDI: no bilateral agreement per business partner is needed. One connection, every reachable participant. Several EU countries build their mandates on Peppol.',
    },
  },
  {
    id: 'c6',
    title: { de: 'Deutschland: die Fristen', en: 'Germany: the deadlines' },
    figure: 'timeline',
    body: {
      de: 'Seit 1. Januar 2025 muss jedes inländische Unternehmen E-Rechnungen empfangen und verarbeiten können. Der Vorrang der Papierrechnung ist entfallen, eine korrekte E-Rechnung darf nicht abgelehnt werden. Für das Ausstellen gelten Übergangsfristen: Ab 1. Januar 2027 müssen Unternehmen mit mehr als 800.000 Euro Vorjahresumsatz im inländischen B2B-Geschäft E-Rechnungen ausstellen. Ab 1. Januar 2028 gilt das für alle, auch für kleine Unternehmen. Bis Ende 2027 sind unter Bedingungen noch EDI-Verfahren und sonstige Rechnungen möglich. Ausgenommen bleiben unter anderem Kleinbetragsrechnungen bis 250 Euro und bestimmte steuerfreie Umsätze.',
      en: 'Since 1 January 2025 every business based in Germany must be able to receive and process e-invoices. Paper invoices no longer take precedence, and a valid e-invoice may not be rejected. Transitional periods apply to issuing: from 1 January 2027, businesses with more than EUR 800,000 in prior-year turnover must issue e-invoices for domestic B2B transactions. From 1 January 2028 this applies to everyone, including small businesses. Until the end of 2027, EDI procedures and other invoices remain possible under certain conditions. Exemptions include, among others, small-amount invoices up to EUR 250 and certain tax-exempt transactions.',
    },
  },
  {
    id: 'c7',
    title: { de: 'Europa: kein einheitliches Bild', en: 'Europe: no uniform picture' },
    body: {
      de: 'Die Pflicht kommt überall, aber unterschiedlich. Italien ist der Vorreiter mit FatturaPA und der zentralen Plattform SdI, dort läuft B2B-Pflicht seit 2019. Frankreich hat seine B2B-Pflicht im September 2026 gestartet: Empfangen müssen alle, Ausstellen zunächst große und mittlere Unternehmen, kleinere folgen 2027, und der Austausch läuft über staatlich zugelassene Plattformen. Norwegen nutzt EHF 3.0 auf Peppol-Basis, die B2B-Ausstellungspflicht greift ab Januar 2027, die Empfangspflicht samt digitaler Buchführung ab 2030. Polen fährt sein zentrales System KSeF. Für Anbieter heißt das: mehrere Formate, mehrere Modelle, ein Datenmodell im Kern.',
      en: 'The mandate is coming everywhere, but in different shapes. Italy is the pioneer with FatturaPA and the central SdI platform, where the B2B mandate has been running since 2019. France launched its B2B mandate in September 2026: everyone must be able to receive, large and mid-sized companies must issue first, smaller ones follow in 2027, and exchange runs through state-accredited platforms. Norway uses EHF 3.0 on a Peppol basis; the B2B issuing obligation applies from January 2027, the receiving obligation together with digital bookkeeping from 2030. Poland runs its central KSeF system. For vendors this means: several formats, several models, one data model at the core.',
    },
  },
  {
    id: 'c8',
    title: { de: 'ViDA: was danach kommt', en: 'ViDA: what comes next' },
    body: {
      de: 'Die EU hat 2025 das Paket „VAT in the Digital Age“ beschlossen. Es läuft gestaffelt bis 2035. Der für Rechnungen wichtigste Punkt: Ab 1. Juli 2030 werden strukturierte E-Rechnung und digitale Meldepflichten für innergemeinschaftliche B2B-Umsätze verbindlich, EN 16931 wird dabei zum gemeinsamen Nenner. Bis 1. Januar 2035 müssen Länder mit älteren nationalen Meldesystemen sich an den europäischen Standard annähern. Die Richtung ist damit gesetzt: von der Rechnung als Dokument zur Rechnung als gemeldetem Datensatz. Wer heute auf EN 16931 und Peppol setzt, arbeitet in diese Richtung.',
      en: 'In 2025 the EU adopted the “VAT in the Digital Age” package. It is phased in until 2035. The most important point for invoicing: from 1 July 2030, structured e-invoicing and digital reporting become mandatory for intra-Community B2B transactions, with EN 16931 as the common denominator. By 1 January 2035, countries with older national reporting systems must converge towards the European standard. The direction is set: from the invoice as a document to the invoice as a reported data set. Anyone building on EN 16931 and Peppol today is already working in that direction.',
    },
  },
  {
    id: 'c9',
    title: { de: 'Was das für cisbox bedeutet', en: 'What this means for cisbox' },
    body: {
      de: 'Die E-Rechnung ist für cisbox kein Compliance-Nebenthema, sondern Geschäftsgrundlage. Kunden müssen Formate empfangen, validieren, lesbar darstellen, revisionssicher archivieren und in ihre Freigabe- und Buchungsprozesse bringen. Genau dort setzen unsere Lösungen an: vom Rechnungseingang über die Erkennung dort, wo noch keine strukturierten Daten kommen, bis zur Anbindung an ERP- und Buchhaltungssysteme und zur buchhalterischen Weiterverarbeitung. Weil cisbox in mehreren Ländern aktiv ist, zahlt sich ein Kern nach EN 16931 mit länderspezifischen Ausprägungen aus, statt pro Land eine eigene Lösung.',
      en: 'For cisbox, e-invoicing is not a compliance side topic but the basis of the business. Customers need to receive formats, validate them, render them readable, archive them in an audit-proof way and feed them into their approval and posting processes. That is exactly where our solutions come in: from invoice intake, through recognition wherever structured data is not yet arriving, to integration with ERP and accounting systems and downstream accounting. Because cisbox operates in several countries, a core built on EN 16931 with country-specific specialisations pays off, rather than a separate solution per country.',
    },
  },
]
