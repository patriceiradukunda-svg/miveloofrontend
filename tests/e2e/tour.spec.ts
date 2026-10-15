import { test, expect } from '@playwright/test';
test('founder tour steps through and ends with registration paths', async ({ page }) => {
  await page.goto('/tour');
  await expect(page.getByRole('heading', { name: /why miveloo exists/i })).toBeVisible();
  for (let i = 0; i < 8; i++) await page.getByRole('button', { name: /^next/i }).click();
  await expect(page.getByRole('link', { name: /I run a school/ })).toBeVisible();
});
test('home page offers the tour launcher and works at mobile width', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: /tour with the founder/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toBeHidden();
});
