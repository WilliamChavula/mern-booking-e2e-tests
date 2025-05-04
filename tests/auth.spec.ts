import { test, expect } from '@playwright/test';

import { faker } from '@faker-js/faker';

const UI_URL = 'http://localhost:5173';

test('should allow user to sign in', async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByRole('link', { name: 'Sign in' }).click();

    await expect(
        page.getByRole('heading', { name: 'Login into your account' })
    ).toBeVisible();

    await page.locator('[name=email]').fill('landon.long@example.com');
    await page.locator('[name=password]').fill('zecrA!41t&5W');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Bookings' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Hotels' })).toBeVisible();

    await expect(page.getByText('Successfully logged in.')).toBeVisible();
});

test('should allow a user to register', async ({ page }) => {
    const password = faker.internet.password();
    await page.goto(UI_URL);

    await page.getByRole('link', { name: 'Sign up' }).click();

    await expect(
        page.getByRole('heading', { name: 'Create an account' })
    ).toBeVisible();

    await page.locator('[name=firstName]').fill(faker.person.firstName());
    await page.locator('[name=lastName]').fill(faker.person.lastName());
    await page.locator('[name=email]').fill(faker.internet.email());
    await page.locator('[name=password]').fill(password);
    await page.locator('[name=confirmPassword]').fill(password);

    await page.getByRole('button', { name: 'Create an Account' }).click();

    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Bookings' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Hotels' })).toBeVisible();

    await expect(page.getByText('User created successfully.')).toBeVisible();
});
