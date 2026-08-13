# CampusConnect — Frontend

React (Vite) frontend for the Smart Campus Management Platform (DevFusion 4.0,
Problem Statement 1). Built to plug straight into the Express/PostgreSQL
backend from the system design doc — every screen already calls a real
`/api/...` endpoint through the `src/api` layer, so wiring up the backend is
just pointing `VITE_API_URL` at it.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in VITE_API_URL
npm run dev
```

The dev server proxies `/api` to `http://localhost:5000` (see `vite.config.js`),
so during local development your Express server and this frontend don't fight
over CORS.

## How it's organized

```
src/
├── api/            one file per backend module (authApi, attendanceApi...),
│                    every function just wraps an axios call and returns .data
├── components/
│   ├── common/       Button, Card, Modal, Toast, DataTable... shared everywhere
│   └── layout/        Sidebar, Topbar — the dashboard chrome
├── config/          roleNavConfig.js — single source of truth for each
│                     role's sidebar tabs
├── features/
│   ├── auth/          login, signup, forgot-password, verify-email
│   ├── landing/        the public marketing page
│   ├── dashboard/       student/ faculty/ coordinator/ admin/ — one folder
│   │                    per role, one file per tab
│   └── shared/          Profile/Settings/Notices pages reused by every role
├── hooks/            useAuth (login/signup/logout), useFetch (data loading)
├── layouts/          AuthLayout, DashboardLayout
├── routes/           ProtectedRoute, RoleRoute — auth + role guards
└── store/            authStore, uiStore (zustand, persisted to localStorage)
```

## Naming conventions used throughout

- Variables and functions read like plain English: `currentUser`, `isLoading`,
  `handleSubmit`, `fetchLoggedInUser`, `getMyAttendanceSummary`.
- Components are PascalCase (`StudentAttendance`), everything else is
  camelCase starting lowercase (`updateField`, `roleNavConfig`).
- A short comment sits just above each logical section/component explaining
  what it's for — not a comment on every line.

## Connecting the real backend

Every file in `src/api` maps 1:1 to the endpoint table in the system design
doc (`/api/auth`, `/api/attendance`, `/api/events`...). Nothing here is
mocked — pages call these functions directly through the `useFetch` hook, so
once your Express routes respond with the shapes implied by each call
(e.g. `getMyAttendanceSummary()` expects `{ overallPercentage, subjects: [...] }`),
the UI lights up with real data. No swap-out step needed.

## Still to wire up (backend-dependent, not a frontend gap)

- Google OAuth button on Login is UI-only until `VITE_GOOGLE_CLIENT_ID` +
  the backend's `/auth/google` redirect are live.
- QR code rendering for attendance sessions / event passes (backend returns
  a token today; add a QR image lib like `qrcode.react` once that's ready).
- Real-time notification/seat-update sockets (Socket.IO client can hang off
  `useAuthStore`'s access token — not added yet since the backend socket
  namespaces aren't live).
