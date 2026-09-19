import { createContext, useContext } from 'react'
import de from './messages.de.json'
import en from './messages.en.json'
import fr from './messages.fr.json'
import no from './messages.no.json'
import vi from './messages.vi.json'
import type { Locale, LocalizedText } from '../core/types'

export type MessageKey = keyof typeof de
export type Params = Record<string, string | number>

export const MESSAGES: Record<Locale, Record<string, string>> = { de, en, fr, no, vi }

export function interpolate(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (m, name: string) => {
    const v = params[name]
    return v === undefined ? m : String(v)
  })
}

/** UI-Text: Locale -> Fallback de -> Key. Leere Werte (FR/NO/VI-Geruest) fallen ebenfalls auf de zurueck. */
export function translate(locale: Locale, key: MessageKey, params?: Params): string {
  const own = MESSAGES[locale]?.[key]
  const text = own && own.length > 0 ? own : (MESSAGES.de[key] ?? key)
  return interpolate(text, params)
}

/** Fachinhalt: LocalizedText -> Locale -> Fallback de. */
export function lt(locale: Locale, text: LocalizedText): string {
  const v = text[locale]
  return v && v.length > 0 ? v : text.de
}

export function formatNumber(locale: Locale, n: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, opts).format(n)
}

export function formatDate(locale: Locale, ms: number): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(ms))
}

/** ISO-Datum (YYYY-MM-DD) lokalisiert, ohne Zeitzonen-Verschiebung. */
export function formatIsoDate(locale: Locale, iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(Date.UTC(y, m - 1, d, 12)))
}

export function formatDuration(locale: Locale, ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return m > 0 ? translate(locale, 'common.minutesSeconds', { m, s }) : translate(locale, 'common.seconds', { s })
}

export type I18n = {
  locale: Locale
  t: (key: MessageKey, params?: Params) => string
  lt: (text: LocalizedText) => string
  num: (n: number, opts?: Intl.NumberFormatOptions) => string
  date: (ms: number) => string
  isoDate: (iso: string) => string
  duration: (ms: number) => string
}

export function makeI18n(locale: Locale): I18n {
  return {
    locale,
    t: (key, params) => translate(locale, key, params),
    lt: (text) => lt(locale, text),
    num: (n, opts) => formatNumber(locale, n, opts),
    date: (ms) => formatDate(locale, ms),
    isoDate: (iso) => formatIsoDate(locale, iso),
    duration: (ms) => formatDuration(locale, ms),
  }
}

export const I18nContext = createContext<I18n>(makeI18n('de'))

export function useI18n(): I18n {
  return useContext(I18nContext)
}
