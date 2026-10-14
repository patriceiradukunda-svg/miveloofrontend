import { test, expect } from '@playwright/test';
test('private URLs redirect visitors to login', async ({ page }) => {
  for (const p of ['/school/marketplace', '/supplier/products', '/admin/dashboard', '/institution/dashboard']) {
    await page.goto(p); await expect(page).toHaveURL(/\/login\?next=/);
  }
});
test('registration shows understandable errors', async ({ page }) => {
  await page.goto('/register/supplier'); await page.getByRole('button', { name: /create account/i }).click();
  await expect(page.getByText('Enter your full name.')).toBeVisible();
});
