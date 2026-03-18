import { test, expect } from '@playwright/test';

test.describe('Trade Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as trader
    await page.goto('/auth');
    const select = page.locator('select#role-select');
    await select.waitFor({ state: 'visible' });
    // Select the trader user explicitly by label content
    await select.selectOption({ label: 'John Doe (trader)' });
    await expect(page).toHaveURL('http://localhost:5173/');
  });

  test('should allow a trader to capture a new trade', async ({ page }) => {
    const timestamp = Date.now();
    const sellerName = `Test Seller ${timestamp}`;
    const buyerName = `Test Buyer ${timestamp}`;

    await page.getByRole('button', { name: /Capture New Trade/i }).click();

    // Fill the form
    await page.getByLabel(/Seller/i).fill(sellerName);
    await page.getByLabel(/Buyer/i).fill(buyerName);
    await page.getByLabel(/Product/i).fill('Solar GVO');

    // Select Division using the label and wait for options
    const divisionSelect = page.getByLabel(/Division/i);
    await expect(divisionSelect).toBeVisible();
    await divisionSelect.selectOption({ label: 'Solar' });

    await page.getByLabel(/Quantity/i).fill('100');
    await page.getByLabel(/Price/i).fill('50');

    // Submit
    await page.getByRole('button', { name: /Capture Trade/i }).click();

    // Check if modal closed and trade is in the list
    await expect(page.getByText(/Capture New Energy Trade/i)).not.toBeVisible();
    await expect(page.getByText(sellerName)).toBeVisible();
    await expect(page.getByText(buyerName)).toBeVisible();
  });
});
