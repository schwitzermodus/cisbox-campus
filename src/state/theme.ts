import { readHistory, updateHistory } from './localHistory'
import type { ThemePreference } from './localHistory'

export type ResolvedTheme = 'light' | 'dark'

const media = () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null)

export function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === 'light' || pref === 'dark') return pref
  return media()?.matches ? 'dark' : 'light'
}

export function readThemePreference(): ThemePreference {
  return readHistory().theme ?? 'system'
}

export function applyTheme(pref: ThemePreference): ResolvedTheme {
  const resolved = resolveTheme(pref)
  document.documentElement.setAttribute('data-theme', resolved)
  return resolved
}

export function saveThemePreference(pref: ThemePreference): void {
  updateHistory((h) => ({ ...h, theme: pref }))
}

/** Reagiert auf System-Wechsel, solange die Praeferenz „system“ ist. */
export function watchSystemTheme(getPref: () => ThemePreference, onChange: (t: ResolvedTheme) => void): () => void {
  const m = media()
  if (!m) return () => {}
  const handler = () => {
    if (getPref() === 'system') onChange(applyTheme('system'))
  }
  m.addEventListener('change', handler)
  return () => m.removeEventListener('change', handler)
}
