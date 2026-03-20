import { test, expect } from '@playwright/test';

test.describe('Trade Management Flow', () => {
  test.beforeEach(async ({ page }) => {
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

    // Mock divisions
    await page.route('**/api/divisions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Solar', identifier: 2 },
          { id: '123e4567-e89b-12d3-a456-426614174001', name: 'Wind', identifier: 1 },
        ]),
      });
    });

    // Mock trades
    const trades: Record<string, unknown>[] = [];
    await page.route('**/api/trades*', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = JSON.parse(route.request().postData() || '{}');
        const newTrade = {
          id: '123e4567-e89b-12d3-a456-426614174002',
          trade_id: '12.03.2026-000001.2',
          seller: postData.seller,
          buyer: postData.buyer,
          product: postData.product,
          quantity: postData.quantity,
          price: postData.price,
          total_price: postData.quantity * postData.price,
          delivery_date: postData.delivery_date,
          status: 'pending',
          division_id: postData.division_id,
          created_by_id: '1',
          created_at: new Date().toISOString(),
        };
        trades.push(newTrade);
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newTrade),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: trades,
            total: trades.length,
            page: 1,
            size: 10,
            pages: 1,
          }),
        });
      }
    });

    // Log in as trader
    await page.goto('/auth');
    const select = page.locator('select#role-select');
    await select.waitFor({ state: 'visible' });
    // Select the trader user explicitly by label content
    await select.selectOption({ label: 'Mo Alhayek (trader)' });
    await expect(page).toHaveURL('http://localhost:5173/');
  });

  test('should allow a trader to capture a new trade', async ({ page }) => {
    const timestamp = Date.now();
    const sellerName = `Test Seller ${timestamp}`;
    const buyerName = `Test Buyer ${timestamp}`;

    await page.getByRole('button', { name: /Capture New Trade/i }).click();

    // Fill the trade capture form
    await page.getByLabel(/Seller/i).fill(sellerName);
    await page.getByLabel(/Buyer/i).fill(buyerName);
    await page.getByLabel(/Product/i).fill('Solar GVO');

    // Select Division
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
