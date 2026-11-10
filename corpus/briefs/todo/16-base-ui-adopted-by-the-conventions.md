# Task 16: Base UI adopted by the conventions, with the theme switch

**Depends on:**

- In SocialEvents: brief 15, for the gate, the formatter and `.claude/rules/web.md`.
- In the owner's skills library:
  - brief 02, *A base-ui skill, styled with Tailwind*: rules 1-13, the references, the wrapper patterns and `check-base-ui.mjs`;
  - brief 15, *Enforce the base-ui and code-structure skills in every repo*: the checker runs `--warn-only` until this brief is done.
- The owner's grilling of 2026-11-10: Q15, Q16, Q18, Q19, Q40, Q41, Q44, Q57, Q58, Q60, Q62.

**Runs before:** 18. It may run before or after 17, but never at the same time: 17 touches no client file, only `package-lock.json`.

## Context

The owner's call of 2026-11-09 is Base UI everywhere at 1.9.0, styled with Tailwind v4, with the base-ui skill's conventions enforced in each repo. SocialEvents has Tailwind v4.3.1 already (`@tailwindcss/vite`, one stylesheet at `client/src/styles/index.css`) and **no Base UI at all**: every dialog, menu and popover is hand-built. So this is an **adoption** brief, not a bump, and no Tailwind brief is needed. It also adds the Light / Dark / System switch (Q18), which the app lacks: the Windows 7 "Aero" skin is its only look.

The pin: add `"@base-ui/react": "1.9.0"` to `client/package.json`, exact, with no `^`. 1.9.0 is the latest stable (`npm view @base-ui/react version`, 2026-11-10). Rule 1 is met by that line.

### The hand-built widgets (read 2026-11-10, `grep -nE "role=|aria-|fixed inset|addEventListener|useState\(false\)|confirm\(" -r client/src`)

| # | Widget, and where it is | Base UI part |
|---|---|---|
| 1 | The modal. Escape through a window listener (`client/src/components/ui/Modal.tsx:18-23`), a click-outside backdrop (28-31), `role="dialog"` and `aria-modal` by hand (38-39). No focus trap, no initial or returned focus, no scroll lock, no portal. Three callers: `client/src/components/CreateEventModal.tsx:63`, `client/src/components/ProfileModal.tsx:42`, `client/src/components/EventDetailModal.tsx:38` | `Dialog` |
| 2 | The account menu. A full-screen click catcher (`client/src/components/AccountMenu.tsx:12`) and an absolute panel (13) with two actions. No arrow keys, no Escape, no focus return. Opened from `client/src/components/Shell.tsx:168-171`. It also holds the Profile dialog inside the menu (`AccountMenu.tsx:33-41`), so closing the menu would close the dialog | `Menu` |
| 3 | The notifications panel. The same catcher and panel (`client/src/components/NotificationsMenu.tsx:12-13`), with two buttons per row, so not menu items. Opened from `Shell.tsx:158-165` | `Popover` |
| 4 | The phone drawer. Built inline (`client/src/components/Shell.tsx:100-118`), with its own Escape listener (47-53), a close-on-navigation effect (42-45, the `set-state-in-effect` finding of brief 15), a backdrop and no focus handling | `Drawer` (Q40, swipe to close) |
| 5 | The All / Hosted-by-me filter, two buttons in a bordered box (`client/src/routes/AllEvents.tsx:61-75`) | `RadioGroup` (Q41, Q57: a list filter) |
| 6 | The People / Departments switch in the create dialog (`client/src/components/CreateEventModal.tsx:125-139`), which swaps the list below it | `Tabs` |
| 7 | The invite checkboxes, native (`client/src/components/CreateEventModal.tsx:147, 159`) | `Checkbox` (rule 13) |
| 8 | The department delete, which calls `window.confirm` (`client/src/routes/AdminPage.tsx:60`), a rule 11 hit | the inline confirm (Q58): "Delete? Yes / No" in the row |
| 9 | The event delete, which deletes at once with no confirm (`client/src/components/EventDetailModal.tsx:46-53`) | the same inline confirm, repo owner question 1 |

**Kept, with the reason:**

