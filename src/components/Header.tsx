import { ACTIVE_LOCALES } from '../core/types'
import type { ActiveLocale } from '../core/types'
import { useI18n } from '../i18n/t'
import type { ThemePreference } from '../state/localHistory'
import { hashFor, isCourseRoute, withLocale } from '../app/router'
import type { Route } from '../app/router'

type Props = {
  route: Route
  themePref: ThemePreference
  onTheme: (p: ThemePreference) => void
}

const LOGO = import.meta.env.BASE_URL + 'logo/cisbox-o.svg'

export function Header({ route, themePref, onTheme }: Props) {
  const { t } = useI18n()

  const switchLocale = (locale: ActiveLocale) => {
    // Hash-Wechsel: kein Reload, Quiz-State bleibt (sessionStorage + React)
    window.location.hash = hashFor(withLocale(route, locale))
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <a className="brand" href={hashFor({ locale: route.locale, screen: 'courses' })} aria-label={t('header.home')}>
            <img className="brand-mark" src={LOGO} alt="" width={28} height={28} />
            <span className="brand-name">{t('app.title')}</span>
          </a>
          {isCourseRoute(route) ? (
            <a className="header-back" href={hashFor({ locale: route.locale, screen: 'courses' })}>
              {t('header.allCourses')}
            </a>
          ) : null}
        </div>
        <div className="header-controls">
          <div className="seg" role="group" aria-label={t('header.language')}>
            {ACTIVE_LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={route.locale === l}
                lang={l}
                onClick={() => switchLocale(l)}
                aria-label={t(l === 'de' ? 'lang.de' : 'lang.en')}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <label className="vh" htmlFor="theme-select">
            {t('header.theme')}
          </label>
          <select
            id="theme-select"
            className="select"
            value={themePref}
            onChange={(e) => onTheme(e.target.value as ThemePreference)}
          >
            <option value="system">{t('theme.system')}</option>
            <option value="light">{t('theme.light')}</option>
            <option value="dark">{t('theme.dark')}</option>
          </select>
        </div>
      </div>
    </header>
  )
}
