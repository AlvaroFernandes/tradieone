# Changelog

All notable changes to TradieOne are documented here.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and [Conventional Commits](https://www.conventionalcommits.org/).

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
