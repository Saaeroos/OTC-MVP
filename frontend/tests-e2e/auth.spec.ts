import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect to /auth when not logged in', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*\/auth/);
    await expect(page.getByText('Please select a role to begin.')).toBeVisible();
  });

  test('should allow selecting a role and log in', async ({ page }) => {
    await page.goto('/auth');

    // Wait for the select element to be visible and options to load
    const select = page.locator('select#role-select');
    await select.waitFor({ state: 'visible' });
    
    // Select a user by label (more robust than index)
    // We select the trader user
    await select.selectOption({ label: 'John Doe (trader)' });

    // Should redirect to home
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByText(/Trade Console/i)).toBeVisible();
    await expect(page.getByText(/John Doe/i)).toBeVisible();
  });
});
