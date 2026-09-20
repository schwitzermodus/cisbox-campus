/** Bewertungsstufen nach Prozent. Texte kommen aus i18n (rating.<tier>). */
export type RatingTier = 'low' | 'solid' | 'good' | 'strong'

/** Bestehensgrenze fuer den gruenen Haken auf der Kursuebersicht, deckungsgleich mit Stufe 'good'. */
export const PASS_PERCENT = 75

export function isPass(percent: number): boolean {
  return percent >= PASS_PERCENT
}

export function ratingTier(percent: number): RatingTier {
  if (percent >= 90) return 'strong'
  if (percent >= PASS_PERCENT) return 'good'
  if (percent >= 50) return 'solid'
  return 'low'
}

/**
 * Farbwerte fuer die Canvas-Ergebniskarte. Canvas kann keine CSS-Variablen aufloesen,
 * deshalb hier die cisbox-Tokens als Konstanten (siehe src/styles/tokens-*.css).
 */
export const CARD_COLORS = {
  light: {
    bg: '#ffffff',
    surface: '#f9f9f9',
    border: '#e0e0e0',
    text: '#202020',
    muted: '#646464',
    brand: '#215b33',
    brandSoft: '#e6f6eb',
  },
  dark: {
    bg: '#111111',
    surface: '#191919',
    border: '#333333',
    text: '#fcfcfc',
    muted: '#bbbbbb',
    brand: '#4ed07f',
    brandSoft: '#0d3a1f',
  },
} as const
export type CardTheme = keyof typeof CARD_COLORS
