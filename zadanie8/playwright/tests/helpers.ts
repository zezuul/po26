import { APIRequestContext, Page, expect } from '@playwright/test';

export const API_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:3011';

export async function registerAndLogin(
  page: Page,
  request: APIRequestContext,
  suffix: string,
) {
  const email = `user_${suffix}@test.pl`;
  const password = 'haslo123';
  const name = `Tester ${suffix}`;

  const reg = await request.post(`${API_URL}/api/auth/register`, {
    data: { email, password, name },
  });
  expect(reg.ok()).toBeTruthy();

  await page.goto('/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('nav-account')).toBeVisible();

  return { email, password, name };
}
