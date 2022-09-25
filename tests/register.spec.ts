import { test, expect } from '@playwright/test';

test('register a new endpoint', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await expect(page.locator('main')).toHaveText('Welcome to Sphinx')
});
