# Changelog

All notable changes to TradieOne are documented here.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and [Conventional Commits](https://www.conventionalcommits.org/).

## [1.11.0] - 2026-07-05

### ✨ Features

- Clients page (`/clients`) redesigned with stat cards (Total/Active Clients, Projects in Progress, Outstanding Balance), a search + status/type filter bar, a client table, and working pagination — all computed from the client list, not hardcoded
- New Client modal: client info (name, type, email, phone, avatar), collapsible "Additional Details" (address, ABN, payment terms, default GST, notes), and a Primary Contact section with a "same as client" shortcut
- ABN is now required when Client Type is "Commercial", enforced via zod validation
- Creating a client currently only updates local state (`useState`) — there is no backend endpoint yet for listing/creating clients, so nothing persists past a page refresh

## [1.10.0] - 2026-07-05

### ✨ Features

- Onboarding now has a Step 3 "Plan Confirmation" screen: shows the active Free Forever plan, a setup-progress checklist, and CTAs to go to the dashboard or upgrade
- New `/onboarding/upgrade` page with Monthly/Annual billing toggle, three plan tiers (Solo Tradie, The Growing Crew, The Commercial Outfit), and an expandable feature comparison
- Selecting a paid plan opens a payment modal (Stripe Elements for card number/expiry/CVC, billing address, subscription summary with GST breakdown) — card tokenization via `stripe.createPaymentMethod()` is wired and verified with Stripe test cards
- "Go to Dashboard" (Step 3 and upgrade page) confirms the Free plan via `POST /api/Subscriptions/upgrade` and redirects; shared via `useConfirmFreePlan` hook

### ⚠️ Known gaps

- Paid-plan checkout is not connected to the backend yet: no confirmed endpoint exists to create a Stripe PaymentIntent from the tokenized payment method, so `Upgrade Now` stops after tokenizing the card. Pending input from Kel on how the PaymentIntent ID will be obtained.

## [1.9.0] - 2026-06-19

### ✨ Features

- Onboarding Step 1 logo field now shows an image preview after file selection and a Remove button to clear it; upload to storage is pending backend file upload API

## [1.8.0] - 2026-06-19

### 🐛 Fixes

- `api` axios client (authgen) now has a hardcoded fallback URL `https://authgen.azurewebsites.net` when `VITE_API_BASE_URL` is not set at build time — fixes signup/login broken in production where the env var was undefined
- CI workflow now passes `VITE_API_BASE_URL` and `VITE_TDO_API_BASE_URL` as env vars during the build step so they are baked into the Vite bundle correctly

## [1.7.0] - 2026-06-18

### 🐛 Fixes

- `country` field in register and onboarding Step 1 changed from `"Australia"` to `"AU"` — the backend expects ISO 3166-1 alpha-2 code; sending the full name caused a 500 on `PUT /api/Tenants/{id}`

## [1.6.0] - 2026-06-18

### 🐛 Fixes

- Error handlers in register, onboarding Step 1, and onboarding Step 2 now surface plain-text API responses (e.g. `"User not match or User not existed."`) correctly; previously only JSON `message`/`title` fields were checked, so plain-string 400/500 bodies fell through silently to the generic fallback
- Onboarding Step 2 error handler corrected from `??` to `||` so empty-string responses fall through to the generic message (mirrors the fix already applied to Step 1 in v1.5.0)

## [1.5.0] - 2026-06-18

### ✨ Features

- Register page now calls `POST /api/Users` immediately after `/signup`, using the returned token to create the user and tenant on tdoserver; stores `tenantId` in Zustand before navigating to `/onboarding`
- Onboarding Step 1 now calls `PUT /api/Tenants/{tenantId}` (instead of `POST /api/Users`) with the business details collected in the form
- Error handlers across register and onboarding now use `||` instead of `??` so empty response bodies fall through to the generic message (fixes blank toast on 500)

## [1.4.0] - 2026-06-16

### ✨ Features

- Onboarding Step 2 — "User Identity" screen: avatar upload UI, first name, last name, phone, date of birth, and job title dropdown
- On submit calls `PUT /api/UserProfiles?tenantId={tenantId}` and redirects to `/dashboard`
- "Go Back" button returns to Step 1 without losing Step 1 state
- Sidebar progress bar animates from 1/3 to 2/3 when advancing to Step 2
- Step 2 pre-fills first name and last name from the register form data stored in localStorage

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
