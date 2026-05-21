import { test, expect } from '@playwright/test';

/**
 * Scenariusz E2E — minimum 50 asercji (wymaganie 5.0).
 */
test('pełny przepływ sklepu: rejestracja → zakupy → płatność', async ({ page }) => {
  const email = `e2e_${Date.now()}@test.pl`;
  const password = 'haslo123';
  const name = 'E2E Użytkownik';

  await page.goto('/');
  await expect(page.locator('h1')).toContainText('PO26');
  await expect(page.locator('h1')).toContainText('React');
  await expect(page.getByTestId('products-page')).toBeVisible();
  await expect(page.getByTestId('nav-register')).toBeVisible();
  await expect(page.getByTestId('nav-login')).toBeVisible();
  await expect(page.getByTestId('nav-cart')).toContainText('(0)');
  await expect(page.getByTestId('product-search')).toBeVisible();
  await expect(page.getByTestId('add-to-cart-1')).toBeEnabled();
  await expect(page.getByTestId('add-to-cart-5')).toBeEnabled();

  await page.getByTestId('nav-register').click();
  await expect(page).toHaveURL(/\/register/);
  await expect(page.getByTestId('register-form')).toBeVisible();

  await page.getByTestId('register-name').fill(name);
  await expect(page.getByTestId('register-name')).toHaveValue(name);
  await page.getByTestId('register-email').fill(email);
  await expect(page.getByTestId('register-email')).toHaveValue(email);
  await page.getByTestId('register-password').fill(password);
  await expect(page.getByTestId('register-password')).toHaveValue(password);
  await page.getByTestId('register-submit').click();
  await expect(page.getByTestId('register-message')).toBeVisible();
  await expect(page.getByTestId('error-name')).toHaveCount(0);
  await expect(page.getByTestId('error-email')).toHaveCount(0);

  await page.waitForURL('**/login');
  await expect(page.getByTestId('login-page')).toBeVisible();
  await page.getByTestId('login-email').fill(email);
  await expect(page.getByTestId('login-email')).toHaveValue(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('login-error')).toHaveCount(0);

  await expect(page.getByTestId('nav-account')).toBeVisible();
  await expect(page.getByTestId('nav-logout')).toBeVisible();
  await expect(page.getByTestId('nav-register')).toHaveCount(0);

  await page.goto('/');
  await expect(page.getByTestId('product-1')).toBeVisible();
  await expect(page.getByTestId('product-2')).toBeVisible();
  await expect(page.getByTestId('product-3')).toBeVisible();

  await page.getByTestId('product-search').fill('Laptop');
  await expect(page.getByTestId('search-preview')).toBeVisible();
  await expect(page.getByTestId('product-1')).toBeVisible();
  await expect(page.getByTestId('product-2')).toHaveCount(0);

  await page.getByTestId('product-search').fill('');
  await page.getByTestId('add-to-cart-1').click();
  await page.getByTestId('add-to-cart-3').click();
  await page.getByTestId('add-to-cart-3').click();
  await expect(page.getByTestId('nav-cart')).toContainText('(3)');

  await page.getByTestId('nav-cart').click();
  await expect(page.getByTestId('cart-page')).toBeVisible();
  await expect(page.getByTestId('cart-item-1')).toBeVisible();
  await expect(page.getByTestId('cart-item-3')).toBeVisible();
  await expect(page.getByTestId('qty-value-1')).toHaveText('1');
  await expect(page.getByTestId('qty-value-3')).toHaveText('2');

  await page.getByTestId('qty-increase-1').click();
  await expect(page.getByTestId('qty-value-1')).toHaveText('2');
  await expect(page.getByTestId('nav-cart')).toContainText('(4)');

  const totalText = await page.getByTestId('cart-total').innerText();
  expect(totalText).toMatch(/PLN/);
  expect(totalText.length).toBeGreaterThan(5);

  await page.getByTestId('cart-to-payment').click();
  await expect(page).toHaveURL(/\/payment/);
  await expect(page.locator('h2')).toHaveText('Płatności');

  await page.locator('#cardHolder').fill('Jan Testowy');
  await expect(page.locator('#cardHolder')).toHaveValue('Jan Testowy');
  await page.locator('#email').fill(email);
  await expect(page.locator('#email')).toHaveValue(email);
  await expect(page.getByRole('button', { name: /Zapłać/ })).toBeEnabled();
  await page.getByRole('button', { name: /Zapłać/ }).click();

  await expect(page.locator('.success')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('.success')).not.toBeEmpty();
  await expect(page.getByTestId('nav-cart')).toContainText('(0)');

  await page.getByTestId('nav-account').click();
  await expect(page.getByTestId('account-page')).toBeVisible();
  await expect(page.getByTestId('account-current-name')).toContainText(name);

  await page.getByTestId('account-display-name').fill('Po zakupach');
  await page.getByTestId('account-submit').click();
  await expect(page.getByTestId('account-success')).toBeVisible();
  await expect(page.getByTestId('account-current-name')).toContainText('Po zakupach');
  await expect(page.getByTestId('nav-account')).toContainText('Po zakupach');

  await page.getByTestId('nav-logout').click();
  await expect(page.getByTestId('nav-login')).toBeVisible();
  await expect(page.getByTestId('nav-account')).toHaveCount(0);

  await page.goto('/account');
  await expect(page).toHaveURL(/\/login/);
});
