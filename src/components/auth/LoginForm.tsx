'use client';

import { useState, FormEvent } from 'react';
import { logIn } from '@/src/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = logIn(email, password);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f7f2ea] relative overflow-hidden">

      {/* BACKGROUND DEPTH */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 w-[600px] h-[600px] bg-[#e7dccb] blur-3xl opacity-40 rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#d8cbb3] blur-3xl opacity-30 rounded-full" />
      </div>

      <div className="relative w-full max-w-md space-y-6">

        {/* BRAND */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-white border border-[#e7dccb] flex items-center justify-center shadow-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9l4.5 4.5L15 4.5"
                stroke="#2c2420"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="text-[#2c2420] font-semibold text-lg tracking-tight">
            Habit Tracker
          </span>

        </div>

        {/* HERO TEXT */}
        <div>
          <h1 className="text-3xl font-bold text-[#2c2420] tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-[#7a6f63] mt-2">
            Continue building consistency without breaking your streak
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border border-[#e7dccb] rounded-2xl shadow-sm p-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-[#7a6f63]">
                Email
              </label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-[#f9f6f1]
                  border border-[#e7dccb]
                  text-[#2c2420]
                  outline-none
                  focus:border-[#2c2420]
                  focus:ring-1 focus:ring-[#2c2420]/10
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-[#7a6f63]">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-[#f9f6f1]
                  border border-[#e7dccb]
                  text-[#2c2420]
                  outline-none
                  focus:border-[#2c2420]
                  focus:ring-1 focus:ring-[#2c2420]/10
                "
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              disabled={loading}
              className="
                w-full py-3 rounded-xl font-semibold
                bg-[#2c2420] text-white
                hover:bg-[#3b2f2f]
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>

          </form>
        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-[#7a6f63]">
          No account?{' '}
          <Link href="/signup" className="text-[#2c2420] font-semibold">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}