import { test, expect } from '@playwright/test';

test('shows title', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await expect(page.locator('main')).toHaveText('Welcome to Sphinx')
});

test('register a new endpoint', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('text=Register endpoint').click()

    await page.locator('text=Name').fill('Luke')
    await page.locator('text=URL').fill('http://localhost:6000')
    await page.locator('text=Create').click()

    await expect(page.locator('text=Luke')).toBeVisible()
    await expect(page.locator('text=http://localhost:6000')).toBeVisible()
});
