import { useEffect, useMemo, useState } from 'react'
import { courseById } from '../content/registry'
import { I18nContext, makeI18n } from '../i18n/t'
import { updateHistory } from '../state/localHistory'
import type { ThemePreference } from '../state/localHistory'
import { applyTheme, readThemePreference, saveThemePreference, watchSystemTheme } from '../state/theme'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { CoursesScreen } from '../screens/Courses'
import { CourseOverviewScreen } from '../screens/CourseOverview'
import { LearnScreen } from '../screens/Learn'
import { QuizScreen } from '../screens/Quiz'
import { ResultScreen } from '../screens/Result'
import { PrivacyScreen } from '../screens/Privacy'
import { ErrorBoundary } from './ErrorBoundary'
import { isCourseRoute, navigate, useRoute } from './router'

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

  const courseId = isCourseRoute(route) ? route.courseId : null
  const course = courseId ? courseById(courseId) : null

  // Unbekannte (noch nicht angelegte) Kurs-ID: zurueck auf die Uebersicht statt Absturz.
  useEffect(() => {
    if (courseId && !course) navigate({ locale: route.locale, screen: 'courses' })
  }, [courseId, course, route.locale])

  // Beim Screen- oder Kurswechsel nach oben
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [route.screen, courseId])

  const onTheme = (p: ThemePreference) => {
    setThemePref(p)
    saveThemePreference(p)
  }

  let screen
  if (isCourseRoute(route)) {
    if (!course) {
      screen = null
    } else {
      switch (route.screen) {
        case 'overview':
          screen = <CourseOverviewScreen route={route} course={course} />
          break
        case 'learn':
          screen = <LearnScreen route={route} course={course} />
          break
        case 'quiz':
          screen = <QuizScreen route={route} course={course} />
          break
        case 'result':
          screen = <ResultScreen route={route} course={course} themePref={themePref} />
          break
      }
    }
  } else {
    switch (route.screen) {
      case 'courses':
        screen = <CoursesScreen route={route} />
        break
      case 'privacy':
        screen = <PrivacyScreen route={route} />
        break
    }
  }

  return (
    <I18nContext.Provider value={i18n}>
      <a className="skip-link" href="#main">
        {i18n.t('app.skipToContent')}
      </a>
      <Header route={route} themePref={themePref} onTheme={onTheme} />
      <main id="main" className="main" tabIndex={-1}>
        <ErrorBoundary key={route.screen + ':' + (courseId ?? '')}>{screen}</ErrorBoundary>
      </main>
      <Footer route={route} />
    </I18nContext.Provider>
  )
}
