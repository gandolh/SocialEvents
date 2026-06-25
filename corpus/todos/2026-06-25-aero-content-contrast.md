---
title: Aero content-area contrast (calendar grid, neutral chips, headings)
created: 2026-06-25
status: done
tags: [ui, aero, contrast, audit]
---

# Aero content-area contrast

Under the Aero theme the main content area is transparent, so content sits
directly on the saturated mid-blue desktop gradient. This hurts contrast in
several places (one root cause, several symptoms).

## Context
Found in the TP-06 screenshot audit, run 3 — see
[../test-plans/RESULTS.md](../test-plans/RESULTS.md). Symptoms:
- **F4a** Calendar month grid is blue-on-blue / washed out (worst).
- **F4b** "Other"-category chips (neutral tint) are invisible on the calendar —
  dark text, no chip background. Colored chips (purple/green) survive.
- **F4c** Page headings ("Event Directory", "Departments"), admin rows, and the
  empty-day message are low-contrast dark-on-blue.
- **F5** Event directory cards are over-translucent; blue bleeds through.

Relevant code:
- `client/src/components/Shell.tsx` — `<main>` has no surface (transparent).
- `client/src/routes/CalendarMonth.tsx` — grid cells/headers transparent.
- `client/src/lib/utils.ts` — `categoryChipClasses`; the "Other" branch has no
  solid background.
- `client/src/styles/index.css` — Aero tokens / `aero-glass` utilities.

## Acceptance
Content reads comfortably over the Aero background: give the main content area (or
the calendar grid + cards) a light glass surface, and the "Other" chip a real
light background. No regression to the glass aesthetic; verify via a re-audit
screenshot of the calendar + events pages.

Promoted to [Brief 14](../briefs/todo/14-aero-content-contrast.md).

Resolved 2026-06-25 — see [Brief 14](../briefs/done/14-aero-content-contrast.md).
