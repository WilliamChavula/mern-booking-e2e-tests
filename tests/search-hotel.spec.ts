import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173';

test.describe('e2e tests for hotel feature', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(UI_URL);

        await page.getByRole('link', { name: 'Sign in' }).click();

        await expect(
            page.getByRole('heading', { name: 'Login into your account' })
        ).toBeVisible();

        await page.locator('[name=email]').fill('landon.long@example.com');
        await page.locator('[name=password]').fill('zecrA!41t&5W');

        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Successfully logged in.')).toBeVisible();
    });

    test('should show hotel search results successfully', async ({ page }) => {
        await page.goto(`${UI_URL}`);

        await page.getByPlaceholder(/where are you going?/).fill('Richardson');
        await page.getByRole('button', { name: /Search/ }).click();

        await expect(
            page.getByText('Hotels found in Richardson')
        ).toBeVisible();

        await expect(page.getByText('The Roosevelt')).toBeVisible();
    });

    test('should show hotel detail', async ({ page }) => {
        await page.goto(`${UI_URL}`);

        await page.getByPlaceholder(/where are you going?/).fill('Richardson');
        await page.getByRole('button', { name: /Search/ }).click();
        await page.getByText('The Roosevelt').click();

        await expect(page).toHaveURL(/detail/);
        await expect(
            page.getByRole('button', { name: /Book Now/ })
        ).toBeVisible();
    });
});