- The three native `<select>`s (`client/src/components/ui/Input.tsx:69`, used at `client/src/components/CreateEventModal.tsx:88`, `client/src/routes/AllEvents.tsx:76, 86`), the text, password and `datetime-local` inputs, and the textarea stay native (Q16). The native date-time picker and the phone's `<select>` are better than any web copy.
- `StarRating` (`client/src/components/ui/misc.tsx:62-109`) stays buttons. Each click saves the user's rating, and the stars show the event's average, not the user's own choice, so a pressed or selected state would announce something false. It gets `role="group"` and an `aria-label`, and a `conventions.json` note (decision 4).
- The month grid, the top bar's view links and the sidebar links are navigation links, not widgets. `client/src/components/MapView.tsx:50` is an iframe with a `title`.
- There is no toast, tooltip or switch in the app: errors are inline text.

### The audit against rules 1-13 (2026-11-10)

| Rule | Violations | Where |
|---|---|---|
| 1. Exact pin | 1 | no `@base-ui/react` line yet |
| 2. Subpath imports | 0 | no imports |
| 3. Base UI only under `ui/` | 0 now | `client/src/components/ui/` exists; the new wrappers go there |
| 4. Tailwind on the parts; `cn()` merges | 1 | `cn` is a plain join (`client/src/lib/utils.ts:1`), with no `tailwind-merge`, and lives in `utils.ts`, not `lib/cn.ts`; 12 files import it |
| 5. One stylesheet | 0 | `client/src/styles/index.css` only. Its `body`, `html` and `*` rules (lines 79-98 and 165-168) are unlayered and beat utilities, so they move into `@layer base` |
| 6. Semantic tokens only | 7 | `client/src/lib/utils.ts:24, 26, 28` (`bg-[#ece1ff]`, `bg-[#ffe2d6]`, `bg-[#d7f0e2]`, `text-[#1c7a4a]`), `client/src/components/ui/Button.tsx:20, 21, 23` (two gradients and a shadow), `client/src/components/ProfileModal.tsx:80` (`text-[#006d3b]`). Also 11 `white/` opacity classes in 6 files, which dark mode cannot restyle, and 67 colour literals in `index.css` |
| 7. Motion | n/a | no popup animates yet |
| 8. Floating parts portalled, z from tokens | 5 | the modal, two menus and the drawer use literal `z-40` or `z-50` (`Modal.tsx:29`, `AccountMenu.tsx:12-13`, `NotificationsMenu.tsx:12-13`, `Shell.tsx:102`); none is portalled |
| 9. A trigger around a component uses `render` | 0 | no Base UI triggers yet |
| 10. `Select.Root` with `items` | 0 | no Base UI `Select` (Q16) |
| 11. No `window.confirm` | 1 | `client/src/routes/AdminPage.tsx:60` |
| 12. Dialogs | 3 | no `Title` part, no `initialFocus`, no Escape guard, and the two form dialogs close on a backdrop click (`Modal.tsx:30`): `CreateEventModal.tsx:63`, `ProfileModal.tsx:42` |
| 13. Base UI over hand-built | 7 | widgets 1-7 above |

## Decisions of 2026-11-10

1. **Base UI only under `ui/`** (Q15). Wrappers live in `client/src/components/ui/`, imported from subpaths.
2. **A switch, light first** (Q18). Light / Dark / System. A first visit shows the light theme and does not follow the system. The choice is kept on the device, in `localStorage`, because the app has no per-user settings (`client/src/components/ProfileModal.tsx` edits only name and job title). Tailwind's `dark:` variant keys off `data-theme` on `<html>` through `@custom-variant`, not `prefers-color-scheme`.
3. **The phone menu is a `Drawer`** (Q40), closed by a swipe, a tap outside, the X or Esc.
4. **A form dialog sets `disablePointerDismissal`** (Q58). It closes with Cancel, the X or Esc. That is `CreateEventModal` and `ProfileModal`. The event detail dialog is not a form and keeps outside-tap close.
5. **A filter that switches a list is a `RadioGroup`; a switch of panels is `Tabs`** (Q41, Q57). The theme picker saves on each choice, so it is a guarded `ToggleGroup` (Q57): arrow keys move focus without saving, Enter or Space saves, and one item stays pressed.
6. **Inline confirms stay the pattern** (Q58). The two deletes get "Delete? Yes / No" in place, not an `AlertDialog`.
7. **Visual parity** (Q19). The light theme is done when before and after screenshots at 1280 and 390 px show no visible change to layout or colour. A few pixels of spacing or rounding need not be fixed or listed.
8. **Root font size** (Q44). None is set, so nothing moves.
9. **Tests** (Q60). jsdom tests only for wrappers that hold logic: the theme store, the `Dialog` dismissal rules, the `Drawer` close. Flows stay in the Playwright test plans.
10. **Aero stays** (the standing decision, [wiki/decisions.md](../../wiki/decisions.md), "Visual theme"). Aero is the skin of both themes. Brief 18's redesign may propose otherwise on the board, and the owner decides there.

