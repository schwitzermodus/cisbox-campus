import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'

// Strikte CSP nur im Production-Build: im Dev-Modus injiziert Vite Styles inline (HMR),
// das wuerde style-src 'self' blockieren. GitHub Pages kann keine Header setzen, deshalb als <meta>.
const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; font-src 'self'; " +
  "connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'"

const CSP_META = '<meta http-equiv="Content-Security-Policy" content="' + CSP + '" />'

function cspMeta(): Plugin {
  return {
    name: 'cisbox-csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    ' + CSP_META)
    },
  }
}

// GitHub Pages: Projektseite unter https://schwitzermodus.github.io/cisbox-campus/
export default defineConfig({
  base: '/cisbox-campus/',
  plugins: [react(), cspMeta()],
  server: { port: 3200, strictPort: true },
  build: { target: 'es2022' },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
})
