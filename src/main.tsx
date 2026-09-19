import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens-light.css'
import './styles/tokens-dark.css'
import './styles/base.css'
import { App } from './app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
