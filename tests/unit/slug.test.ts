import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/src/lib/slug';

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
    expect(getHabitSlug('Read Books')).toBe('read-books');
    expect(getHabitSlug('Exercise')).toBe('exercise');
  });

  it('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Drink  Water  ')).toBe('drink-water');
    expect(getHabitSlug('  Hello   World  ')).toBe('hello-world');
    expect(getHabitSlug('  Morning   Run  ')).toBe('morning-run');
  });

  it('removes non alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Drink Water!')).toBe('drink-water');
    expect(getHabitSlug('Read (Books)')).toBe('read-books');
    expect(getHabitSlug('100% Effort')).toBe('100-effort');
    expect(getHabitSlug('Wake-Up Early')).toBe('wake-up-early');
  });
});