## Owner decisions (defaults)

1. **The event delete confirm** (widget 9). Default: add the inline "Delete event? Yes / No" to the detail dialog's footer. Today one click deletes the event and its attendee rows. The alternative is to leave it, and record it.
2. **The dark Aero look.** Default: a night-blue desktop gradient, smoked-glass panels (translucent navy, not black), the same blue primary lifted for contrast, and the category hues lightened. The values are a first proposal that step 5's contrast script checks. Brief 18's redesign may replace them.

## The wrapper set: `client/src/components/ui/`

| File | What it is | From |
|---|---|---|
| `Dialog.tsx` | Base UI `Dialog`: `open`, `onClose`, `title`, `footer`, `size`, `dismissOnBackdrop` (false sets `disablePointerDismissal`); a `Title`, `initialFocus` on the first `[data-autofocus]` else the first field, the Escape guard, a portal | `Modal.tsx`, replaced. The three callers rename `Modal` to `Dialog` |
| `Popover.tsx` | Base UI `Popover`: `trigger` through `render`, `children`, align end | the notifications panel |
| `Menu.tsx` | Base UI `Menu`: items with `onSelect`, a danger item | the account menu |
| `Drawer.tsx` | Base UI `Drawer`, `swipeDirection="left"`, a visually hidden `Title` "Menu", `finalFocus` to the menu button | the inline drawer in `Shell.tsx` |
| `Tabs.tsx` | Base UI `Tabs` with the app's underline style | the invite switch |
| `RadioGroup.tsx` | Base UI `RadioGroup` and `Radio.Root`, rendered as segmented buttons | the All / Hosted-by-me filter |
| `ToggleGroup.tsx` | Base UI `ToggleGroup` and `Toggle`, guarded | the theme picker |
| `Checkbox.tsx` | Base UI `Checkbox.Root` and `Indicator`, with its label | the invite lists |
| `InlineConfirm.tsx` | a small component, not Base UI: "Delete? Yes / No" in place, `aria-live` | the two deletes |

`Button.tsx`, `Input.tsx`, `misc.tsx` and `index.ts` stay. `client/src/lib/cn.ts` (new) holds `cn()` on `clsx` 2.1.1 and `tailwind-merge` 3.7.0, pinned, and `client/src/lib/utils.ts` re-exports nothing: its 12 importers change.

## Files you OWN

- `client/src/components/ui/**`, the files replaced, and every import of them.
- `client/src/components/Shell.tsx`, `AccountMenu.tsx`, `NotificationsMenu.tsx`, `CreateEventModal.tsx`, `EventDetailModal.tsx`, `ProfileModal.tsx`; `client/src/routes/AllEvents.tsx`, `client/src/routes/AdminPage.tsx`.
- `client/src/styles/index.css` and `client/index.html` (tokens, the layer, the theme script).
- `client/src/lib/cn.ts`, `client/src/lib/theme.ts` (new), `client/src/lib/utils.ts` (chip colours become tokens).
- `client/package.json` (Base UI, `clsx`, `tailwind-merge`, and for tests `vitest` 4.1.9, `jsdom` 31.0.0, `@testing-library/react` 16.3.3, `@testing-library/dom` 10.4.2, all exact), `client/vitest.config.ts`, the root `test` script, `package-lock.json`.
- `scripts/conventions.json` (the `StarRating` note), `scripts/check-contrast.mjs` (new).
- `.claude/rules/web.md`: the Base UI and theme lines.
- Corpus: [wiki/design-system.md](../../wiki/design-system.md), [wiki/decisions.md](../../wiki/decisions.md), [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).

## Files you must NOT touch

- `server/` and `shared/`.
- Any layout, spacing or copy. This brief changes structure, behaviour and tokens only.
- The light theme's look (decision 7).

## What to do

One commit per numbered step. After each, `npm run check` passes, with `check-base-ui` `--warn-only`.

