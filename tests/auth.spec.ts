import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test('should login as a student', async ({ page }) => {
    // Navigate to the live Vercel URL
    await page.goto('/login');

    // Select the Student role tab
    await page.getByRole('tab', { name: 'Student' }).click();

    // Fill in credentials
    await page.getByPlaceholder('student@example.com').fill('student@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');

    // Submit the form
    await page.getByRole('button', { name: 'Sign in to Student account' }).click();

    // Verify successful login redirect to dashboard
    await expect(page).toHaveURL(/.*\/student\/dashboard/);
    
    // Verify dashboard loaded properly (no generic error messages)
    await expect(page.getByText('Student Dashboard')).toBeVisible();
  });

  test('should login as a teacher', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: 'Teacher' }).click();
    await page.getByPlaceholder('teacher@example.com').fill('teacher@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign in to Teacher account' }).click();
    await expect(page).toHaveURL(/.*\/teacher\/dashboard/);
  });
});
