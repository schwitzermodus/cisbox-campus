import { useState } from 'react'
import { hashFor } from '../app/router'
import type { Route } from '../app/router'
import { useI18n } from '../i18n/t'
import { clearHistory } from '../state/localHistory'
import { clearSession } from '../state/quizSession'
import { clearFinished } from '../state/resultStore'

export function PrivacyScreen({ route }: { route: Route }) {
  const { t } = useI18n()
  const [cleared, setCleared] = useState(false)

  const clear = () => {
    clearHistory()
    clearSession()
    clearFinished()
    setCleared(true)
  }

  return (
    <article className="card stack">
      <div>
        <h1>{t('privacy.title')}</h1>
        <p>{t('privacy.p1')}</p>
        <p>{t('privacy.p2')}</p>
        <p>{t('privacy.p3')}</p>
        <p>{t('privacy.p4')}</p>
        <p>{t('privacy.p5')}</p>
      </div>
      <div className="stack-sm">
        <button type="button" className="btn btn-danger" onClick={clear}>
          {t('privacy.clear')}
        </button>
        <p className="muted small" role="status">
          {cleared ? t('privacy.cleared') : t('privacy.clearHint')}
        </p>
      </div>
      <a className="btn btn-tertiary" href={hashFor({ locale: route.locale, screen: 'start' })}>
        {t('privacy.back')}
      </a>
    </article>
  )
}
