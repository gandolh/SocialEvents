# Task 14 — Aero content-area contrast

## Context
From the run-3 screenshot audit + todo
[2026-06-25-aero-content-contrast](../../todos/2026-06-25-aero-content-contrast.md).
Aero's transparent content area sits on the saturated mid-blue desktop gradient,
causing: F4a calendar grid blue-on-blue, F4b neutral "Other" chips invisible,
F4c low-contrast headings, F5 over-translucent cards.

## Files you OWN
- `client/src/components/Shell.tsx` (give `<main>` a light glass surface)
- `client/src/routes/CalendarMonth.tsx` (grid surface + cell readability)
- `client/src/lib/utils.ts` (`categoryChipClasses` — solid light chip bgs)
- `client/src/styles/index.css` (optional: a content-surface utility)

## Files you must NOT touch
- server, shared, api hooks

## What to do
1. Wrap page content on a **light glass surface** so it doesn't sit on the raw
   gradient (a content panel, or per-screen surfaces). Keep the Aero look.
2. Calendar grid: give the grid a light glass background and ensure cell numbers +
   chips are legible.
3. Chips: replace near-transparent `/10`–`/20` backgrounds with solid light
   category-tinted backgrounds; ensure the **"Other"** chip has a visible bg.
4. Event directory cards: reduce translucency enough that text is crisp.

## Acceptance
Calendar, events directory, admin, and empty states read comfortably over the Aero
background (no blue-on-blue, "Other" chip visible). Glass aesthetic preserved.
tsc + build clean; verified by a re-audit screenshot of calendar + events.

---
## Outcome (2026-06-25)
Shipped. main content wrapped in a light glass panel (bg-white/55 + blur + ring);
calendar grid given a white surface; category chips switched to solid light tints
(incl. a visible white "Other" chip). Re-audit (RESULTS run 4) confirms F4a/F4b/
F4c/F5 resolved — calendar legible, "Other" chip visible, headings/cards crisp,
Aero glass aesthetic preserved. tsc+build clean; 27/27 tests green.
