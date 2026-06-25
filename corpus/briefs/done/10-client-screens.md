# Task 10 — Client screens

## Files you OWN
client/src/routes/* (AuthPage, CalendarMonth, CalendarDay, AllEvents, MapPage,
AdminPage), client/src/router.tsx, App.tsx, main.tsx.

## What to do
Auth (login/register) gating; calendar month grid (category chips, today
highlight, prev/next); day agenda; All Events directory (search/sort/category/
mine toggle, cards); map page (markers + fallback); admin two-pane dept/member
manager. TanStack Router code-based routes; QueryClient in main.

## Acceptance
All screens render against seed data; full build green; live smoke passes.

---
## Outcome (2026-06-25)
Shipped & verified live. Login → calendar (June 2026, today highlighted) → All
Events directory (4 seeded events, correct category colors/hosts) → event detail.
Full monorepo typecheck clean; client build 220 modules; live HTTP smoke (login,
events, weather, 401, SPA fallback) all pass.
