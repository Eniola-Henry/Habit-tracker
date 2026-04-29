import { User, Session } from '@/src/types/auth';
import { Habit } from '@/src/types/habit';

const KEYS = {
  users: 'habit-tracker-users',
  session: 'habit-tracker-session',
  habits: 'habit-tracker-habits',
} as const;

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.users);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch { return []; }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.session);
    if (!raw || raw === 'null') return null;
    return JSON.parse(raw) as Session;
  } catch { return null; }
}

export function saveSession(session: Session | null): void {
  localStorage.setItem(KEYS.session, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.session);
}

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.habits);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch { return []; }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(KEYS.habits, JSON.stringify(habits));
}

export function getHabitsForUser(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}
