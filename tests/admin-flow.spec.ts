import { test, expect } from '@playwright/test';

test.describe('Admin Flow', () => {
  test('should view analytics and approve a tutor', async ({ page }) => {
    // Login as Admin
    await page.goto('/login');
    await page.getByRole('tab', { name: 'Admin' }).click();
    await page.getByPlaceholder('admin@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign in to Admin account' }).click();
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    // Verify Admin Dashboard Analytics
    await expect(page.getByText('Platform Overview')).toBeVisible();
    await expect(page.getByText('Total Revenue')).toBeVisible();

    // Find the pending tutors section and approve the first one
    const approveButton = page.getByRole('button', { name: 'Approve' }).first();
    if (await approveButton.isVisible()) {
      await approveButton.click();
      
      // Verify success toast
      await expect(page.getByText(/Tutor approved successfully/)).toBeVisible({ timeout: 5000 });
    }
  });
});
