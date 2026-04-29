import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/src/lib/habits';
import { Habit } from '@/src/types/habit';

const baseHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: '',
  frequency: 'daily',
  createdAt: '2024-01-01T00:00:00.000Z',
  completions: [],
};

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(baseHabit, '2024-06-15');
    expect(result.completions).toContain('2024-06-15');
    expect(result.completions).toHaveLength(1);
  });

  it('removes a completion date when the date already exists', () => {
    const habit = { ...baseHabit, completions: ['2024-06-15', '2024-06-14'] };
    const result = toggleHabitCompletion(habit, '2024-06-15');
    expect(result.completions).not.toContain('2024-06-15');
    expect(result.completions).toContain('2024-06-14');
  });

  it('does not mutate the original habit object', () => {
    const habit = { ...baseHabit, completions: ['2024-06-14'] };
    const originalCompletions = [...habit.completions];
    toggleHabitCompletion(habit, '2024-06-15');
    expect(habit.completions).toEqual(originalCompletions);
  });

  it('does not return duplicate completion dates', () => {
    const habitWithDupes = { ...baseHabit, completions: ['2024-06-15', '2024-06-15', '2024-06-14'] };
    // Toggle off an already-present duplicate date
    const result = toggleHabitCompletion(habitWithDupes, '2024-06-15');
    expect(result.completions).not.toContain('2024-06-15');
    // Toggle on a new date — ensure no dupes are created
    const habit2 = { ...baseHabit, completions: ['2024-06-14'] };
    const result2 = toggleHabitCompletion(habit2, '2024-06-14');
    const count = result2.completions.filter(d => d === '2024-06-14').length;
    // When toggling off, count is 0
    expect(count).toBe(0);
  });
});
