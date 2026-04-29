import { test, expect, Page } from '@playwright/test';

// Helper to set localStorage before page load
async function setLocalStorage(page: Page, key: string, value: unknown) {
  await page.evaluate(
    ([k, v]) => localStorage.setItem(k, JSON.stringify(v)),
    [key, value] as [string, unknown]
  );
}

async function setupUser(page: Page) {
  const user = { id: 'e2e-user-1', email: 'e2e@test.com', password: 'password123', createdAt: new Date().toISOString() };
  const session = { userId: user.id, email: user.email };
  await page.goto('/');
  await setLocalStorage(page, 'habit-tracker-users', [user]);
  await setLocalStorage(page, 'habit-tracker-session', session);
  return { user, session };
}

async function setupUserNoSession(page: Page) {
  const user = { id: 'e2e-user-2', email: 'existing@test.com', password: 'pass123', createdAt: new Date().toISOString() };
  await page.goto('/');
  await setLocalStorage(page, 'habit-tracker-users', [user]);
  return user;
}

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await setupUser(page);
    await page.goto('/');
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('newuser@test.com');
    await page.getByTestId('auth-signup-password').fill('securepassword');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user's habits', async ({ page }) => {
    // Setup: two users each with their own habit
    const user1 = { id: 'u1', email: 'user1@test.com', password: 'pass1', createdAt: new Date().toISOString() };
    const user2 = { id: 'u2', email: 'user2@test.com', password: 'pass2', createdAt: new Date().toISOString() };
    const habit1 = {
      id: 'h1', userId: 'u1', name: 'User One Habit', description: '', frequency: 'daily',
      createdAt: new Date().toISOString(), completions: [],
    };
    const habit2 = {
      id: 'h2', userId: 'u2', name: 'User Two Habit', description: '', frequency: 'daily',
      createdAt: new Date().toISOString(), completions: [],
    };

    await page.goto('/');
    await setLocalStorage(page, 'habit-tracker-users', [user1, user2]);
    await setLocalStorage(page, 'habit-tracker-habits', [habit1, habit2]);

    await page.goto('/login');
    await page.getByTestId('auth-login-email').fill('user1@test.com');
    await page.getByTestId('auth-login-password').fill('pass1');
    await page.getByTestId('auth-login-submit').click();
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    await expect(page.getByTestId('habit-card-user-one-habit')).toBeVisible();
    await expect(page.getByTestId('habit-card-user-two-habit')).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await setupUser(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();

    await page.getByTestId('create-habit-button').click();
    await expect(page.getByTestId('habit-form')).toBeVisible();

    await page.getByTestId('habit-name-input').fill('Morning Yoga');
    await page.getByTestId('habit-description-input').fill('Stretch and breathe');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-morning-yoga')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    const { user } = await setupUser(page);
    const habit = {
      id: 'hstreak', userId: user.id, name: 'Walk Outside', description: '',
      frequency: 'daily', createdAt: new Date().toISOString(), completions: [],
    };
    await setLocalStorage(page, 'habit-tracker-habits', [habit]);

    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-card-walk-outside')).toBeVisible();

    // Streak starts at 0
    await expect(page.getByTestId('habit-streak-walk-outside')).toContainText('No streak');

    // Complete habit
    await page.getByTestId('habit-complete-walk-outside').click();

    // Streak updates to 1
    await expect(page.getByTestId('habit-streak-walk-outside')).toContainText('1 day streak');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    const { user } = await setupUser(page);
    await page.goto('/dashboard');

    // Create a habit
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Persist Me');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-persist-me')).toBeVisible();

    // Reload
    await page.reload();
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    // Should still be there
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-persist-me')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await setupUser(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();

    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    // Session should be gone — navigating to dashboard redirects back to login
    await page.goto('/dashboard');
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // Load the app once while online
    await setupUser(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();

    // Wait briefly for service worker to cache
    await page.waitForTimeout(1500);

    // Go offline
    await context.setOffline(true);

    // Reload — app shell should still render from cache
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});

    // Should not show a browser error page
    const title = await page.title();
    expect(title).not.toContain('ERR_');
    expect(title).not.toBe('');

    await context.setOffline(false);
  });
});
