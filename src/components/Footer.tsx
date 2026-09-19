import { CONTENT_AS_OF } from '../content/e-invoicing/meta'
import { useI18n } from '../i18n/t'
import { hashFor } from '../app/router'
import type { Route } from '../app/router'

export function Footer({ route }: { route: Route }) {
  const { t, isoDate } = useI18n()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>{t('common.asOf', { date: isoDate(CONTENT_AS_OF) })}</span>
        <a href={hashFor({ locale: route.locale, screen: 'privacy' })}>{t('privacy.title')}</a>
      </div>
    </footer>
  )
}
