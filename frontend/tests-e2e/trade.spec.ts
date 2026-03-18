import { test, expect } from '@playwright/test';

test.describe('Trade Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as trader
    await page.goto('/auth');
    const select = page.locator('select');
    await select.selectOption({ label: 'John Doe (trader)' });
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('should allow a trader to capture a new trade', async ({ page }) => {
    await page.getByRole('button', { name: /Capture New Trade/i }).click();

    // Fill the form
    await page.getByLabel(/Seller/i).fill('Test Seller');
    await page.getByLabel(/Buyer/i).fill('Test Buyer');
    await page.getByLabel(/Product/i).fill('Solar GVO');

    const divisionSelect = page.locator('select').nth(1); // Second select in the page (modal)
    await divisionSelect.selectOption({ label: 'Solar' });

    await page.getByLabel(/Quantity/i).fill('100');
    await page.getByLabel(/Price/i).fill('50');

    // Submit
    await page.getByRole('button', { name: /Capture Trade/i }).click();

    // Check if modal closed and trade is in the list
    await expect(page.getByText(/Capture New Energy Trade/i)).not.toBeVisible();
    await expect(page.getByText('Test Seller')).toBeVisible();
    await expect(page.getByText('Test Buyer')).toBeVisible();
  });
});
