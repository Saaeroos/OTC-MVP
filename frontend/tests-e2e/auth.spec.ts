import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the users API
    await page.route('**/api/auth/simulated-users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', username: 'mo_alhayek', name: 'Mo Alhayek', role: 'trader' },
          { id: '2', username: 'sarah_manager', name: 'Sarah Manager', role: 'manager' },
        ]),
      });
    });

    // Mock the login API
    await page.route('**/api/auth/simulate-login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake-token',
          token_type: 'bearer',
          user: { id: '1', username: 'mo_alhayek', name: 'Mo Alhayek', role: 'trader' },
        }),
      });
    });

    // Mock trades and divisions for home page
    await page.route('**/api/trades', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/divisions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
  });

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
    await select.selectOption({ label: 'Mo Alhayek (trader)' });

    // Should redirect to home
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByText(/Trade Console/i)).toBeVisible();
    await expect(page.getByText(/Mo Alhayek/i)).toBeVisible();
  });
});
