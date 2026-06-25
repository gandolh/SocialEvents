# Task 13 — Windows 7 "Aero" theme (modern interpretation)

## Context
User wants a Windows 7 Aero look. Decided: **full Aero theme** (replaces the flat
Material-3 look across the app), **modern interpretation** (frosted glass + gloss +
blue glow, but clean and legible — not a pixel replica). Keeps the existing Stitch
layout/structure; restyles surfaces, not information architecture.

## Files you OWN
- `client/src/styles/index.css` (Aero tokens, glass/gloss utility classes, animated background)
- `client/src/components/ui/Button.tsx`, `Input.tsx`, `Modal.tsx`, `misc.tsx` (Card)
- `client/src/components/Shell.tsx` (glass sidebar + top bar)
- `client/src/routes/AuthPage.tsx` (glass login card)

## Files you must NOT touch
- server, shared, api hooks, routing logic, data flow

## What to do
1. **Aero palette/tokens:** classic Aero blue family; light "glass" surfaces with
   translucency; a soft desktop-style gradient app background.
2. **Glass surfaces:** sidebar, top bar, cards, modals use translucent backgrounds
   + `backdrop-blur` + 1px light border + subtle inner highlight (top sheen).
3. **Gloss buttons:** primary = glossy blue gradient with top highlight + hover
   glow; secondary = light glass. Rounded, with a faint outer glow on focus/hover.
4. **Aero glow:** focus rings and active nav use a blue glow rather than flat fill.
5. Keep contrast/legibility solid (modern, not muddy). Preserve category colors.

## Acceptance
App reads as Aero (glass + gloss + glow) across shell, cards, modals, buttons,
inputs, and login. Layout unchanged; typecheck + build clean; verified in browser.

---
## Outcome (2026-06-25)
Shipped. Aero tokens (Aero blue) + desktop gradient background; @utility classes
aero-glass / aero-glass-strong / aero-gloss / aero-gloss-light / aero-glow.
Applied to shell (glass sidebar/top bar/drawer), cards, modals, inputs, buttons
(glossy gradients), active nav, and login card. Layout unchanged; tsc+build clean;
27 tests green; verified in browser (login, shell, event detail, mobile).
