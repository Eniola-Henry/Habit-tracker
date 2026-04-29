import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/src/components/auth/LoginForm';
import SignupForm from '@/src/components/auth/SignupForm';
import { saveUsers, saveSession } from '@/src/lib/storage';
import { User } from '@/src/types/auth';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn(), prefetch: vi.fn() }),
}));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      const stored = localStorage.getItem('habit-tracker-session');
      expect(stored).not.toBeNull();
      const session = JSON.parse(stored!);
      expect(session.email).toBe('test@example.com');
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for duplicate signup email', async () => {
    const existingUser: User = {
      id: 'u1',
      email: 'taken@example.com',
      password: 'pass',
      createdAt: new Date().toISOString(),
    };
    saveUsers([existingUser]);

    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'taken@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'newpassword');
    await user.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User already exists');
    });
  });

  it('submits the login form and stores the active session', async () => {
    const existingUser: User = {
      id: 'u2',
      email: 'login@example.com',
      password: 'mypassword',
      createdAt: new Date().toISOString(),
    };
    saveUsers([existingUser]);

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'mypassword');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const stored = localStorage.getItem('habit-tracker-session');
      expect(stored).not.toBeNull();
      const session = JSON.parse(stored!);
      expect(session.email).toBe('login@example.com');
      expect(session.userId).toBe('u2');
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'nobody@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpassword');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
    });
  });
});
