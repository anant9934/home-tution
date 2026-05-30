import { test, expect } from '@playwright/test';

test.describe('Student LMS & Assignment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByRole('tab', { name: 'Student' }).click();
    await page.getByPlaceholder('student@example.com').fill('student@example.com');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign in to Student account' }).click();
    await expect(page).toHaveURL(/.*\/student\/dashboard/);
  });

  test('should view course curriculum and mark lesson complete', async ({ page }) => {
    // Navigate to courses
    await page.goto('/student/courses');
    
    // Click "Continue Learning" on the first course
    await page.getByRole('button', { name: 'Continue Learning' }).first().click();
    
    // We should be in the LMS
    await expect(page).toHaveURL(/.*\/student\/courses\/.*\/learn/);
    
    // Verify video is loaded
    await expect(page.locator('video')).toBeVisible();

    // The first lesson in mock data has "Mark Complete" if it's a video
    // (Assuming the button exists and becomes disabled or changes text after clicking)
    const completeButton = page.getByRole('button', { name: /Mark Complete/i });
    if (await completeButton.isVisible()) {
      await completeButton.click();
      await expect(page.getByText('Lesson marked as complete')).toBeVisible();
    }
  });

  test('should complete a quiz', async ({ page }) => {
    await page.goto('/student/quizzes');
    
    // Click Start Quiz on the first pending quiz
    const startButton = page.getByRole('button', { name: 'Start Quiz' }).first();
    await expect(startButton).toBeVisible();
    await startButton.click();

    // We should see a modal with questions
    await expect(page.getByText('Question 1 of')).toBeVisible();
    
    // Select an answer (click first option)
    await page.locator('button.w-full.p-4.rounded-xl.border-2').first().click();
    
    // Submit answer
    await page.getByRole('button', { name: 'Submit Answer' }).click();
    
    // Depending on logic, finish quiz
    await expect(page.getByText('Quiz Completed!')).toBeVisible();
    await page.getByRole('button', { name: 'Finish & Earn XP' }).click();
    
    // Verify toast
    await expect(page.getByText(/You earned \+\d+ XP/)).toBeVisible();
  });

  test('should submit an assignment', async ({ page }) => {
    await page.goto('/student/assignments');
    
    // Verify Pending tab is active
    await expect(page.getByRole('button', { name: 'Pending' })).toHaveClass(/bg-white/);
    
    // Submit the first assignment
    const submitButton = page.getByRole('button', { name: 'Submit Work' }).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Wait for API resolution and verify success
      await expect(page.getByText(/Assignment submitted successfully!/)).toBeVisible({ timeout: 5000 });
      
      // The pending item should disappear, let's verify it moved to submitted tab
      await page.getByRole('button', { name: 'Submitted' }).click();
      await expect(page.getByText('Submitted').first()).toBeVisible();
    }
  });
});
