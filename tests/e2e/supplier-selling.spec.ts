import { test, expect } from '@playwright/test';
test('supplier sees only own listings by status and can add a listing', async ({ page }) => {
  await page.goto('/login'); await page.getByRole('button', { name: /Individual supplier/ }).click();
  await page.goto('/supplier/products'); await expect(page.getByRole('heading', { name: 'My listings' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add listing' }).first()).toHaveAttribute('href', '/supplier/products/new');
  await page.getByRole('button', { name: /Draft/ }).click(); await expect(page).toHaveURL(/status=draft/);
  await expect(page.getByText('Draft').first()).toBeVisible();
});
