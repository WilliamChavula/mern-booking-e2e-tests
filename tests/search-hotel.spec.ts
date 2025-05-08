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

    test('should should book hotel', async ({ page }) => {
        const duration = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

        const stay = new Date();
        stay.setDate(stay.getDate() + 3);
        const formatted = stay.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        await page.goto(`${UI_URL}`);

        await page.getByPlaceholder(/where are you going?/).fill('Richardson');
        await page.getByPlaceholder('Check out date').fill(formatted);
        await page.getByRole('button', { name: /Search/ }).click();
        await page.getByText('The Roosevelt').click();

        await page.getByRole('button', { name: /Book Now/ }).click();
        await expect(page.getByText('Total Cost: $1,050.00')).toBeVisible();

        const cardFrame = page.frameLocator(
            'iframe[name*="__privateStripeFrame"][title*="Secure card payment input frame"]'
        );

        await cardFrame.locator('[name="cardnumber"]').fill('4242424242424242');
        await cardFrame.locator('[name="exp-date"]').fill('12/34');
        await cardFrame.locator('input[name="cvc"]').fill('123');

        await cardFrame.getByPlaceholder('ZIP').fill('12345');

        await page.getByRole('button', { name: /Confirm Booking/ }).click();
        await expect(page.getByText('Hotel Room Booked.')).toBeVisible();

        await page.getByRole('link', { name: /My Bookings/ }).click();
        await expect(page.getByText('The Roosevelt')).toBeVisible();
    });
});
