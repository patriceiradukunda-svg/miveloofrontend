import { test, expect } from '@playwright/test';
test('verified school can build a purchase request', async ({ page }) => {
  await page.goto('/login'); await page.getByRole('button', { name: /^School$/ }).click();
  await page.goto('/school/marketplace'); await page.getByLabel('Quantity of Maize flour').fill('100');
  await expect(page.getByText('Estimated total')).toBeVisible();
});
test('unverified school is gated; supplier cannot open school marketplace', async ({ page, context }) => {
  await page.goto('/login'); await page.getByRole('button', { name: /not yet verified/i }).click();
  await page.goto('/school/marketplace'); await expect(page.getByRole('heading', { name: /verification needed/i })).toBeVisible();
  await context.clearCookies(); await page.goto('/login'); await page.getByRole('button', { name: /Individual supplier/ }).click();
  await page.goto('/school/marketplace'); await expect(page).toHaveURL(/access-denied/);
});
