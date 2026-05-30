import { test, expect } from '@playwright/test';

test.describe('Tutor Booking Flow (Marketplace)', () => {
  test('should view tutor details and book a demo', async ({ page }) => {
    // 1. Navigate to the marketplace as a student (requires login to book)
    await page.goto('/login');
    await page.getByRole('tab', { name: 'Student' }).click();
    await page.getByPlaceholder('student@example.com').fill('student@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign in to Student account' }).click();
    await expect(page).toHaveURL(/.*\/student\/dashboard/);

    // 2. Navigate to public tutors page
    await page.goto('/tutors');
    await expect(page.getByText('Expert Tutors')).toBeVisible();

    // 3. Click "View Profile" on the first tutor
    const viewProfileButton = page.getByRole('link', { name: 'View Profile' }).first();
    await expect(viewProfileButton).toBeVisible();
    
    // Playwright captures the navigation
    await viewProfileButton.click();
    await expect(page).toHaveURL(/.*\/tutors\/.+/);

    // 4. Click "Book Free Demo" on the details page
    const bookDemoButton = page.getByRole('button', { name: 'Book Free Demo' });
    await expect(bookDemoButton).toBeVisible();
    await bookDemoButton.click();

    // 5. Modal opens, select a slot
    await expect(page.getByText('Select a Time Slot')).toBeVisible();
    await page.locator('button.w-full.p-4.rounded-xl.border-2').first().click();

    // 6. Confirm Booking
    await page.getByRole('button', { name: 'Confirm' }).click();

    // 7. Success state and redirect to dashboard
    await expect(page.getByText('Booking Confirmed')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/.*\/student\/dashboard/, { timeout: 5000 });
  });
});
