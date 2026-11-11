---
paths:
  - "client/src/**"
---

# The web client (`client/src`)

- Read [corpus/wiki/design-system.md](../../corpus/wiki/design-system.md) before you add or change a screen.
- Components come through `client/src/components/ui/`. A new control goes there, not inline in a route.
- The Aero theme is the skin of both themes ([corpus/wiki/decisions.md](../../corpus/wiki/decisions.md)): colours,
  glass, gloss and z-indexes come from the `@theme` tokens in `client/src/styles/index.css`, and the dark theme
  re-states them in its `[data-theme="dark"]` block. No arbitrary colour in a class, no `white/` opacity, no literal
  `z-*`: add or reuse a token (and add a new `--z-index-*` name to the list in `client/src/lib/cn.ts`).
- Base UI (`@base-ui/react`, pinned at 1.9.0, no `^`) is imported only under `client/src/components/ui/`, by subpath
  (`@base-ui/react/dialog`). Feature code imports the wrapper. Each popup goes through its `Portal`.
- A trigger around a component uses `render`. A dialog has a `Title`; a dialog that holds a form passes
  `dismissOnBackdrop={false}`. A destructive action asks with `InlineConfirm`, never `window.confirm`.
- The phone menu is a `NavDrawer`. A filter or a setting kept on the device is a `RadioGroup` (the theme picker too);
  a switch of panels is `Tabs`. `StarRating` stays buttons (a `conventions.json` exception).
- The theme is Light, Dark or System, kept in `localStorage` under `socialevents-theme`. `data-theme` on `<html>` is
  always `light` or `dark`: `lib/theme.ts` resolves System, and `index.html` sets it before the first paint.
  `dark:` keys off that attribute, never `prefers-color-scheme`. `node scripts/check-contrast.mjs` checks both themes.
- Tests: jsdom only for a wrapper that holds logic (`client/src/**/*.test.tsx`); flows stay in the Playwright plans.
  Select by role and name.
- `npm run check:conventions` runs `check-base-ui` strict: it reports 0, so add nothing it flags.
- Read the `house-style` skill for the rest of the rules and why each exists.
