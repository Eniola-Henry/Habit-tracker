import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/src/components/habits/DashboardPage';
import { saveSession, saveHabits, getHabits } from '@/src/lib/storage';
import { Session } from '@/src/types/auth';
import { Habit } from '@/src/types/habit';

const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, prefetch: vi.fn() }),
}));

const session: Session = { userId: 'user-123', email: 'user@test.com' };

function setupSession() {
  saveSession(session);
}

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    mockReplace.mockClear();
    setupSession();
  });

  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await waitFor(() => screen.getByTestId('dashboard-page'));
    await user.click(screen.getByTestId('create-habit-button'));
    await waitFor(() => screen.getByTestId('habit-form'));

    // Submit with empty name
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Habit name is required');
    });
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await waitFor(() => screen.getByTestId('dashboard-page'));
    await user.click(screen.getByTestId('create-habit-button'));
    await waitFor(() => screen.getByTestId('habit-form'));

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.type(screen.getByTestId('habit-description-input'), 'Stay hydrated');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    });

    const habits = getHabits();
    expect(habits.some(h => h.name === 'Drink Water' && h.userId === session.userId)).toBe(true);
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const existingHabit: Habit = {
      id: 'habit-abc',
      userId: session.userId,
      name: 'Run Daily',
      description: 'Morning run',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: ['2024-06-14'],
    };
    saveHabits([existingHabit]);

    const user = userEvent.setup();
    render(<DashboardPage />);

    await waitFor(() => screen.getByTestId('habit-card-run-daily'));
    await user.click(screen.getByTestId('habit-edit-run-daily'));
    await waitFor(() => screen.getByTestId('habit-form'));

    const nameInput = screen.getByTestId('habit-name-input') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Run Every Day');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-run-every-day')).toBeInTheDocument();
    });

    const habits = getHabits();
    const updated = habits.find(h => h.id === 'habit-abc');
    expect(updated).toBeDefined();
    expect(updated!.name).toBe('Run Every Day');
    expect(updated!.id).toBe('habit-abc');
    expect(updated!.userId).toBe(session.userId);
    expect(updated!.createdAt).toBe('2024-01-01T00:00:00.000Z');
    expect(updated!.completions).toEqual(['2024-06-14']);
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const existingHabit: Habit = {
      id: 'habit-del',
      userId: session.userId,
      name: 'Read Books',
      description: '',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };
    saveHabits([existingHabit]);

    const user = userEvent.setup();
    render(<DashboardPage />);

    await waitFor(() => screen.getByTestId('habit-card-read-books'));

    // Click delete
    await user.click(screen.getByTestId('habit-delete-read-books'));

    // Habit should still be present (waiting for confirmation)
    expect(screen.getByTestId('habit-card-read-books')).toBeInTheDocument();

    // Confirm deletion
    await user.click(screen.getByTestId('confirm-delete-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-read-books')).not.toBeInTheDocument();
    });

    const habits = getHabits();
    expect(habits.find(h => h.id === 'habit-del')).toBeUndefined();
  });

  it('toggles completion and updates the streak display', async () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const existingHabit: Habit = {
      id: 'habit-streak',
      userId: session.userId,
      name: 'Meditate',
      description: '',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [yesterday],
    };
    saveHabits([existingHabit]);

    const user = userEvent.setup();
    render(<DashboardPage />);

    await waitFor(() => screen.getByTestId('habit-card-meditate'));

    // Initially streak is 0 (yesterday completed but not today)
    expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('No streak yet');

    // Complete today
    await user.click(screen.getByTestId('habit-complete-meditate'));

    await waitFor(() => {
      const streakEl = screen.getByTestId('habit-streak-meditate');
      expect(streakEl).toHaveTextContent('2 day streak');
    });

    // Toggle back off
    await user.click(screen.getByTestId('habit-complete-meditate'));

    await waitFor(() => {
      const streakEl = screen.getByTestId('habit-streak-meditate');
      expect(streakEl).toHaveTextContent('No streak yet');
    });
  });
});
