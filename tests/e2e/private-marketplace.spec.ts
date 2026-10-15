import { test, expect } from '@playwright/test';
test('visitors cannot reach the marketplace and the header does not offer it', async ({ page }) => {
  await page.goto('/'); const nav = page.getByRole('navigation', { name: 'Main' }).first();
  await expect(nav.getByRole('link', { name: /marketplace/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Sell on Miveloo' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'School login' }).first()).toBeVisible();
  for (const p of ['/marketplace', '/marketplace/prd-1', '/suppliers']) { await page.goto(p); await expect(page).toHaveURL(/\/login/); }
});
test('suppliers are refused; verified schools are routed to their own marketplace', async ({ page, context }) => {
  await page.goto('/login'); await page.getByRole('button', { name: /Individual supplier/ }).click();
  await page.goto('/marketplace'); await expect(page).toHaveURL(/access-denied/);
  await context.clearCookies(); await page.goto('/login'); await page.getByRole('button', { name: /^School$/ }).click();
  await page.goto('/marketplace'); await expect(page).toHaveURL(/\/school\/marketplace/);
});
