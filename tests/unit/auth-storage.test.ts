import { describe, it, expect, beforeEach } from 'vitest'
import { signUp, logIn, logOut } from '@/src/lib/auth'
import {
  getUsers, saveUsers, getUserByEmail,
  getSession, saveSession, clearSession,
  getHabits, saveHabits, getHabitsForUser,
} from '@/src/lib/storage'
import { User } from '@/src/types/auth'
import { Habit } from '@/src/types/habit'

// ─── storage.ts ──────────────────────────────────────────────────────────────
describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('getUsers returns empty array when no users stored', () => {
    expect(getUsers()).toEqual([])
  })

  it('saveUsers and getUsers round-trip', () => {
    const users: User[] = [
      { id: '1', email: 'a@b.com', password: 'pw', createdAt: '2024-01-01T00:00:00.000Z' },
    ]
    saveUsers(users)
    expect(getUsers()).toEqual(users)
  })

  it('getUserByEmail finds a user by email', () => {
    const user: User = { id: 'u1', email: 'find@test.com', password: 'pw', createdAt: '' }
    saveUsers([user])
    expect(getUserByEmail('find@test.com')).toEqual(user)
    expect(getUserByEmail('missing@test.com')).toBeUndefined()
  })

  it('getSession returns null when nothing stored', () => {
    expect(getSession()).toBeNull()
  })

  it('saveSession and getSession round-trip', () => {
    const session = { userId: 'u1', email: 'test@test.com' }
    saveSession(session)
    expect(getSession()).toEqual(session)
  })

  it('clearSession removes the session', () => {
    saveSession({ userId: 'u1', email: 'x@x.com' })
    clearSession()
    expect(localStorage.getItem('habit-tracker-session')).toBeNull()
  })

  it('getHabits returns empty array when nothing stored', () => {
    expect(getHabits()).toEqual([])
  })

  it('saveHabits and getHabits round-trip', () => {
    const habits: Habit[] = [
      { id: 'h1', userId: 'u1', name: 'Test', description: '', frequency: 'daily', createdAt: '', completions: [] },
    ]
    saveHabits(habits)
    expect(getHabits()).toEqual(habits)
  })

  it('getHabitsForUser filters by userId', () => {
    const h1: Habit = { id: 'h1', userId: 'u1', name: 'A', description: '', frequency: 'daily', createdAt: '', completions: [] }
    const h2: Habit = { id: 'h2', userId: 'u2', name: 'B', description: '', frequency: 'daily', createdAt: '', completions: [] }
    saveHabits([h1, h2])
    expect(getHabitsForUser('u1')).toEqual([h1])
    expect(getHabitsForUser('u2')).toEqual([h2])
    expect(getHabitsForUser('u3')).toEqual([])
  })
})

// ─── auth.ts ──────────────────────────────────────────────────────────────────
describe('auth', () => {
  beforeEach(() => localStorage.clear())

  it('signUp creates a user and returns a session', () => {
    const result = signUp('new@user.com', 'password123')
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.session.email).toBe('new@user.com')
    expect(result.session.userId).toBeTruthy()

    const users = getUsers()
    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('new@user.com')
  })

  it('signUp rejects duplicate email', () => {
    signUp('dup@user.com', 'pass1')
    const result = signUp('dup@user.com', 'pass2')
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toBe('User already exists')
  })

  it('logIn succeeds with correct credentials', () => {
    signUp('login@user.com', 'correctpass')
    localStorage.removeItem('habit-tracker-session') // clear session from signup

    const result = logIn('login@user.com', 'correctpass')
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.session.email).toBe('login@user.com')
  })

  it('logIn fails with wrong password', () => {
    signUp('login2@user.com', 'correctpass')
    const result = logIn('login2@user.com', 'wrongpass')
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toBe('Invalid email or password')
  })

  it('logIn fails for non-existent user', () => {
    const result = logIn('ghost@user.com', 'anypass')
    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toBe('Invalid email or password')
  })

  it('logOut clears the session', () => {
    signUp('logout@user.com', 'pass')
    expect(getSession()).not.toBeNull()
    logOut()
    expect(localStorage.getItem('habit-tracker-session')).toBeNull()
  })
})
