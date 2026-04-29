/**
 * Calculates the current consecutive streak.
 * - deduplicates completions
 * - if today not completed → 0
 * - if today completed → count backwards from today
 */
export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  const todayDate = today ?? new Date().toISOString().split('T')[0];
  const unique = Array.from(new Set(completions));

  if (!unique.includes(todayDate)) return 0;

  // Sort descending
  unique.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));

  let streak = 0;
  const cursor = new Date(todayDate + 'T00:00:00Z');

  for (let i = 0; i < unique.length + 1; i++) {
    const dateStr = cursor.toISOString().split('T')[0];
    if (unique.includes(dateStr)) {
      streak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
