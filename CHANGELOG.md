# Changelog

All notable changes to TradieOne are documented here.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and [Conventional Commits](https://www.conventionalcommits.org/).

## [1.3.0] - 2026-06-16

### ✨ Features

- Onboarding Step 1 — "Business Identity" screen implementing the Figma design: logo upload, ABN, business email, business phone, GST registered toggle, and full address fields (address line, suburb, state dropdown, postcode)
- After completing Step 1, calls `POST /api/Users` on `tdoserver.azurewebsites.net` with firstName/lastName from localStorage + all business details; stores returned `tenantId` in Zustand store
- Sign up now redirects to `/onboarding` instead of `/token` after receiving the auth token

### 🏗️ Build

- Added `tdoApi` axios client for `tdoserver.azurewebsites.net` (shared interceptors with `api`)
- Added `VITE_TDO_API_BASE_URL` env var (falls back to the Azure URL if not set)
- Added `tenantId` and `setTenantId` to the Zustand auth store (persisted to localStorage)
- Added `onboardingStep1Schema` and `OnboardingStep1Data` type to `auth.types.ts`

## [1.2.0] - 2026-06-16

### ✨ Features

- Login flow: simplified to send `{ username, password }` to `POST /login`; response typed as `{ token }` matching the confirmed API shape; user object constructed from form email on success

## [1.1.0] - 2026-06-16

### ✨ Features

- Sign up flow: form sends only `{ username, password }` to `POST /signup` on `authgen.azurewebsites.net`; remaining profile fields (`businessName`, `firstName`, `lastName`) are persisted to `localStorage` under `tradieone-pending-profile`
- Token page (`/token`) — protected route that displays the JWT returned by the signup endpoint after successful registration
- API error handler on signup now surfaces the actual server error (`message`, `title`, or `errors` object) via Sonner toast instead of a generic fallback

## [1.0.0] - 2026-06-06

### ✨ Features

- Login screen with split-panel hero layout, Zod-validated form, show/hide password, Google SSO button, and Sonner error toasts
- Protected route guard with redirect to `/login` and `from` state preservation
- Collapsible sidebar navigation persisted to localStorage via Zustand
- App shell layout with lazy-loaded routes and `<Suspense>` spinner

### 🏗️ Build

- Project initialised: React 19, Vite 7, TypeScript 5.8
- Tailwind CSS v4 with CSS-only theme config and shadcn/ui component system
- TanStack Query v5 — 5 min stale time, no window-focus refetch
- Zustand v5 with `persist` middleware for auth and UI stores
- React Router v7 — all routes code-split with `lazy()`
- React Hook Form v7 + Zod v4 for forms and API response validation
- Axios HTTP client with Bearer token injection and 401 → logout interceptor
- Vitest v4 + Testing Library configured with jsdom environment
- Conventional Commits enforced via commitlint + husky `commit-msg` hook
- TypeScript typecheck runs on every `pre-commit` via husky
- release-it configured for automated semver bumps and changelog generation
