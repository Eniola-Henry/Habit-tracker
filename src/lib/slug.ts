/**
 * Converts a habit name into a URL-safe slug.
 * - lowercase
 * - trim outer spaces
 * - collapse spaces → hyphens
 * - remove non-alphanumeric except hyphens
 */
export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
