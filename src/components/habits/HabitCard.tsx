'use client';

import { useState } from 'react';
import { Habit } from '@/src/types/habit';
import { getHabitSlug } from '@/src/lib/slug';
import { calculateCurrentStreak } from '@/src/lib/streaks';
import { toggleHabitCompletion } from '@/src/lib/habits';
import { getHabits, saveHabits } from '@/src/lib/storage';

interface HabitCardProps {
  habit: Habit;
  today: string;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onUpdate: (habit: Habit) => void;
}

export default function HabitCard({
  habit,
  today,
  onEdit,
  onDelete,
  onUpdate,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today);
    const all = getHabits();
    saveHabits(all.map(h => (h.id === updated.id ? updated : h)));
    onUpdate(updated);
  }

  function handleDeleteConfirm() {
    onDelete(habit.id);
    setConfirmDelete(false);
  }

  return (
    <>
      {/* CARD */}
      <div
        data-testid={`habit-card-${slug}`}
        className="
          w-full flex items-center gap-4
          rounded-2xl px-4 py-4 mb-3
          bg-white border border-[#e7dccb]
          shadow-sm hover:shadow-md
          transition-all
        "
      >

        {/* TOGGLE */}
        <button
          onClick={handleToggle}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center
            border transition
            ${isCompleted
              ? 'bg-[#2c2420] border-[#2c2420]'
              : 'bg-[#f6f1e8] border-[#e7dccb]'
            }
          `}
        >
          {isCompleted && (
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
              <path
                d="M2 6.5l3.5 3.5L11 3"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">

          <h3
            className={`
              text-sm font-semibold truncate
              ${isCompleted ? 'text-[#7a6f63] line-through' : 'text-[#2c2420]'}
            `}
          >
            {habit.name}
          </h3>

          {habit.description && (
            <p className="text-xs text-[#7a6f63] truncate mt-1">
              {habit.description}
            </p>
          )}

          {/* STREAK */}
          <div className="flex items-center gap-2 mt-2 text-xs text-[#7a6f63]">

            <span className="text-[10px]">
              {streak > 0 ? '●' : '○'}
            </span>

            <span>
              {streak > 0 ? `${streak} day streak` : 'No streak yet'}
            </span>

            {isCompleted && (
              <span className="ml-1 px-2 py-[2px] rounded-full bg-[#f6f1e8] border border-[#e7dccb] text-[10px] text-[#2c2420]">
                done
              </span>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-1">

          <button
            onClick={() => onEdit(habit)}
            className="w-8 h-8 rounded-lg text-[#7a6f63] hover:bg-[#f6f1e8] transition"
          >
            ✎
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            className="w-8 h-8 rounded-lg text-[#7a6f63] hover:bg-[#f6f1e8] transition"
          >
            ×
          </button>

        </div>
      </div>

      {/* DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">

          <div className="w-full max-w-xs rounded-2xl bg-[#fffdf9] border border-[#e7dccb] p-5">

            <h3 className="text-[#2c2420] font-semibold mb-1">
              Delete habit?
            </h3>

            <p className="text-sm text-[#7a6f63] mb-4">
              This action cannot be undone.
            </p>

            <div className="flex gap-2">

              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 rounded-xl bg-[#2c2420] text-white text-sm font-semibold hover:opacity-90"
              >
                Delete
              </button>

              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-xl border border-[#e7dccb] text-[#7a6f63] text-sm hover:bg-[#f6f1e8]"
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}