1. **Before.** Run `check-base-ui` strict and record the counts by rule. Take Playwright screenshots at 1280 and 390 px, signed in on the seed ([../../../playwright/README.md](../../../playwright/README.md), [../../../docs/images/shots.md](../../../docs/images/shots.md)): the month calendar, the day view, the directory, the map page, admin, the sign-in page, and the open create, profile and detail dialogs, the account menu, the notifications panel and the phone drawer. Keep them out of git.
2. **Dependencies and `cn()`.** Add the pinned packages, `client/vitest.config.ts` (jsdom) and `lib/cn.ts`; move the 12 importers. Rule 1 and 4 now pass.
3. **Tokens, and the one stylesheet.** In `index.css`: move the `html`, `body` and `*` rules into `@layer base`; turn the glass, gloss and glow values into `@theme` tokens (`--color-glass-from`, `--color-glass-to`, `--color-glass-edge` and the like) so the four `@utility` blocks use `var()`; add a named z-index scale; replace the three chip hexes, the three `Button.tsx` literals and `ProfileModal.tsx:80` with tokens; replace the 11 `white/` classes with the glass tokens. The light theme must not change visibly.
4. **`Dialog.tsx`.** Replace `Modal.tsx`. The two form dialogs pass `dismissOnBackdrop={false}`. Rename the three callers.
5. **The theme.**
   1. `lib/theme.ts`: `getTheme()`, `setTheme(theme)`, `resolve(theme, prefersDark)`, with the key `socialevents-theme`. Every `localStorage` call is in `try`/`catch`. The default is `light`.
   2. A small inline script in `client/index.html` sets `data-theme` before first paint, so there is no flash.
   3. `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *))`, a `[data-theme="dark"]` token block (decision 2 of the defaults), and `color-scheme: dark` there so the native selects, date inputs and scrollbars match.
   4. `System` follows `prefers-color-scheme` and a `matchMedia` listener.
   5. An "Appearance" section in the profile dialog, with the guarded `ToggleGroup`.
   6. `scripts/check-contrast.mjs` reads the token pairs from `index.css` (text on surface, on the glass, on the primary, the chip texts, the focus ring) in both themes and exits 1 under 4.5:1 for text and 3:1 for the ring.
   7. Tests: `theme.test.ts` for the default, the stored choice, a throwing `localStorage` and System.
6. **`Menu.tsx`**, and the account menu on it. Lift the profile dialog out of `AccountMenu.tsx` into `Shell.tsx`, so it outlives the menu. Focus returns to the avatar button.
7. **`Popover.tsx`**, and the notifications panel on it.
8. **`Drawer.tsx`**, and the phone menu on it. The drawer closes when a link inside it is pressed (done in brief 15's `onClick`, kept), so `Shell.tsx`'s two effects (lines 42-53) are deleted. A test shows Esc and a link press close it.
9. **`RadioGroup.tsx`, `Tabs.tsx`, `Checkbox.tsx`**, each with its call site, one commit each.
10. **`InlineConfirm.tsx`**, and the two deletes on it. Keep the disabled state while the request runs and the existing cache invalidation.
11. **The exception.** Write the `StarRating` entry in `scripts/conventions.json` with its reason, and give it `role="group"` and an `aria-label`.
12. **After.** Retake the screenshots, in both themes for the shell, the directory and one dialog. List any visible difference in the light theme with its reason. Run `check-base-ui` strict. Update `.claude/rules/web.md`, [wiki/design-system.md](../../wiki/design-system.md) (the skin is now two themes), [wiki/decisions.md](../../wiki/decisions.md), [wiki/status.md](../../wiki/status.md) and [log.md](../../log.md).

## Acceptance

- [ ] `grep -rn "@base-ui/react" client/src --include=*.ts --include=*.tsx | grep -v "components/ui/"` prints nothing, and `grep '"@base-ui/react"' client/package.json` prints `"1.9.0"` with no `^`.
- [ ] `check-base-ui` strict reports 0 for rules 1, 2, 3, 6, 8, 9 and 11.
- [ ] `grep -rn "confirm(\|window.alert" client/src` prints nothing.
- [ ] `node scripts/check-contrast.mjs` passes for both themes.
- [ ] Tests pass for: the theme store (default light, stored choice, throwing storage, System); a form `Dialog` ignoring an outside press while the detail dialog closes on one; Esc closing a `Dialog` and the `Drawer`; a link press closing the `Drawer`.
- [ ] A first visit in a browser whose system theme is dark shows the light theme (Playwright, with `colorScheme: "dark"`). Choosing Dark persists across a reload. Choosing System follows the system.
- [ ] The before and after light screenshots at 1280 and 390 px show no visible change to layout or colour.
- [ ] `npm run check` passes, and `bash corpus/lint.sh` ends clean.

## Interplay

- Brief 15 supplies the gate, `web.md` and the formatter. This brief changes `Shell.tsx`, which that brief already touched, so run it after.
- Brief 18's redesign is built as a token change first, over the two themes this brief makes. The theme switch must survive it in both.
