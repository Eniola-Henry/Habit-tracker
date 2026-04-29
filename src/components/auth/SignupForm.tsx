'use client';

import { useState, FormEvent } from 'react';
import { signUp } from '@/src/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = signUp(email, password);

    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f7f2ea]">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#e7dccb] flex items-center justify-center shadow-sm">
            ✓
          </div>

          <span className="font-semibold text-[#2c2420] text-lg">
            Habit Tracker
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#2c2420]">
          Start your journey
        </h1>

        <p className="text-sm text-[#7a6f63] mt-2 mb-8">
          Free forever. Private by design.
        </p>

        {/* Card */}
        <div className="bg-white border border-[#e7dccb] rounded-2xl shadow-sm p-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-xs uppercase tracking-widest text-[#8a7f73]">
                Email
              </label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-[#e7dccb] bg-[#f9f6f1] text-[#2c2420] outline-none focus:ring-2 focus:ring-[#2c2420]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs uppercase tracking-widest text-[#8a7f73]">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-[#e7dccb] bg-[#f9f6f1] text-[#2c2420] outline-none focus:ring-2 focus:ring-[#2c2420]"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2c2420] text-white font-semibold hover:bg-[#3b2f2f] disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#7a6f63] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#2c2420] font-semibold">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}