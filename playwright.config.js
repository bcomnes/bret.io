import { defineConfig } from '@playwright/test'

const port = 4274
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './playwright',
  forbidOnly: Boolean(process.env['CI']),
  use: {
    baseURL,
    browserName: 'chromium',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: `domstack serve --port ${port}`,
    url: `${baseURL}/robots.txt`,
    timeout: 60_000
  }
})
