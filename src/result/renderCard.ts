import { CARD_COLORS } from '../core/rating'
import type { CardTheme, RatingTier } from '../core/rating'
import type { I18n, MessageKey } from '../i18n/t'

export const CARD_W = 1200
export const CARD_H = 630

export type CardData = {
  score: number
  maxScore: number
  percent: number
  durationMs: number
  /** Unix ms des Versuchs (Datum auf der Karte) */
  at: number
  tier: RatingTier
  topic: string
  difficulty: string
}

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

/** Text auf Breite kuerzen. */
function fit(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text
  let s = text
  while (s.length > 1 && ctx.measureText(s + '…').width > maxW) s = s.slice(0, -1)
  return s + '…'
}

/**
 * Zeichnet die Ergebniskarte (1200 x 630) und liefert ein PNG als Blob.
 * Gleiche Datenquelle wie die HTML-Karte: Texte aus i18n, Stufen aus rating.ts.
 */
export async function renderResultCard(data: CardData, theme: CardTheme, i18n: I18n, logoUrl: string): Promise<Blob> {
  const c = CARD_COLORS[theme]
  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas nicht verfuegbar')
  const { t, num, duration, date } = i18n

  // Hintergrund
  ctx.fillStyle = c.bg
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  // Markenbalken links
  ctx.fillStyle = c.brand
  ctx.fillRect(0, 0, 18, CARD_H)

  // Kopf: Logo + Marke
  const logo = await loadImage(logoUrl)
  const pad = 72
  if (logo) ctx.drawImage(logo, pad, 56, 44, 44)
  ctx.fillStyle = c.text
  ctx.font = `600 30px ${FONT}`
  ctx.textBaseline = 'middle'
  ctx.fillText(t('card.brand'), pad + (logo ? 60 : 0), 78)

  // Thema
  ctx.fillStyle = c.muted
  ctx.font = `500 26px ${FONT}`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(t('card.topicLine', { topic: data.topic, difficulty: data.difficulty }), pad, 160)

  // Punkte gross
  ctx.fillStyle = c.brand
  ctx.font = `700 168px ${FONT}`
  const scoreText = num(data.score)
  ctx.fillText(scoreText, pad - 6, 330)
  const scoreW = ctx.measureText(scoreText).width
  ctx.fillStyle = c.muted
  ctx.font = `500 34px ${FONT}`
  ctx.fillText(t('card.points') + ' ' + t('card.of', { max: num(data.maxScore) }), pad + scoreW + 22, 330)

  // Prozent-Badge
  ctx.font = `700 40px ${FONT}`
  const pctText = num(data.percent) + ' %'
  const pctW = ctx.measureText(pctText).width + 48
  roundRect(ctx, pad, 372, pctW, 68, 12)
  ctx.fillStyle = c.brandSoft
  ctx.fill()
  ctx.fillStyle = c.brand
  ctx.textBaseline = 'middle'
  ctx.fillText(pctText, pad + 24, 407)

  // Bewertungsstufe
  ctx.fillStyle = c.text
  ctx.font = `500 32px ${FONT}`
  ctx.fillText(fit(ctx, t(('rating.' + data.tier) as MessageKey), CARD_W - pad - (pad + pctW + 28)), pad + pctW + 28, 407)

  // Fusszeile: Dauer, Datum, Hinweis
  ctx.strokeStyle = c.border
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(pad, 496)
  ctx.lineTo(CARD_W - pad, 496)
  ctx.stroke()

  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = c.muted
  ctx.font = `500 24px ${FONT}`
  ctx.fillText(t('result.duration') + ': ' + duration(data.durationMs), pad, 548)
  ctx.fillText(t('result.date') + ': ' + date(data.at), pad + 360, 548)
  ctx.fillStyle = c.muted
  ctx.font = `400 22px ${FONT}`
  ctx.fillText(fit(ctx, t('card.footer'), CARD_W - 2 * pad), pad, 590)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob fehlgeschlagen'))), 'image/png')
  })
}
