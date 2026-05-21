import { test, expect } from '@playwright/test';

test.describe('Rejestracja — walidacja pól', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByTestId('register-page')).toBeVisible();
  });

  test('puste pola — komunikaty o polach wymaganych', async ({ page }) => {
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('error-name')).toHaveText('Imię jest wymagane');
    await expect(page.getByTestId('error-email')).toHaveText('E-mail jest wymagany');
    await expect(page.getByTestId('error-password')).toHaveText('Hasło jest wymagane');
  });

  test('niepoprawny format e-mail', async ({ page }) => {
    await page.getByTestId('register-name').fill('Jan Kowalski');
    await page.getByTestId('register-email').fill('to-nie-email');
    await page.getByTestId('register-password').fill('secret1');
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('error-email')).toHaveText(
      'Niepoprawny format adresu e-mail',
    );
    await expect(page.getByTestId('error-name')).toHaveCount(0);
  });

  test('poprawna rejestracja i przekierowanie do logowania', async ({ page }) => {
    const email = `ok_${Date.now()}@test.pl`;
    await page.getByTestId('register-name').fill('Anna Nowak');
    await page.getByTestId('register-email').fill(email);
    await page.getByTestId('register-password').fill('haslo123');
    await page.getByTestId('register-submit').click();

    await expect(page.getByTestId('register-message')).toContainText('Rejestracja');
    await page.waitForURL('**/login', { timeout: 5000 });
    await expect(page.getByTestId('login-page')).toBeVisible();
  });
});
