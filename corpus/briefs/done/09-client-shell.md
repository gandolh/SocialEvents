# Task 09 — Client shell + design system

## Files you OWN
client/src/styles/index.css (Tailwind v4 @theme), client/src/lib/*,
client/src/components/ui/*, client/src/components/Shell.tsx, api client + hooks,
NotificationsMenu, AccountMenu, MapView, EventDetailModal, CreateEventModal,
ProfileModal.

## What to do
Tailwind v4 token theme from Stitch DESIGN.md; typed fetch client + TanStack Query
hooks for every endpoint; app shell (sidebar + topbar + view switcher) matching the
Stitch month-view layout; reusable UI primitives (Button/Input/Modal/Card/Chip/
Avatar/StarRating/Spinner); shared modals.

## Acceptance
Client typechecks + builds; shell renders on-design against live API.

---
## Outcome (2026-06-25)
Shipped. Shell, design tokens, all query hooks, and shared modals built. Verified
live in browser: login, shell, event detail (weather/ratings/attendees/delete) all
on-design. MapView falls back gracefully without a browser key.
