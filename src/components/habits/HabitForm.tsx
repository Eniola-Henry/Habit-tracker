'use client';

import { useState, FormEvent } from 'react';
import { Habit } from '@/src/types/habit';
import { validateHabitName } from '@/src/lib/validators';

interface HabitFormProps {
  initial?: Partial<Habit>;
  onSave: (data: { name: string; description: string; frequency: 'daily' }) => void;
  onCancel: () => void;
}

export default function HabitForm({
  initial,
  onSave,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  const isEditing = Boolean(initial?.id);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const v = validateHabitName(name);

    if (!v.valid) {
      setNameError(v.error);
      return;
    }

    setNameError(null);

    onSave({
      name: v.value,
      description: description.trim(),
      frequency: 'daily',
    });
  }

  return (
    <div className="w-full rounded-2xl bg-white border border-[#e7dccb] shadow-sm p-6 animate-fade-up">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-[#f6f1e8] border border-[#e7dccb] flex items-center justify-center">
          <span className="text-[#2c2420] text-lg leading-none">+</span>
        </div>

        <h2 className="text-[#2c2420] font-semibold text-sm">
          {isEditing ? 'Edit habit' : 'New habit'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <div>
          <label className="block text-xs text-[#7a6f63] uppercase tracking-widest mb-1">
            Name
          </label>

          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
            }}
            placeholder="Drink water"
            className={`w-full px-4 py-3 rounded-xl border bg-[#fdfaf4] text-[#2c2420] outline-none transition
              ${nameError ? 'border-red-400' : 'border-[#e7dccb]'}
              focus:border-[#2c2420]`}
          />

          {nameError && (
            <p className="text-xs text-red-500 mt-1">{nameError}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-xs text-[#7a6f63] uppercase tracking-widest mb-1">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why does this matter?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[#e7dccb] bg-[#fdfaf4] text-[#2c2420] outline-none focus:border-[#2c2420] resize-none"
          />
        </div>

        {/* FREQUENCY */}
        <div>
          <label className="block text-xs text-[#7a6f63] uppercase tracking-widest mb-1">
            Frequency
          </label>

          <select
            disabled
            defaultValue="daily"
            className="w-full px-4 py-3 rounded-xl border border-[#e7dccb] bg-[#f6f1e8] text-[#7a6f63] cursor-not-allowed"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">

          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-[#2c2420] text-white font-semibold hover:opacity-90 transition"
          >
            {isEditing ? 'Save' : 'Create'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-[#e7dccb] text-[#7a6f63] hover:bg-[#f6f1e8] transition"
          >
            Cancel
          </button>

        </div>
      </form>
    </div>
  );
}