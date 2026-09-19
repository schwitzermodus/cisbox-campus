import { Component } from 'react'
import type { ReactNode } from 'react'
import { I18nContext } from '../i18n/t'

type Props = { children: ReactNode }
type State = { failed: boolean }

export class ErrorBoundary extends Component<Props, State> {
  static contextType = I18nContext
  declare context: React.ContextType<typeof I18nContext>
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    const t = this.context.t
    return (
      <div className="card stack" role="alert">
        <h1>{t('error.title')}</h1>
        <p>{t('error.body')}</p>
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          {t('error.reload')}
        </button>
      </div>
    )
  }
}
