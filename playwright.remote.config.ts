import { defineConfig, devices } from '@playwright/test';
const bypass = process.env.VERCEL_BYPASS;
export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: /role-access\.spec\.ts/,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL,
    ...(bypass ? { extraHTTPHeaders: { 'x-vercel-protection-bypass': bypass, 'x-vercel-set-bypass-cookie': 'true' } } : {}),
  },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'] } }],
});
