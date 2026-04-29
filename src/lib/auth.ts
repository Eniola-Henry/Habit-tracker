import { User, Session } from '@/src/types/auth';
import { getUsers, saveUsers, getUserByEmail, saveSession, clearSession } from '@/src/lib/storage';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export type AuthResult =
  | { success: true; session: Session }
  | { success: false; error: string };

export function signUp(email: string, password: string): AuthResult {
  const existing = getUserByEmail(email);
  if (existing) {
    return { success: false, error: 'User already exists' };
  }
  const user: User = {
    id: generateId(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  const users = getUsers();
  saveUsers([...users, user]);
  const session: Session = { userId: user.id, email: user.email };
  saveSession(session);
  return { success: true, session };
}

export function logIn(email: string, password: string): AuthResult {
  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid email or password' };
  }
  const session: Session = { userId: user.id, email: user.email };
  saveSession(session);
  return { success: true, session };
}

export function logOut(): void {
  clearSession();
}
