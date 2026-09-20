import type { LocalizedText, Question } from '../../../core/types'
import { DIFFICULTY } from './meta'

const t = (de: string, en: string): LocalizedText => ({ de, en })
const opt = (id: string, de: string, en: string) => ({ id, label: t(de, en) })
const base = { difficulty: DIFFICULTY } as const

/**
 * Fragenpool E-Rechnung, Schwierigkeit Basis: 15 Single, 5 Multi, 3 Slider, 2 Zuordnung.
 * Quellsprache Deutsch. Alle Fragen stehen unter fachlichem [REVIEW] durch Sascha.
 * Abweichung vom Plan: ei-b-017 und ei-b-019 haben 3 statt 4 richtige Optionen,
 * damit „alles ankreuzen“ nicht 75 Punkte bringt.
 */
export const QUESTIONS: readonly Question[] = [
  // ---------- Single Choice (15) ----------
  {
    ...base,
    id: 'ei-b-001',
    type: 'single',
    prompt: t(
      'Was macht eine Rechnung zur E-Rechnung im Sinne des deutschen Umsatzsteuerrechts?',
      'What makes an invoice an e-invoice under German VAT law?',
    ),
    options: [
      opt('a', 'Sie wird per E-Mail verschickt', 'It is sent by email'),
      opt('b', 'Sie liegt in einem strukturierten, maschinenlesbaren Format vor', 'It is provided in a structured, machine-readable format'),
      opt('c', 'Sie ist als PDF gespeichert', 'It is stored as a PDF'),
      opt('d', 'Sie wurde digital signiert', 'It has been digitally signed'),
    ],
    correctOptionId: 'b',
    explanation: t(
      'Entscheidend ist das strukturierte Format, nicht der Übertragungsweg. Ein PDF ohne eingebettete strukturierte Daten zählt nicht.',
      'The structured format is what counts, not the delivery channel. A PDF without embedded structured data does not qualify.',
    ),
  },
  {
    ...base,
    id: 'ei-b-002',
    type: 'single',
    prompt: t(
      'Welche europäische Norm legt Inhalt und Struktur einer E-Rechnung fest?',
      'Which European standard defines the content and structure of an e-invoice?',
    ),
    options: [
      opt('a', 'EN 16931', 'EN 16931'),
      opt('b', 'ISO 20022', 'ISO 20022'),
      opt('c', 'EDIFACT D96A', 'EDIFACT D96A'),
      opt('d', 'EN 9001', 'EN 9001'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'EN 16931 definiert das semantische Datenmodell und die zulässigen Syntaxen UBL und CII.',
      'EN 16931 defines the semantic data model and the permitted syntaxes UBL and CII.',
    ),
  },
  {
    ...base,
    id: 'ei-b-003',
    type: 'single',
    prompt: t(
      'Seit wann müssen inländische Unternehmen in Deutschland E-Rechnungen empfangen können?',
      'Since when must businesses in Germany be able to receive e-invoices?',
    ),
    options: [
      opt('a', 'Seit 1. Januar 2025', 'Since 1 January 2025'),
      opt('b', 'Seit 1. Januar 2024', 'Since 1 January 2024'),
      opt('c', 'Ab 1. Januar 2027', 'From 1 January 2027'),
      opt('d', 'Ab 1. Januar 2028', 'From 1 January 2028'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'Die Empfangspflicht gilt seit Anfang 2025, unabhängig von der Unternehmensgröße.',
      'The obligation to receive has applied since the start of 2025, regardless of company size.',
    ),
  },
  {
    ...base,
    id: 'ei-b-004',
    type: 'single',
    prompt: t(
      'Ab wann gilt die Ausstellungspflicht in Deutschland ausnahmslos für alle inländischen B2B-Umsätze?',
      'From when does the obligation to issue e-invoices in Germany apply to all domestic B2B transactions without exception?',
    ),
    options: [
      opt('a', '1. Januar 2027', '1 January 2027'),
      opt('b', '1. Januar 2028', '1 January 2028'),
      opt('c', '1. Juli 2030', '1 July 2030'),
      opt('d', '1. Januar 2035', '1 January 2035'),
    ],
    correctOptionId: 'b',
    explanation: t(
      '2027 greift die Pflicht zunächst für Unternehmen über 800.000 Euro Vorjahresumsatz, ab 2028 für alle.',
      'In 2027 the obligation first applies to businesses with more than EUR 800,000 prior-year turnover, from 2028 to everyone.',
    ),
  },
  {
    ...base,
    id: 'ei-b-005',
    type: 'single',
    prompt: t('Was unterscheidet ZUGFeRD 2.x von XRechnung?', 'What distinguishes ZUGFeRD 2.x from XRechnung?'),
    options: [
      opt('a', 'ZUGFeRD ist ein Hybridformat aus PDF und eingebettetem XML', 'ZUGFeRD is a hybrid format of PDF with embedded XML'),
      opt('b', 'ZUGFeRD ist nicht EN-16931-konform', 'ZUGFeRD is not compliant with EN 16931'),
      opt('c', 'XRechnung ist nur für B2C zugelassen', 'XRechnung is only permitted for B2C'),
      opt('d', 'ZUGFeRD enthält keine Rechnungsdaten', 'ZUGFeRD contains no invoice data'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'XRechnung ist reines XML, ZUGFeRD bettet den XML-Datensatz in eine PDF-Datei ein.',
      'XRechnung is pure XML; ZUGFeRD embeds the XML data set in a PDF file.',
    ),
  },
  {
    ...base,
    id: 'ei-b-006',
    type: 'single',
    prompt: t('Welches Format ist technisch identisch mit ZUGFeRD 2.x?', 'Which format is technically identical to ZUGFeRD 2.x?'),
    options: [
      opt('a', 'Factur-X', 'Factur-X'),
      opt('b', 'FatturaPA', 'FatturaPA'),
      opt('c', 'EHF 3.0', 'EHF 3.0'),
      opt('d', 'KSeF', 'KSeF'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'ZUGFeRD 2.x und Factur-X 1.x sind dieselbe Spezifikation unter zwei nationalen Namen.',
      'ZUGFeRD 2.x and Factur-X 1.x are the same specification under two national names.',
    ),
  },
  {
    ...base,
    id: 'ei-b-007',
    type: 'single',
    prompt: t('Was ist Peppol?', 'What is Peppol?'),
    options: [
      opt('a', 'Ein Netzwerk zum Austausch elektronischer Geschäftsdokumente', 'A network for exchanging electronic business documents'),
      opt('b', 'Ein Rechnungsprüfungsmodul in SAP', 'An invoice verification module in SAP'),
      opt('c', 'Eine deutsche Behörde', 'A German public authority'),
      opt('d', 'Ein Dateiformat für Buchungssätze', 'A file format for accounting entries'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'Peppol regelt vor allem den Transport über Access Points, bringt mit Peppol BIS Billing aber auch ein Rechnungsformat mit.',
      'Peppol primarily governs transport via Access Points, but with Peppol BIS Billing it also provides an invoice format.',
    ),
  },
  {
    ...base,
    id: 'ei-b-008',
    type: 'single',
    prompt: t(
      'Wie viele Parteien sind am Peppol-Vier-Corner-Modell beteiligt?',
      'Which parties are involved in the Peppol four-corner model?',
    ),
    options: [
      opt('a', 'Sender, Empfänger und deren jeweilige Access Points', 'Sender, receiver and their respective Access Points'),
      opt('b', 'Sender und Empfänger direkt', 'Sender and receiver directly'),
      opt('c', 'Sender, Empfänger und die Finanzverwaltung', 'Sender, receiver and the tax authority'),
      opt('d', 'Ausschließlich eine zentrale staatliche Plattform', 'Only a central government platform'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'Sender und Empfänger sind je an einen Dienstleister angebunden, die beiden Dienstleister übernehmen die Übermittlung.',
      'Sender and receiver are each connected to a service provider; the two providers handle the transmission.',
    ),
  },
  {
    ...base,
    id: 'ei-b-009',
    type: 'single',
    prompt: t(
      'Welches Land betreibt mit SdI seit 2019 eine zentrale Plattform für B2B-Rechnungen?',
      'Which country has operated a central platform for B2B invoices, SdI, since 2019?',
    ),
    options: [
      opt('a', 'Italien', 'Italy'),
      opt('b', 'Norwegen', 'Norway'),
      opt('c', 'Frankreich', 'France'),
      opt('d', 'Deutschland', 'Germany'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'Italien war mit FatturaPA und dem Sistema di Interscambio der Vorreiter in der EU.',
      'Italy was the pioneer in the EU with FatturaPA and the Sistema di Interscambio.',
    ),
  },
  {
    ...base,
    id: 'ei-b-010',
    type: 'single',
    prompt: t('Was gilt in Frankreich seit September 2026?', 'What has applied in France since September 2026?'),
    options: [
      opt(
        'a',
        'Alle Unternehmen müssen E-Rechnungen empfangen können, große und mittlere müssen zusätzlich ausstellen',
        'All businesses must be able to receive e-invoices; large and mid-sized ones must also issue them',
      ),
      opt('b', 'Papierrechnungen sind vollständig verboten', 'Paper invoices are completely banned'),
      opt('c', 'Nur B2G-Rechnungen sind betroffen', 'Only B2G invoices are affected'),
      opt('d', 'Es gilt noch keine Pflicht', 'No mandate applies yet'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'Die Empfangspflicht traf alle, die Ausstellungspflicht kam zuerst für große und mittlere Unternehmen, kleinere folgen 2027.',
      'The receiving obligation hit everyone; the issuing obligation came first for large and mid-sized companies, smaller ones follow in 2027.',
    ),
  },
  {
    ...base,
    id: 'ei-b-011',
    type: 'single',
    prompt: t('Welches Rechnungsformat wird in Norwegen genutzt?', 'Which invoice format is used in Norway?'),
    options: [
      opt('a', 'EHF, basierend auf Peppol BIS Billing 3.0', 'EHF, based on Peppol BIS Billing 3.0'),
      opt('b', 'XRechnung', 'XRechnung'),
      opt('c', 'FatturaPA', 'FatturaPA'),
      opt('d', 'KSeF-XML', 'KSeF XML'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'EHF 3.0 ist Norwegens Peppol-basierte Ausprägung von EN 16931.',
      'EHF 3.0 is Norway’s Peppol-based specialisation of EN 16931.',
    ),
  },
  {
    ...base,
    id: 'ei-b-012',
    type: 'single',
    prompt: t(
      'Ab wann sind nach ViDA strukturierte E-Rechnung und digitale Meldung für innergemeinschaftliche B2B-Umsätze verbindlich?',
      'Under ViDA, from when are structured e-invoicing and digital reporting mandatory for intra-Community B2B transactions?',
    ),
    options: [
      opt('a', '1. Juli 2030', '1 July 2030'),
      opt('b', '1. Januar 2027', '1 January 2027'),
      opt('c', '1. Januar 2028', '1 January 2028'),
      opt('d', '1. Januar 2035', '1 January 2035'),
    ],
    correctOptionId: 'a',
    explanation: t(
      '2030 startet die Meldepflicht für grenzüberschreitende Umsätze, 2035 folgt die Angleichung älterer nationaler Systeme.',
      'Reporting for cross-border transactions starts in 2030; the alignment of older national systems follows in 2035.',
    ),
  },
  {
    ...base,
    id: 'ei-b-013',
    type: 'single',
    prompt: t(
      'Welche Rechnungen sind in Deutschland von der Ausstellungspflicht ausgenommen?',
      'Which invoices are exempt from the issuing obligation in Germany?',
    ),
    options: [
      opt('a', 'Kleinbetragsrechnungen bis 250 Euro', 'Small-amount invoices up to EUR 250'),
      opt('b', 'Alle Rechnungen an Konzerntöchter', 'All invoices to group subsidiaries'),
      opt('c', 'Rechnungen über Dienstleistungen', 'Invoices for services'),
      opt('d', 'Rechnungen mit Skontovereinbarung', 'Invoices with an early-payment discount'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'Neben Kleinbetragsrechnungen sind unter anderem bestimmte steuerfreie Umsätze ausgenommen. Die Empfangspflicht bleibt davon unberührt.',
      'Besides small-amount invoices, certain tax-exempt transactions are exempt, among others. The receiving obligation is unaffected.',
    ),
  },
  {
    ...base,
    id: 'ei-b-014',
    type: 'single',
    prompt: t('Welche zwei Syntaxen erlaubt EN 16931?', 'Which two syntaxes does EN 16931 permit?'),
    options: [
      opt('a', 'UBL und UN/CEFACT CII', 'UBL and UN/CEFACT CII'),
      opt('b', 'JSON und CSV', 'JSON and CSV'),
      opt('c', 'EDIFACT und IDoc', 'EDIFACT and IDoc'),
      opt('d', 'XBRL und SAF-T', 'XBRL and SAF-T'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'Beide sind XML-Syntaxen. Nationale Formate bauen auf einer davon auf.',
      'Both are XML syntaxes. National formats build on one of them.',
    ),
  },
  {
    ...base,
    id: 'ei-b-015',
    type: 'single',
    prompt: t(
      'Welcher Vorteil entsteht vor allem aus strukturierten Rechnungsdaten im Eingangsprozess?',
      'What is the main benefit of structured invoice data in the inbound process?',
    ),
    options: [
      opt('a', 'Erfassung, Prüfung und Verbuchung lassen sich automatisieren', 'Capture, validation and posting can be automated'),
      opt('b', 'Die Rechnung muss nicht mehr archiviert werden', 'The invoice no longer needs to be archived'),
      opt('c', 'Die Umsatzsteuer entfällt', 'VAT no longer applies'),
      opt('d', 'Es sind keine Freigaben mehr nötig', 'Approvals are no longer needed'),
    ],
    correctOptionId: 'a',
    explanation: t(
      'Die Aufbewahrungs- und Prüfpflichten bleiben, aber die manuelle Datenerfassung fällt weg.',
      'Retention and verification duties remain, but manual data entry disappears.',
    ),
  },

  // ---------- Multiple Select (5) ----------
  {
    ...base,
    id: 'ei-b-016',
    type: 'multi',
    prompt: t(
      'Welche Aussagen zur E-Rechnung in Deutschland sind richtig?',
      'Which statements about e-invoicing in Germany are correct?',
    ),
    options: [
      opt('a', 'Ein PDF per E-Mail ist keine E-Rechnung im Sinne des UStG', 'A PDF by email is not an e-invoice under the VAT Act'),
      opt('b', 'Der Vorrang der Papierrechnung ist entfallen', 'Paper invoices no longer take precedence'),
      opt('c', 'Eine formal korrekte E-Rechnung darf nicht abgelehnt werden', 'A formally correct e-invoice may not be rejected'),
      opt('d', 'Die Empfangspflicht gilt erst ab 800.000 Euro Umsatz', 'The receiving obligation only applies above EUR 800,000 turnover'),
      opt('e', 'E-Rechnungen müssen elektronisch signiert sein', 'E-invoices must be electronically signed'),
    ],
    correctOptionIds: ['a', 'b', 'c'],
    explanation: t(
      'Die Empfangspflicht gilt unabhängig von der Größe, eine Signatur ist nicht vorgeschrieben.',
      'The receiving obligation applies regardless of size; a signature is not required.',
    ),
  },
  {
    ...base,
    id: 'ei-b-017',
    type: 'multi',
    prompt: t('Welche Formate sind Ausprägungen von EN 16931?', 'Which formats are specialisations of EN 16931?'),
    options: [
      opt('a', 'XRechnung', 'XRechnung'),
      opt('b', 'ZUGFeRD 2.x', 'ZUGFeRD 2.x'),
      opt('c', 'Peppol BIS Billing 3.0', 'Peppol BIS Billing 3.0'),
      opt('d', 'EDIFACT INVOIC', 'EDIFACT INVOIC'),
      opt('e', 'Ein gescanntes PDF', 'A scanned PDF'),
    ],
    correctOptionIds: ['a', 'b', 'c'],
    explanation: t(
      'XRechnung, ZUGFeRD und Peppol BIS bauen auf der Norm auf. EDIFACT INVOIC ist ein älterer EDI-Standard, ein Scan enthält keine strukturierten Daten.',
      'XRechnung, ZUGFeRD and Peppol BIS build on the standard. EDIFACT INVOIC is an older EDI standard; a scan contains no structured data.',
    ),
  },
  {
    ...base,
    id: 'ei-b-018',
    type: 'multi',
    prompt: t(
      'Welche Ziele verfolgt der Gesetzgeber mit der E-Rechnungspflicht?',
      'What goals does the legislator pursue with the e-invoicing mandate?',
    ),
    options: [
      opt('a', 'Umsatzsteuerbetrug erschweren', 'Make VAT fraud harder'),
      opt('b', 'Grundlage für digitale Meldepflichten schaffen', 'Lay the groundwork for digital reporting obligations'),
      opt('c', 'Verwaltungsaufwand langfristig senken', 'Reduce administrative effort in the long run'),
      opt('d', 'Rechnungsstellung für Kleinunternehmen abschaffen', 'Abolish invoicing for small businesses'),
      opt('e', 'Einheitliche Zahlungsfristen in der EU vorschreiben', 'Prescribe uniform payment terms across the EU'),
    ],
    correctOptionIds: ['a', 'b', 'c'],
    explanation: t(
      'Zahlungsfristen sind ein anderes Regelungsthema und nicht Teil der E-Rechnungspflicht.',
      'Payment terms are a separate regulatory topic and not part of the e-invoicing mandate.',
    ),
  },
  {
    ...base,
    id: 'ei-b-019',
    type: 'multi',
    prompt: t(
      'Was gehört zu einem funktionierenden E-Rechnungs-Eingangsprozess?',
      'What belongs to a working inbound e-invoicing process?',
    ),
    options: [
      opt('a', 'Validierung gegen die Formatvorgaben', 'Validation against the format specification'),
      opt('b', 'Manuelle Neuerfassung der Rechnungsdaten im ERP', 'Manual re-entry of the invoice data in the ERP'),
      opt('c', 'Revisionssichere Archivierung', 'Audit-proof archiving'),
      opt('d', 'Übergabe an Freigabe und Buchung', 'Hand-over to approval and posting'),
      opt('e', 'Ausdrucken und Ablegen in Papierform', 'Printing and filing on paper'),
    ],
    correctOptionIds: ['a', 'c', 'd'],
    explanation: t(
      'Manuelle Neuerfassung und Ausdruck widersprechen dem Zweck der E-Rechnung. Aufbewahrungspflichtig ist der strukturierte Datensatz, nicht ein Papierausdruck.',
      'Manual re-entry and printing defeat the purpose of e-invoicing. The structured data set must be retained, not a paper printout.',
    ),
  },
  {
    ...base,
    id: 'ei-b-020',
    type: 'multi',
    prompt: t('Welche Aussagen zu Peppol sind richtig?', 'Which statements about Peppol are correct?'),
    options: [
      opt('a', 'Teilnehmer sind über eine eindeutige ID adressierbar', 'Participants are addressable via a unique ID'),
      opt('b', 'Es braucht keine bilaterale Vereinbarung pro Partner', 'No bilateral agreement per partner is needed'),
      opt('c', 'Peppol regelt Transport und bringt ein Rechnungsformat mit', 'Peppol governs transport and provides an invoice format'),
      opt('d', 'Peppol ist eine Behörde der Europäischen Kommission', 'Peppol is an agency of the European Commission'),
      opt('e', 'Peppol ersetzt die nationale Umsatzsteuererklärung', 'Peppol replaces the national VAT return'),
    ],
    correctOptionIds: ['a', 'b', 'c'],
    explanation: t(
      'Peppol wird von einer internationalen Non-Profit-Organisation verwaltet und hat mit der Steuererklärung nichts zu tun.',
      'Peppol is managed by an international non-profit organisation and has nothing to do with the VAT return.',
    ),
  },

  // ---------- Slider (3) ----------
  {
    ...base,
    id: 'ei-b-021',
    type: 'slider',
    prompt: t(
      'Ab welchem Vorjahresumsatz greift in Deutschland die Ausstellungspflicht bereits 2027?',
      'Above which prior-year turnover does the issuing obligation in Germany already apply in 2027?',
    ),
    min: 0,
    max: 2_000_000,
    step: 50_000,
    unit: t('EUR', 'EUR'),
    target: 800_000,
    tolerance: 0,
    zeroAt: 400_000,
    explanation: t(
      'Unternehmen über 800.000 Euro Vorjahresumsatz müssen ab 1. Januar 2027 ausstellen, alle anderen ab 2028.',
      'Businesses above EUR 800,000 prior-year turnover must issue from 1 January 2027, everyone else from 2028.',
    ),
  },
  {
    ...base,
    id: 'ei-b-022',
    type: 'slider',
    prompt: t(
      'Bis zu welchem Betrag sind Kleinbetragsrechnungen von der Ausstellungspflicht ausgenommen?',
      'Up to which amount are small-amount invoices exempt from the issuing obligation?',
    ),
    min: 0,
    max: 1_000,
    step: 10,
    unit: t('EUR', 'EUR'),
    target: 250,
    tolerance: 0,
    zeroAt: 200,
    explanation: t(
      'Die Grenze liegt bei 250 Euro. Die Empfangspflicht bleibt davon unberührt.',
      'The threshold is EUR 250. The receiving obligation is unaffected.',
    ),
  },
  {
    ...base,
    id: 'ei-b-023',
    type: 'slider',
    prompt: t(
      'In welchem Jahr werden nach ViDA digitale Meldepflichten für innergemeinschaftliche B2B-Umsätze verbindlich?',
      'In which year do digital reporting obligations for intra-Community B2B transactions become mandatory under ViDA?',
    ),
    min: 2025,
    max: 2040,
    step: 1,
    unit: t('', ''),
    target: 2030,
    tolerance: 0,
    zeroAt: 5,
    explanation: t(
      'Der Start ist der 1. Juli 2030, die Angleichung älterer nationaler Systeme folgt bis 2035.',
      'The start is 1 July 2030; the alignment of older national systems follows by 2035.',
    ),
  },

  // ---------- Zuordnung (2) ----------
  {
    ...base,
    id: 'ei-b-024',
    type: 'matching',
    prompt: t(
      'Ordne jedem Land sein nationales E-Rechnungsformat oder System zu.',
      'Match each country to its national e-invoicing format or system.',
    ),
    left: [
      opt('de', 'Deutschland', 'Germany'),
      opt('fr', 'Frankreich', 'France'),
      opt('no', 'Norwegen', 'Norway'),
      opt('it', 'Italien', 'Italy'),
      opt('pl', 'Polen', 'Poland'),
    ],
    right: [
      opt('xrechnung', 'XRechnung', 'XRechnung'),
      opt('facturx', 'Factur-X', 'Factur-X'),
      opt('ehf', 'EHF', 'EHF'),
      opt('fatturapa', 'FatturaPA', 'FatturaPA'),
      opt('ksef', 'KSeF', 'KSeF'),
    ],
    pairs: { de: 'xrechnung', fr: 'facturx', no: 'ehf', it: 'fatturapa', pl: 'ksef' },
    explanation: t(
      'Alle nationalen Formate bauen auf EN 16931 auf, die Modelle dahinter unterscheiden sich aber deutlich.',
      'All national formats build on EN 16931, but the models behind them differ considerably.',
    ),
  },
  {
    ...base,
    id: 'ei-b-025',
    type: 'matching',
    prompt: t('Ordne jeden Begriff seiner Rolle zu.', 'Match each term to its role.'),
    left: [
      opt('en16931', 'EN 16931', 'EN 16931'),
      opt('peppol', 'Peppol', 'Peppol'),
      opt('xrechnung', 'XRechnung', 'XRechnung'),
      opt('zugferd', 'ZUGFeRD', 'ZUGFeRD'),
      opt('vida', 'ViDA', 'ViDA'),
    ],
    right: [
      opt('norm', 'Norm für Inhalt und Struktur', 'Standard for content and structure'),
      opt('network', 'Netzwerk für den Austausch', 'Network for exchange'),
      opt('xml', 'Nationales XML-Format', 'National XML format'),
      opt('hybrid', 'Hybridformat aus PDF und XML', 'Hybrid format of PDF and XML'),
      opt('reform', 'EU-Reformpaket zur Umsatzsteuer', 'EU VAT reform package'),
    ],
    pairs: { en16931: 'norm', peppol: 'network', xrechnung: 'xml', zugferd: 'hybrid', vida: 'reform' },
    explanation: t(
      'Format, Transportweg und Rechtsrahmen sind drei verschiedene Ebenen und werden im Alltag oft vermischt.',
      'Format, transport channel and legal framework are three different layers that often get mixed up in everyday work.',
    ),
  },
]
