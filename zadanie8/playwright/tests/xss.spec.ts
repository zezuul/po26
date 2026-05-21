import { test, expect } from '@playwright/test';

const XSS_PAYLOAD = '<img src=x onerror=alert("XSS")><script>alert(1)</script>';

test.describe('XSS — React escapuje wstrzyknięty kod', () => {
  test('wyszukiwarka produktów nie wykonuje skryptu', async ({ page }) => {
    let dialogFired = false;
    page.on('dialog', () => {
      dialogFired = true;
    });

    await page.goto('/');
    await page.getByTestId('product-search').fill(XSS_PAYLOAD);
    await expect(page.getByTestId('search-preview')).toBeVisible();

    const preview = page.getByTestId('search-query-text');
    await expect(preview).toHaveText(XSS_PAYLOAD);
    await expect(preview.locator('script')).toHaveCount(0);
    await expect(preview.locator('img')).toHaveCount(0);

    const html = await preview.innerHTML();
    expect(html).toContain('&lt;');
    expect(html).not.toMatch(/<script/i);

    await page.waitForTimeout(500);
    expect(dialogFired).toBe(false);
  });
});
