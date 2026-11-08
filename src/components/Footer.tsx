import { useI18n } from '../i18n/t'
import { hashFor } from '../app/router'
import type { Route } from '../app/router'

/** Die App-Version wird beim Build erzeugt (siehe vite.config.ts, `__APP_VERSION__`). */
export function Footer({ route }: { route: Route }) {
  const { t } = useI18n()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <a href={hashFor({ locale: route.locale, screen: 'privacy' as const })}>{t('privacy.title')}</a>
        <span className="footer-version">{__APP_VERSION__}</span>
      </div>
    </footer>
  )
}
