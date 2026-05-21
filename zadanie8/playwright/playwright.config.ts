import { defineConfig, devices } from '@playwright/test';

const CLIENT_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3010';
const SERVER_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:3011';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: CLIENT_URL,
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },
  webServer: [
    {
      command: 'npm start',
      cwd: '../server',
      url: `${SERVER_URL}/api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { PORT: '3011', CORS_ORIGIN: CLIENT_URL },
    },
    {
      command: 'npm run dev',
      cwd: '../client',
      url: CLIENT_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { VITE_API_URL: SERVER_URL },
    },
  ],
});
