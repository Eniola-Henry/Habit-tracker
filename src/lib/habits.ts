import { Habit } from '@/src/types/habit';

/**
 * Toggles a completion date on a habit (immutably).
 * - adds date if missing
 * - removes date if present
 * - no duplicates
 * - does not mutate original
 */
export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const current = Array.from(new Set(habit.completions));
  const newCompletions = current.includes(date)
    ? current.filter((d) => d !== date)
    : [...current, date];
  return { ...habit, completions: newCompletions };
}
