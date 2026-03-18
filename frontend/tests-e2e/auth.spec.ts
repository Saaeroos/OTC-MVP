import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect to /auth when not logged in', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*\/auth/);
    await expect(page.getByText('Please select a role to begin.')).toBeVisible();
  });

  test('should allow selecting a role and log in', async ({ page }) => {
    await page.goto('/auth');

    // Select role (assuming the simulated login dropdown is visible)
    const select = page.locator('select');
    await select.selectOption({ label: 'John Doe (trader)' });

    // Should redirect to home
    await expect(page).toHaveURL('http://localhost:3000/');
    await expect(page.getByText(/Trade Console/i)).toBeVisible();
    await expect(page.getByText(/John Doe/i)).toBeVisible();
  });
});
