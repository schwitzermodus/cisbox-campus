import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3201/cisbox-campus/',
    viewport: { width: 360, height: 740 },
  },
  webServer: {
    command: 'npx vite --port 3201 --strictPort',
    port: 3201,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 740 } } }],
})
