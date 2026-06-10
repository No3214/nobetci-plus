import { test, expect } from '@playwright/test';

test.describe('Nöbetçi+ Critical Path E2E', () => {
  test.beforeEach(async ({ context }) => {
    // Grant geolocation permissions and set mock coordinates (Izmir Konak)
    // This allows the app to fetch live data from the Izmir municipality API bypass CollectAPI keys.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 38.4237, longitude: 27.1428 });
  });

  test('User accepts KVKK, shares location, and sees pharmacies', async ({ page }) => {
    // 1. Navigate to local application
    await page.goto('/');

    // 2. Verify Welcome Screen presence
    const welcomeTitle = page.locator('h1').filter({ hasText: 'Nöbetçi+' });
    await expect(welcomeTitle).toBeVisible();

    const acceptButton = page.locator('button', { hasText: /Konum İzni Ver ve Başla/i });
    await expect(acceptButton).toBeVisible();

    // 3. Accept KVKK Consent
    await acceptButton.click();

    // 4. Verify that pharmacy cards are loaded and displayed
    // The heading structure in PharmacyCard is an <h3> tag.
    const pharmacyHeading = page.locator('h3').first();
    await expect(pharmacyHeading).toBeVisible({ timeout: 15000 });

    // Verify distance badge
    const distanceBadge = page.locator('span').filter({ hasText: /km|m/ }).first();
    await expect(distanceBadge).toBeVisible();
  });
});
