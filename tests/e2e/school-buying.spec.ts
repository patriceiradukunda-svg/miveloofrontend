import { test, expect } from '@playwright/test';
test('verified school browses the gallery, adds to basket and sees the Request button', async ({ page }) => {
  await page.goto('/login'); await page.getByRole('button', { name: /^School$/ }).click();
  await page.goto('/school/marketplace');
  await expect(page.getByRole('heading', { name: 'Marketplace' })).toBeVisible();
  await expect(page.getByRole('link', { name: /request/i }).first()).toHaveAttribute('href', '/school/requests/new');
  await page.getByRole('button', { name: /^Add White maize flour to basket/ }).click();
  await page.getByRole('button', { name: /^Basket/ }).click();
  await expect(page.getByRole('dialog', { name: 'Basket' }).getByText('White maize flour')).toBeVisible();
});
test('unverified school is gated; supplier cannot open the school marketplace', async ({ page, context }) => {
  await page.goto('/login'); await page.getByRole('button', { name: /not yet verified/i }).click();
  await page.goto('/school/marketplace'); await expect(page.getByRole('heading', { name: /verification needed/i })).toBeVisible();
  await context.clearCookies(); await page.goto('/login'); await page.getByRole('button', { name: /Individual supplier/ }).click();
  await page.goto('/school/marketplace'); await expect(page).toHaveURL(/access-denied/);
});
