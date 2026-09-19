import { useEffect, useMemo, useState } from 'react'
import { I18nContext, makeI18n } from '../i18n/t'
import { updateHistory } from '../state/localHistory'
import type { ThemePreference } from '../state/localHistory'
import { applyTheme, readThemePreference, saveThemePreference, watchSystemTheme } from '../state/theme'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { StartScreen } from '../screens/Start'
import { LearnScreen } from '../screens/Learn'
import { QuizScreen } from '../screens/Quiz'
import { ResultScreen } from '../screens/Result'
import { PrivacyScreen } from '../screens/Privacy'
import { ErrorBoundary } from './ErrorBoundary'
import { useRoute } from './router'

export function App() {
  const route = useRoute()
  const i18n = useMemo(() => makeI18n(route.locale), [route.locale])
  const [themePref, setThemePref] = useState<ThemePreference>(() => readThemePreference())

  useEffect(() => {
    document.documentElement.lang = route.locale
    document.title = i18n.t('app.title')
    updateHistory((h) => (h.preferredLocale === route.locale ? h : { ...h, preferredLocale: route.locale }))
  }, [route.locale, i18n])

  useEffect(() => {
    applyTheme(themePref)
    return watchSystemTheme(() => themePref, () => {})
  }, [themePref])

  // Beim Screen-Wechsel nach oben, Fokus auf den Inhalt
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [route.screen])

  const onTheme = (p: ThemePreference) => {
    setThemePref(p)
    saveThemePreference(p)
  }

  let screen
  switch (route.screen) {
    case 'start':
      screen = <StartScreen route={route} />
      break
    case 'learn':
      screen = <LearnScreen route={route} />
      break
    case 'quiz':
      screen = <QuizScreen route={route} />
      break
    case 'result':
      screen = <ResultScreen route={route} themePref={themePref} />
      break
    case 'privacy':
      screen = <PrivacyScreen route={route} />
      break
  }

  return (
    <I18nContext.Provider value={i18n}>
      <a className="skip-link" href="#main">
        {i18n.t('app.skipToContent')}
      </a>
      <Header route={route} themePref={themePref} onTheme={onTheme} />
      <main id="main" className="main" tabIndex={-1}>
        <ErrorBoundary key={route.screen}>{screen}</ErrorBoundary>
      </main>
      <Footer route={route} />
    </I18nContext.Provider>
  )
}
