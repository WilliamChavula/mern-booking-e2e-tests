import path from 'path';
import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173';

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

test('should allow user to add hotel', async ({ page }) => {
    await page.goto(`${UI_URL}/add-hotel`);

    await page.locator('[name=name]').fill('Test Hotel');
    await page.locator('[name=city]').fill('Test City');
    await page.locator('[name=country]').fill('Test Country');
    await page.locator('[name=description]').fill('Test Add Description');
    await page.locator('[name=pricePerNight]').fill('350');
    await page.locator('[name=name]').fill('Test Hotel');
    await page.locator('[name=childCount]').fill('1');
    await page.locator('[name=adultCount]').fill('1');

    await page.getByTestId('starRating-select-trigger').click();
    await page.getByTestId('starRating-select-option-3').click();

    await page.getByTestId('hotel-type-1').click();

    await page.getByTestId('terms-checkbox-1').click();
    await page.getByTestId('terms-checkbox-2').click();

    await page.getByLabel('Parking').check();
    await page.getByLabel('Spa').check();

    await page.setInputFiles('[name=imageFiles]', [
        path.join(__dirname, 'files', 'jess.jpg'),
        path.join(__dirname, 'files', 'perqued.jpg'),
    ]);

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Hotel added successfully.')).toBeVisible();
});

test('should display hotels', async ({ page }) => {
    await page.goto(`${UI_URL}/my-hotels`);

    await expect(page.getByText('My Hotels').nth(1)).toBeVisible();
    await expect(page.getByText('The Roosevelt')).toBeVisible();
    await expect(
        page.locator(
            '[data-slot="card-description"]:has-text("Indulge in an exquisite experience where luxury meets craftsmanship")'
        )
    ).toBeVisible();
    await expect(page.getByText('Richardson, Lithuania')).toBeVisible();
    await expect(page.getByText('Boutique').nth(1)).toBeVisible();
    await expect(page.getByText('$350.00/night').nth(1)).toBeVisible();
    await expect(page.getByText('1adult,1child').nth(1)).toBeVisible();
    await expect(page.getByText('3 Star Rating').nth(1)).toBeVisible();

    await expect(page.getByRole('link', { name: /Add Hotel/ })).toBeVisible();
    await expect(
        page.getByRole('link', { name: /View Details/ }).nth(1)
    ).toBeVisible();
});

test('should edit hotel', async ({ page }) => {
    await page.goto(`${UI_URL}/my-hotels`);

    await page
        .getByRole('link', { name: /View Details/ })
        .first()
        .click();

    await page.waitForSelector('[name=name]', { state: 'attached' });
    await expect(page.locator('[name=name]')).toHaveValue('Test Hotel');

    await page.locator('[name=name]').fill('Pally Champagne');
    await page.getByRole('button', { name: /Save/ }).click();
    await expect(page.getByText('Hotel updated successfully.')).toBeVisible();
});
