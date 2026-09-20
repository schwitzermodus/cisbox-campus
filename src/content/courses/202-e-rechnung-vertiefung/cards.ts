import type { LearnCard } from '../../types'

/**
 * Lernkarten E-Rechnung, Vertiefung. Quellsprache Deutsch.
 * Alle Karten stehen unter fachlichem [REVIEW] durch Sascha, siehe README.
 * Besondere Vorsicht bei versionsabhaengigen Details (Profile, Formatversionen).
 */
export const CARDS: readonly LearnCard[] = [
  {
    id: 'v1',
    title: { de: 'Das Datenmodell von EN 16931', en: 'The EN 16931 data model' },
    body: [
      {
        de: 'EN 16931 definiert kein Dateiformat, sondern ein semantisches Datenmodell: eine Liste von Informationselementen mit fester Bedeutung, unabhängig davon, wie sie technisch codiert werden. Rechnungssteller, Leistungsdatum und Gesamtbetrag sind solche Elemente.',
        en: 'EN 16931 does not define a file format but a semantic data model: a list of information elements with a fixed meaning, independent of how they are technically encoded. Seller, delivery date and total amount are such elements.',
      },
      {
        de: 'Die Elemente sind in Gruppen organisiert, etwa Rechnungssteller, Rechnungsempfänger, Rechnungszeilen und Steuerübersicht. Jede nationale Ausprägung bildet dieselben Gruppen ab, nur die Syntax unterscheidet sich. Das ist die eigentliche Leistung der Norm: ein gemeinsames Verständnis, auf das sich alle Formate stützen.',
        en: 'The elements are organised into groups, such as seller, buyer, invoice lines and tax summary. Every national specialisation maps the same groups, only the syntax differs. That is the actual achievement of the standard: a shared understanding that every format builds on.',
      },
    ],
  },
  {
    id: 'v2',
    title: { de: 'UBL und CII im Vergleich', en: 'UBL and CII compared' },
    figure: 'syntax',
    body: [
      {
        de: 'EN 16931 erlaubt zwei XML-Syntaxen: UBL (Universal Business Language) und UN/CEFACT CII (Cross Industry Invoice). Beide transportieren dieselben Informationselemente, benennen und verschachteln sie aber unterschiedlich.',
        en: 'EN 16931 permits two XML syntaxes: UBL (Universal Business Language) and UN/CEFACT CII (Cross Industry Invoice). Both carry the same information elements, but name and nest them differently.',
      },
      {
        de: 'XRechnung unterstützt beide Syntaxen parallel. Wer eine Verarbeitung für eine Syntax gebaut hat, muss für die andere nicht das Datenmodell neu verstehen, nur das Mapping der Felder auf die andere Struktur.',
        en: 'XRechnung supports both syntaxes in parallel. Anyone who has built processing for one syntax does not need to relearn the data model for the other, only the mapping of fields onto the other structure.',
      },
    ],
  },
  {
    id: 'v3',
    title: { de: 'Validierung in Stufen', en: 'Validation in layers' },
    body: [
      {
        de: 'Eine eingehende E-Rechnung wird stufenweise geprüft. Zuerst die Schema-Validierung: Ist das XML wohlgeformt und hält es die Struktur der Syntax ein? Danach die Schematron-Regeln: Sind die semantischen Geschäftsregeln der Norm erfüllt, etwa dass sich Summen korrekt ergeben.',
        en: 'An incoming e-invoice is checked in stages. First schema validation: is the XML well-formed and does it follow the syntax structure? Then Schematron rules: are the semantic business rules of the standard met, for example that totals add up correctly.',
      },
      {
        de: 'Öffentliche und kommerzielle Validatoren prüfen genau diese beiden Stufen automatisiert. Eine Rechnung, die beide Stufen besteht, ist nicht automatisch inhaltlich richtig, aber sie ist formal korrekt aufgebaut.',
        en: 'Public and commercial validators check exactly these two stages automatically. An invoice that passes both stages is not automatically correct in content, but it is formally well-structured.',
      },
    ],
  },
  {
    id: 'v4',
    title: { de: 'CIUS und Extensions', en: 'CIUS and extensions' },
    body: [
      {
        de: 'CIUS steht für Core Invoice Usage Specification: eine nationale oder branchenspezifische Einschränkung der Norm, die Felder verpflichtend macht, die EN 16931 nur optional vorsieht. XRechnung ist genau das, eine CIUS für den deutschen öffentlichen Sektor.',
        en: 'CIUS stands for Core Invoice Usage Specification: a national or sector-specific restriction of the standard that makes fields mandatory which EN 16931 only lists as optional. XRechnung is exactly that, a CIUS for the German public sector.',
      },
      {
        de: 'Eine Extension geht den umgekehrten Weg und ergänzt zusätzliche, branchenspezifische Felder. Beides bleibt zur Basisnorm kompatibel: Ein allgemeiner EN-16931-Validator erkennt eine XRechnung weiterhin als gültige E-Rechnung, nur strengere Regeln kommen dazu.',
        en: 'An extension goes the other way and adds extra, sector-specific fields. Both stay compatible with the base standard: a general EN 16931 validator still recognises an XRechnung as a valid e-invoice, only stricter rules are added on top.',
      },
    ],
  },
  {
    id: 'v5',
    title: { de: 'ZUGFeRD- und Factur-X-Profile', en: 'ZUGFeRD and Factur-X profiles' },
    figure: 'profiles',
    body: [
      {
        de: 'ZUGFeRD 2.x kennt mehrere Profile mit steigendem Detailgrad, von einem knappen Minimalprofil bis zu einem erweiterten Profil mit allen Feldern der Norm. Je nach Profil enthält die eingebettete XML mehr oder weniger Daten, das sichtbare PDF bleibt gleich.',
        en: 'ZUGFeRD 2.x has several profiles with increasing detail, from a minimal profile to an extended profile covering all fields of the standard. Depending on the profile, the embedded XML carries more or less data, while the visible PDF stays the same.',
      },
      {
        de: 'Damit das PDF selbst archivierbar bleibt, muss es dem Langzeitarchivierungsstandard PDF/A-3 entsprechen. Das erlaubt eingebettete Dateien wie die XML und bleibt trotzdem über Jahre lesbar. Faktur-X ist die technisch identische französische Ausprägung.',
        en: 'For the PDF itself to remain archivable, it must conform to the PDF/A-3 long-term archiving standard, which allows embedded files such as the XML while staying readable for years. Factur-X is the technically identical French specialisation.',
      },
    ],
  },
  {
    id: 'v6',
    title: { de: 'Die Leitweg-ID', en: 'The Leitweg-ID' },
    body: [
      {
        de: 'Rechnungen an deutsche öffentliche Auftraggeber brauchen eine Leitweg-ID: einen Code, der die zuständige Verwaltungsstelle eindeutig identifiziert und die Rechnung intern zum richtigen Postfach oder zur richtigen Kostenstelle leitet.',
        en: 'Invoices to German public-sector buyers need a Leitweg-ID: a code that uniquely identifies the responsible administrative body and routes the invoice internally to the right inbox or cost centre.',
      },
      {
        de: 'Ohne gültige Leitweg-ID wird die Rechnung von den öffentlichen Empfangsplattformen zurückgewiesen, unabhängig davon, wie korrekt der übrige Inhalt ist. Der Auftraggeber teilt die passende ID in der Regel bei der Auftragsvergabe mit.',
        en: 'Without a valid Leitweg-ID, the invoice is rejected by the public-sector receiving platforms, regardless of how correct the rest of the content is. The buyer usually provides the matching ID when awarding the contract.',
      },
    ],
  },
  {
    id: 'v7',
    title: { de: 'Peppol im Detail', en: 'Peppol in detail' },
    body: [
      {
        de: 'Im Vier-Corner-Modell melden sich Sender und Empfänger je bei einem Access Point an, ihrem jeweiligen Peppol-Dienstleister. Beide Access Points sprechen ein gemeinsames Protokoll und übernehmen die eigentliche Übermittlung.',
        en: 'In the four-corner model, sender and receiver each register with an Access Point, their respective Peppol service provider. Both Access Points speak a shared protocol and handle the actual transmission.',
      },
      {
        de: 'Wer erreichbar sein will, lässt seine Peppol-ID im Teilnehmerverzeichnis eintragen. Ein sendender Access Point fragt dieses Verzeichnis ab, um den passenden Empfangs-Access-Point zu finden, und stellt dann direkt zu. Es braucht keine Vorabvereinbarung zwischen den Endpunkten.',
        en: 'Anyone who wants to be reachable registers their Peppol ID in the participant directory. A sending Access Point queries this directory to find the matching receiving Access Point and delivers directly. No prior agreement between the endpoints is needed.',
      },
    ],
  },
  {
    id: 'v8',
    title: { de: 'Archivierung und Nachvollziehbarkeit', en: 'Archiving and traceability' },
    body: [
      {
        de: 'Aufbewahrungspflichtig ist der strukturierte Datensatz, also die XML, nicht eine gedruckte oder exportierte Ansicht davon. Bei XRechnung ist das die XML-Datei selbst, bei ZUGFeRD und Factur-X die im PDF eingebettete XML.',
        en: 'The structured data set, meaning the XML, is what must be retained, not a printed or exported view of it. For XRechnung that is the XML file itself, for ZUGFeRD and Factur-X the XML embedded inside the PDF.',
      },
      {
        de: 'Das Original muss unveränderbar, vollständig und über die gesamte Aufbewahrungsfrist maschinenlesbar bleiben. Eine reine Bildschirmansicht oder ein Ausdruck ersetzt das Original nicht, auch wenn er für Menschen bequemer zu lesen ist.',
        en: 'The original must remain unalterable, complete and machine-readable for the entire retention period. A mere on-screen view or a printout does not replace the original, even though it is more convenient for humans to read.',
      },
    ],
  },
  {
    id: 'v9',
    title: { de: 'Fehlerbilder im Rechnungseingang', en: 'Error patterns in invoice receipt' },
    body: [
      {
        de: 'Typische Fehler sind eine falsche oder fehlende Leitweg-ID, eine Schema-Verletzung durch fehlerhafte Software beim Rechnungssteller, oder inhaltliche Abweichungen wie ein falscher Steuersatz. Jeder Fehlertyp braucht eine andere Reaktion.',
        en: 'Typical errors are a wrong or missing Leitweg-ID, a schema violation caused by faulty software at the issuer, or content mismatches such as a wrong tax rate. Each type of error needs a different response.',
      },
      {
        de: 'Formal ungültige Rechnungen werden zurückgewiesen, damit der Rechnungssteller korrigieren kann; das ist keine Ablehnung der Forderung, nur der Datei. Inhaltlich strittige, aber formal gültige Rechnungen werden storniert oder per Korrekturrechnung berichtigt. Beides bleibt nachvollziehbar dokumentiert.',
        en: 'Formally invalid invoices are rejected so the issuer can correct them; that rejects the file, not the underlying claim. Invoices that are formally valid but disputed in content are cancelled or corrected with a correction invoice. Both stay traceably documented.',
      },
    ],
  },
]
