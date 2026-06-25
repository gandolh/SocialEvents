# TP-06 — UI/UX audit

Run setup & fixtures: [../../playwright/README.md](../../playwright/README.md).
Design reference: [../wiki/design-system.md](../wiki/design-system.md) and
the Stitch screens under `../sources/stitch_design/`.

## Goal
Audit design fidelity, accessibility, responsiveness, and UI states — not just
"does it work" but "does it look and behave right."

## Cases
1. **Design fidelity** — shell (sidebar + top-bar view switcher), month grid,
   event directory cards, and event detail modal match the Stitch layout and
   palette (Trust Blue primary; category colors: Game night purple, Holiday
   orange-red, Team building green, Other neutral).
2. **Typography** — Geist font loads; headings vs. body weights are distinct.
3. **Empty states** — empty day, no events matching filters, no notifications,
   empty department each show a friendly empty state (not a blank/error).
4. **Loading states** — data-fetching views show a spinner, not a flash of empty.
5. **Modal behavior** — modals trap focus visually, close on Escape and on
   backdrop click, and apply the backdrop blur (L3 elevation).
6. **Keyboard a11y** — primary actions are reachable by Tab; inputs have labels;
   buttons have accessible names (aria-labels on icon-only buttons).
7. **Responsive** — at a narrow viewport (~600px) the layout remains usable
   (note: sidebar→bottom-sheet conversion from DESIGN.md is a known gap if absent).
8. **Contrast** — text on colored chips/buttons meets a reasonable contrast bar.

## Pass criteria
No major design regressions vs. Stitch; states are handled; obvious a11y basics
present. Findings (gaps/bugs) are logged and, if durable, filed as corpus todos.
