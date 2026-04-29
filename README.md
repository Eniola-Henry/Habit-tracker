# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits — built with Next.js 14 App Router, TypeScript, Tailwind CSS, and localStorage persistence.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Persistence | localStorage (fully local) |
| Unit / Integration Tests | Vitest + React Testing Library |
| E2E Tests | Playwright |

---

## Setup

```bash
git clone <your-repo-url>
cd habit-tracker
npm install
npm run dev        # http://localhost:3000
```

---

## Running Tests

```bash
# Unit tests (src/lib coverage)
npm run test:unit

# Integration / component tests
npm run test:integration

# End-to-end tests (requires running dev server)
npm run test:e2e

# All tests
npm run test
```

> **Note:** E2E tests require the Chromium binary. If running locally, set `CHROME_PATH` env var or let Playwright auto-detect.

---

## Local Persistence

All data is stored in `localStorage` under three keys:

| Key | Shape |
|---|---|
| `habit-tracker-users` | `User[]` — id, email, password (plain), createdAt |
| `habit-tracker-session` | `Session | null` — userId, email |
| `habit-tracker-habits` | `Habit[]` — id, userId, name, description, frequency, createdAt, completions (YYYY-MM-DD[]) |

**Trade-offs:** passwords are stored in plain text (acceptable for a local-only, front-end-focused stage). No server, no tokens, no expiry.

---

## PWA Support

- `public/manifest.json` — name, start_url, display, icons (192 + 512)
- `public/sw.js` — cache-first service worker that caches the app shell on install and serves it offline
- `src/components/shared/ServiceWorkerRegistrar.tsx` — registers the SW on the client via `useEffect`

After loading once, the app shell renders offline without crashing.

---

## Architecture

```
app/               ← Next.js App Router pages (thin wrappers)
  page.tsx         ← / — splash + redirect logic
  login/page.tsx   ← /login
  signup/page.tsx  ← /signup
  dashboard/page.tsx ← /dashboard (protected)

src/
  types/           ← User, Session, Habit TypeScript types
  lib/             ← Pure utility functions (slug, validators, streaks, habits, storage, auth)
  components/
    shared/        ← SplashScreen, ServiceWorkerRegistrar
    auth/          ← LoginForm, SignupForm
    habits/        ← DashboardPage, HabitCard, HabitForm

tests/
  unit/            ← Vitest — slug, validators, streaks, habits, auth/storage
  integration/     ← Vitest + RTL — auth-flow, habit-form
  e2e/             ← Playwright — full user flows
```

---

## Test File Map

| File | Verifies |
|---|---|
| `tests/unit/slug.test.ts` | `getHabitSlug` — lowercase, trim, hyphen, special chars |
| `tests/unit/validators.test.ts` | `validateHabitName` — empty, >60 chars, trimmed value |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` — empty, no today, consecutive, duplicates, gaps |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` — add, remove, immutability, no dupes |
| `tests/unit/auth-storage.test.ts` | `auth.ts` + `storage.ts` — sign up, login, logout, CRUD helpers |
| `tests/integration/auth-flow.test.tsx` | Signup/login form UI, session creation, error messages |
| `tests/integration/habit-form.test.tsx` | Create/edit/delete habit UI, validation, streak toggle |
| `tests/e2e/app.spec.ts` | Full user journeys: splash, auth, CRUD, persistence, offline |

---

## Assumptions & Trade-offs

- **Auth is local** — no JWT, no server, passwords in plain-text localStorage (by spec)
- **Daily frequency only** — spec requires only `'daily'`, select is disabled
- **No server-side rendering guard** — dashboard guard is client-side (`useEffect`) to avoid hydration issues with localStorage
- **Offline support** — cache-first SW covers the app shell; dynamic API calls are not applicable (no backend)
- **PWA icons** — programmatically generated solid-colour PNGs (replace with real assets before production)

---

## Demo

> Record a 2-minute Loom walking through: splash screen → signup → create 3 habits → complete them → check streak → reload → logout → attempt /dashboard
