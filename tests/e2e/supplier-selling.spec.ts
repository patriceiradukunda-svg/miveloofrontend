import { test, expect } from '@playwright/test';
test('supplier validates and manages listings', async ({ page }) => {
  await page.goto('/login'); await page.getByRole('button', { name: /Individual supplier/ }).click();
  await page.goto('/supplier/products/new'); await page.getByRole('button', { name: /save draft/i }).click();
  await expect(page.getByText('Enter the product name.')).toBeVisible();
  await page.goto('/supplier/products'); await page.getByRole('button', { name: 'Archive' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
