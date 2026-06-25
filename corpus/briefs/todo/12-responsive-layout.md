# Task 12 — Responsive layout

## Context
From the TP-06 audit (finding F1) and todo
[2026-06-25-responsive-layout](../../todos/2026-06-25-responsive-layout.md).
The shell is desktop-only: the fixed 280px sidebar stays at narrow widths and the
top-bar avatar clips off-screen. Design intent
([design-system.md](../../wiki/design-system.md)): mobile sidebars → drawer/bottom
sheet; tablet → icon rail; desktop → full.

## Files you OWN
- `client/src/components/Shell.tsx` (responsive shell)
- minor: a small hamburger/toggle; Tailwind responsive classes

## What to do
1. Below `lg` (1024px): hide the fixed sidebar; add a hamburger button in the top
   bar that opens the sidebar as an overlay **drawer** (with backdrop, closes on
   nav-click and Escape). At `lg`+ keep the current fixed sidebar.
2. Ensure the top bar fits at ~375–600px: the view switcher may scroll/wrap or be
   condensed, and the bell + avatar must remain visible (no clipping).
3. Keep desktop appearance unchanged.

## Acceptance
At 375px / 600px / 1024px+ the shell is usable: no clipped controls; sidebar
reachable via drawer on small screens; desktop unchanged. Typecheck + build clean;
verified in a browser at multiple widths.
