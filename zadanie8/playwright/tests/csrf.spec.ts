import { test, expect } from '@playwright/test';
import { API_URL, registerAndLogin } from './helpers';

test.describe('CSRF — ochrona ustawień konta', () => {
  test('spreparowany link nie zmienia nazwy bez tokenu CSRF', async ({
    context,
    page,
    request,
  }) => {
    const suffix = String(Date.now());
    const { name } = await registerAndLogin(page, request, suffix);

    await page.goto('/account');
    await expect(page.getByTestId('account-current-name')).toContainText(name);

    const attackPage = await context.newPage();
    await attackPage.goto(`${API_URL}/csrf-attack.html`);
    await expect(attackPage.locator('#status')).toContainText('zablokowany', {
      timeout: 10_000,
    });
    await expect(attackPage.locator('#result')).toContainText('CSRF');

    await page.bringToFront();
    await page.reload();
    await expect(page.getByTestId('account-current-name')).toContainText(name);
    await expect(page.getByTestId('account-current-name')).not.toContainText('Zhakowany');
  });

  test('legalna zmiana z tokenem CSRF działa', async ({ page, request }) => {
    const suffix = `csrf_ok_${Date.now()}`;
    await registerAndLogin(page, request, suffix);

    await page.goto('/account');
    const newName = 'Bezpieczna Nazwa';
    await page.getByTestId('account-display-name').fill(newName);
    await page.getByTestId('account-submit').click();

    await expect(page.getByTestId('account-success')).toBeVisible();
    await expect(page.getByTestId('account-current-name')).toContainText(newName);
    await expect(page.getByTestId('nav-account')).toContainText(newName);
  });
});
