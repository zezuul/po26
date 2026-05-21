import { test, expect } from '@playwright/test';

test.describe('Koszyk — spójność między kartami', () => {
  test('dodanie w jednej karcie widoczne w drugiej', async ({ context, page }) => {
    await page.goto('/');
    await page.getByTestId('add-to-cart-1').click();
    await page.getByTestId('add-to-cart-1').click();

    const page2 = await context.newPage();
    await page2.goto('/cart');

    await expect(page.getByTestId('nav-cart')).toContainText('Koszyk (2)');
    await expect(page2.getByTestId('nav-cart')).toContainText('Koszyk (2)');

    await page2.getByTestId('qty-increase-1').click();
    await page2.waitForTimeout(300);

    await expect(page.getByTestId('nav-cart')).toContainText('Koszyk (3)');
    await expect(page2.getByTestId('nav-cart')).toContainText('Koszyk (3)');
  });
});
