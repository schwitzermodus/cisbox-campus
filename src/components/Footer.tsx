import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/t'
import { hashFor } from '../app/router'
import type { Route } from '../app/router'

/**
 * Die App-Version pflegt der pre-commit-Hook in index.html (`.app-version`).
 * Wir lesen sie einmalig aus dem DOM, statt sie als fixes Overlay stehen zu lassen
 * (das hat mobil den Inhalt ueberlagert).
 */
function readAppVersion(): string {
  try {
    return document.querySelector('.app-version')?.textContent?.trim() ?? ''
  } catch {
    return ''
  }
}

export function Footer({ route }: { route: Route }) {
  const { t } = useI18n()
  const [version, setVersion] = useState('')

  useEffect(() => {
    setVersion(readAppVersion())
  }, [])

  return (
    <footer className="footer">
      <div className="footer-inner">
        <a href={hashFor({ locale: route.locale, screen: 'privacy' })}>{t('privacy.title')}</a>
        {version ? <span className="footer-version">{version}</span> : null}
      </div>
    </footer>
  )
}
