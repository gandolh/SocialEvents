---
paths:
  - "client/src/**"
---

# The web client (`client/src`)

- Read [corpus/wiki/design-system.md](../../corpus/wiki/design-system.md) before you add or change a screen.
- Components come through `client/src/components/ui/`. A new control goes there, not inline in a route.
- The Aero skin, as "The open invitation", is the look of both themes ([corpus/wiki/decisions.md](../../corpus/wiki/decisions.md)):
  glass only on the bars and the dialogs' title bars (`aero-bar`), opaque islands, dialogs and fields, one `aero-gloss`
  button per screen region, the two-tone `aero-focus` ring. Colours, type steps (`text-label` to `text-month`), radii and
  z-indexes come from the `@theme` tokens in `client/src/styles/index.css`, and the dark theme re-states the colours and
  shadows in its `[data-theme="dark"]` block. Lexend is `font-display`, Figtree the body. Add a `--text-*` size or a
  `--radius-*` name to the lists in `client/src/lib/cn.ts`.
- The phone layout is below `md` (768 px, `useIsPhone` for a swap in JS); `narrow` (380 px) tightens it. Write a
  breakpoint as a named, rem-valued one: Tailwind sorts `max-[379px]` and `min-[1200px]` before `max-md` and `md`,
  so the wider rule wins. No arbitrary colour in a class, no `white/` opacity, no literal
  `z-*`: add or reuse a token (and add a new `--z-index-*` name to the list in `client/src/lib/cn.ts`).
- Base UI (`@base-ui/react`, pinned at 1.9.0, no `^`) is imported only under `client/src/components/ui/`, by subpath
  (`@base-ui/react/dialog`). Feature code imports the wrapper. Each popup goes through its `Portal`.
- A trigger around a component uses `render`. A dialog has a `Title`; a dialog that holds a form passes
  `dismissOnBackdrop={false}`. A destructive action asks with `InlineConfirm`, never `window.confirm`.
- The phone event sheet is a `SheetDrawer` (there is no phone menu: a bottom bar holds the places). A filter or a setting kept on the device is a `RadioGroup` (the theme picker too);
  a switch of panels is `Tabs`. `StarRating` stays buttons (a `conventions.json` exception).
- The theme is Light, Dark or System, kept in `localStorage` under `socialevents-theme`. `data-theme` on `<html>` is
  always `light` or `dark`: `lib/theme.ts` resolves System, and `index.html` sets it before the first paint.
  `dark:` keys off that attribute, never `prefers-color-scheme`. `node scripts/check-contrast.mjs` checks both themes.
- Tests: jsdom only for a wrapper that holds logic (`client/src/**/*.test.tsx`); flows stay in the Playwright plans.
  Select by role and name.
- `npm run check:conventions` runs `check-base-ui` strict: it reports 0, so add nothing it flags.
- Read the `house-style` skill for the rest of the rules and why each exists.
