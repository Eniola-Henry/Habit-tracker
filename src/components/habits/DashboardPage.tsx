'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Habit } from '@/src/types/habit';
import { Session } from '@/src/types/auth';
import {
  getSession,
  getHabitsForUser,
  getHabits,
  saveHabits,
} from '@/src/lib/storage';
import { logOut } from '@/src/lib/auth';
import HabitCard from '@/src/components/habits/HabitCard';
import HabitForm from '@/src/components/habits/HabitForm';

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function DashboardPage() {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [mounted, setMounted] = useState(false);

  const today = getTodayString();

  useEffect(() => {
    setMounted(true);

    const s = getSession();
    if (!s) {
      router.replace('/login');
      return;
    }

    setSession(s);
    setHabits(getHabitsForUser(s.userId));
  }, [router]);

  const refreshHabits = (userId: string) => {
    setHabits(getHabitsForUser(userId));
  };

  const handleSave = useCallback(
    (data: { name: string; description: string; frequency: 'daily' }) => {
      if (!session) return;

      const all = getHabits();

      if (editingHabit) {
        const updated: Habit = {
          ...editingHabit,
          ...data,
        };

        saveHabits(all.map(h => (h.id === updated.id ? updated : h)));
      } else {
        const newHabit: Habit = {
          id: generateId(),
          userId: session.userId,
          name: data.name,
          description: data.description,
          frequency: data.frequency,
          createdAt: new Date().toISOString(),
          completions: [],
        };

        saveHabits([...all, newHabit]);
      }

      refreshHabits(session.userId);
      setShowForm(false);
      setEditingHabit(null);
    },
    [session, editingHabit]
  );

  function handleDelete(id: string) {
    const all = getHabits().filter(h => h.id !== id);
    saveHabits(all);

    if (session) refreshHabits(session.userId);
  }

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleUpdate(updated: Habit) {
    setHabits(prev => prev.map(h => (h.id === updated.id ? updated : h)));
  }

  function handleLogout() {
    logOut();
    router.push('/login');
  }

  if (!mounted || !session) return null;

  const completedToday = habits.filter(h =>
    h.completions.includes(today)
  ).length;

  const pct = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0;

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#f7f2ea]">

      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-[#f7f2ea]/80 backdrop-blur-xl border-b border-[#e7dccb]">
        <div className="max-w-md mx-auto px-5 py-4 flex justify-between items-center">

          <div>
            <div className="text-[#2c2420] font-semibold text-sm">
              Habit Tracker
            </div>
            <div className="text-[#7a6f63] text-xs">
              {session.email}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-[#7a6f63] hover:text-[#2c2420]"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN WRAPPER */}
      <main className="max-w-md mx-auto px-5 py-6 space-y-6">

        {/* STATS CARD */}
        {!showForm && (
          <section className="bg-white border border-[#e7dccb] rounded-2xl p-5 shadow-sm">

            <p className="text-xs text-[#7a6f63]">{dateLabel}</p>

            <h2 className="text-2xl font-bold text-[#2c2420] mt-1">
              {habits.length === 0
                ? 'Start building momentum'
                : `${completedToday}/${habits.length} completed`}
            </h2>

            {habits.length > 0 && (
              <div className="mt-3 h-2 bg-[#f0e7db] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2c2420] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </section>
        )}

        {/* ACTION BAR */}
        {!showForm && (
          <button
            onClick={() => {
              setEditingHabit(null);
              setShowForm(true);
            }}
            className="w-full py-3 rounded-xl bg-[#2c2420] text-white font-semibold shadow-sm hover:opacity-90 transition"
          >
            + New Habit
          </button>
        )}

        {/* FORM / LIST SECTION */}
        <section className="space-y-3">

          {showForm ? (
            <HabitForm
              initial={editingHabit ?? undefined}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingHabit(null);
              }}
            />
          ) : habits.length === 0 ? (
            <div className="text-center text-sm text-[#7a6f63] py-16">
              No habits yet. Start small.
            </div>
          ) : (
            habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}

        </section>

      </main>
    </div>
  );
}