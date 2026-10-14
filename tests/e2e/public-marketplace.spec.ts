import { test, expect } from '@playwright/test';
test('visitors can browse and filter but never see purchase controls', async ({ page }) => {
  await page.goto('/marketplace');
  await expect(page.getByRole('heading', { name: /food listings/i })).toBeVisible();
  await page.getByLabel('Search food').fill('beans');
  await expect(page.getByRole('link', { name: 'Dry beans' })).toBeVisible();
  await page.getByRole('link', { name: 'Dry beans' }).click();
  await expect(page.getByRole('button', { name: /add to|order now|buy|submit request/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'School login' }).first()).toBeVisible();
});
