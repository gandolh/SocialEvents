# Task 18: A redesign with Hallmark, on the estate board

**Depends on:**

- In SocialEvents: brief 16, for Base UI, the token set and the Light / Dark / System switch. Brief 15 for the gate.
- In the owner's skills library:
  - brief 24, now "vendor Hallmark as the design skill, and adopt taste-skill 2.5's ideas": palettes and type dealt by trade, and its copy layer;
  - the estate redesign board, a single artifact with one page per app, owned by the skills library.
- The owner's grilling of 2026-11-10, Q39: no bake-off, Hallmark redesigns every web UI.

**Runs after:** 16. It changes no server file.

## Context

SocialEvents is a planner for a company's social events: people create events, invite people or departments, and answer Join or Can't make it, on a calendar, a list and a map, with weather and ratings. It runs locally and is not deployed.

### The screens today (read 2026-11-10)

`client/src/App.tsx` shows a spinner while the session loads, the sign-in page when there is no session, and the router otherwise.

| Screen | Route | File |
|---|---|---|
| Sign in and register | none (shown when signed out) | `client/src/routes/AuthPage.tsx` |
| The shell: sidebar, top bar with the Calendar, Day, List and Map links, notification bell, avatar | all | `client/src/components/Shell.tsx` |
| Month calendar | `/` and `/calendar` | `client/src/routes/CalendarMonth.tsx` |
| Day view | `/calendar/day` | `client/src/routes/CalendarDay.tsx` |
| Event directory | `/events` | `client/src/routes/AllEvents.tsx` |
| Map | `/map` | `client/src/routes/MapPage.tsx`, `client/src/components/MapView.tsx` |
| Admin: departments and members | `/admin` | `client/src/routes/AdminPage.tsx` |
| Create event dialog | open from the shell | `client/src/components/CreateEventModal.tsx` |
| Event detail dialog | open from the calendar, directory and map | `client/src/components/EventDetailModal.tsx` |
| Profile and settings dialog | open from the account menu | `client/src/components/ProfileModal.tsx` |
| Notifications panel and account menu | open from the top bar | `client/src/components/NotificationsMenu.tsx`, `client/src/components/AccountMenu.tsx` |
| Phone drawer | below the `lg` breakpoint | `client/src/components/Shell.tsx` |

### What the design docs fix today

- [wiki/design-system.md](../../wiki/design-system.md): the layout, the screen inventory and the typography (Geist, a modular scale) come from the Stitch design, "Professional Play" corporate modern, with a 280 px fixed sidebar, a month grid, category chips (Game night purple, Holiday orange-red, Team building green, Other neutral) and purple stars. The visual skin on top is the Windows 7 "Aero" theme.
- [wiki/decisions.md](../../wiki/decisions.md), "Visual theme": Windows 7 Aero (frosted glass, glossy blue, glow, over a desktop gradient) is locked, done in briefs 13 and 14. "English only" is also locked.
- The Stitch sources: `corpus/sources/stitch_design/` (five screens and the design tokens), and [sources/SPEC.md](../../sources/SPEC.md).
- Brief 16 adds Light and Dark as two modes of the Aero skin, with a switch in the profile dialog. The switch survives this brief.

Inside those decisions, a redesign may change the tokens, the type, the density and the layout of each screen. A change to the Aero skin itself, the category colours or the English-only copy goes to the owner on the board as a reopened decision.

## Owner decisions (defaults)

1. **Aero stays unless the owner reopens it** on the board. The proposal may show a variant beside it, clearly labelled.
2. **The seed's made-up names and events** are the only data on the proposal's screens. No invented numbers, ratings or photographs: Hallmark's Floor forbids invented facts, and any photograph is credited and openly licensed.

## Files you OWN

- `client/src/styles/index.css` and the tokens in it, `client/index.html` (fonts only).
- The screen files in the table above, and `client/src/components/ui/**` for visual changes.
- `scripts/check-contrast.mjs` (extended), `.claude/rules/web.md`.
- Corpus: [wiki/design-system.md](../../wiki/design-system.md), [wiki/decisions.md](../../wiki/decisions.md), [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).
- The README's images and `docs/images/shots.md` once the build is done.

## Files you must NOT touch

- `server/` and `shared/`.
- Behaviour, routes, copy that states facts, and the Light / Dark / System switch's logic.
- Anything below until the owner has approved the proposal on the board.

## What to do

1. **Screenshots of every screen today** at 1280 and 390 px, in the light and the dark theme, signed in on the seed ([../../../playwright/README.md](../../../playwright/README.md), [../../../docs/images/shots.md](../../../docs/images/shots.md)). Keep them out of git.
2. **A proposal per screen** with Hallmark, using taste-skill 2.5's trade palettes and copy layer where they help (a social-events planner is a workplace-culture tool), inside the recorded decisions above.
3. **Put the proposal on SocialEvents' page of the estate board**, beside today's screenshots, at 1280 and 390 px, in both themes.
4. **The owner approves it there.** Nothing below starts before that.
5. **Build it as a token change first** (one commit: palette, type scale, radii, shadows, both themes), **then one screen per commit**, in the order of the table. After each commit, `npm run check` passes and the two themes still work.
6. **Retake the screenshots**, update [wiki/design-system.md](../../wiki/design-system.md) and [wiki/decisions.md](../../wiki/decisions.md), and refresh the README images by `docs/images/shots.md`.

## Acceptance

- [ ] The owner's approval on the board is recorded in [log.md](../../log.md) with its date.
- [ ] Hallmark's Floor checks pass, as commands or tests:
  - `node scripts/check-contrast.mjs` passes for text and for the focus ring, in both themes, with the `KNOWN_LIGHT` floors that brief 16 kept for seven light pairs deleted (every pair at its minimum);
  - a visible focus ring on every interactive element, checked by a Playwright test that tabs through the shell, the directory and one dialog;
  - a `prefers-reduced-motion` path: `grep -rn "motion-safe\|motion-reduce" client/src` shows every transition and animation guarded, and a Playwright run with reduced motion shows no animation on the dialogs and the drawer;
  - no invented facts or numbers: every figure on a screen comes from the seed or the API;
  - no horizontal scroll at 390 px: a Playwright check that `document.documentElement.scrollWidth <= 390` on each route.
- [ ] A first visit still shows the light theme, and Dark and System still work (brief 16's tests pass).
- [ ] `npm run check` passes, and `bash corpus/lint.sh` ends clean.

## Interplay

- Brief 16's tokens and wrappers are what this brief restyles. It adds no Base UI part.
- Brief 17 changes no screen, so it may run before or after.
- The estate board and the skills library's brief 24 are owned elsewhere: if either is not ready, step 3 waits and nothing else here moves.

## Outcome (2026-11-13)

Built from the owner's approval of "The open invitation" on the estate redesign board (every question standing as proposed: ask 1 yes, ask 2 keep Aero, ask 3 the direction). Steps 1-3 were done on the board; this is step 5 and the checks. The tokens landed in one commit, then one screen per commit: the shell, the calendar (the ticket, the month, the key, the phone dot grid and list), the day view, the directory, the map, the admin page, the event detail (a dialog, and a bottom sheet on a phone), the create form, sign in and register, and the profile dialog with the account menu and the notifications panel.

- **Tokens and type:** the board's values in the app's own names, light in `@theme` and dark in the `:root[data-theme="dark"]` block; new names only from the map (`on-surface-faint`, `gloss-edge`, `focus-halo`, `chip-neutral-edge`, `font-display`, the `text-*` scale, `radius-tile`, `shadow-dialog`, the four sizes). `@fontsource/geist-sans` is gone; `@fontsource-variable/lexend` and `figtree` 5.3.0 are in, with their "Variable" family names first in the stacks. **This also settles the old "Geist" versus "Geist Sans" bug**: the stylesheet asked for a face the package never registered, so the system face had been rendering.
- **Contrast:** `node scripts/check-contrast.mjs` exit 0 with `KNOWN_LIGHT` deleted: 36 pairs in both themes, each gradient (the bars, the gloss) at every stop. Minimums: text 4.62:1 light and 5.32:1 dark (the Game night chip on its tint is the closest of the chips; the gloss at its lightest stop in light, its darkest in dark); icons, edges, date bars, stars and the focus ring 3.99 light and 3.28 dark (control edge on the bar and on an island); an island against the desktop 3.52 and 1.43 with its 1 px edge.
- **Playwright 1.63.0** (exact, root `package.json`; `npm run e2e`): 31 specs pass with two workers: a visible two-tone focus ring on every control through the shell, the directory and the create dialog; reduced motion (the detail dialog and the phone sheet have a 0 s transition and no running animation); `scrollWidth <= width` on all five routes and on the sheet and the create form at 390 and 360; the first-screen geometry; the 44 and 48 px targets; the host's `4.0 (n)` on one line at 390 and 360; the empty month, the load errors and Try again; Join and Can't make it states; the host sees no answers; first visit light and the Dark, System, Light switch. Every `transition-*` is `motion-safe:` (the grep prints nothing unguarded). The fixture month (`playwright/global-setup.ts`) is the board's seven November events, added through the API as the seed users.
- **First screen** (the measured numbers; `layout.spec.ts`): 1280x800, the month island ends at 784 (all six weeks above the fold, for a month where no day holds two events); 390x844, the first two In November rows end at 697 and 754 above the bar at 780; 360x800, the first row ends at 711 above the bar at 736; scrolled to the end the list stops 16 px above the bar; the create form shows all four invitees without scrolling (last row ends 685, footer starts 706).
- **Against the comps:** each drawn screen rendered from its twin with Playwright and diffed (pixels differing by more than 24 per channel): calendar 0.4 and 0.6 percent at 1280, 6 to 8 percent at 390 and 360; event detail 0.8 and 1.2 percent at 1280, 11 to 18 percent on the phone sheet; create 5.5 and 6.3 percent at 1280, 5 percent on a phone. What remains: the twins simulate a 16 px gesture inset (the bar and the sheet footer are taller there, so everything above shifts), the native date field's picker icon, the fixture (the host rating reads `4.0 (2)` because the seed already holds one; Sam Guest carries a tick after the states spec answers for him), and font hinting.
- **Undrawn screens restyled** with the direction's tokens and patterns, no new layout: sign in and register, the day view, All Events with its filter, the map page and its keyless stand-in, the admin page, the profile and settings dialog with the theme switch, the notifications panel, the account menu, and the session-loading screen (a still skeleton).
- **Decisions:** `wiki/decisions.md` records the Visual theme, the Aero-narrowed, the type and the phone-menu decisions as changed on 2026-11-13, each with its old line kept; `wiki/design-system.md` and `.claude/rules/web.md` describe what shipped.
- **Not done, by the brief's own ruling:** step 6's README images and `docs/images/shots.md` are **not retaken**, since retakes are blocked; the README still shows the old look.

Deviations: (1) a named `narrow` breakpoint (`--breakpoint-narrow: 23.75rem`) was added to `@theme`, and the phone breakpoint is Tailwind's `md` (768) where the twins use 760; Tailwind sorts `max-[379px]` and `min-[1200px]` before `max-md` and `md`, so the wide rule won; named rem-valued breakpoints sort after, which `web.md` now says. (2) The key wraps and Create Event's label drops below `lg` (1024) where the twins use 1100 and 900. (3) `viewport-fit` was not added to `index.html`, so `env(safe-area-inset-bottom)` is 0 in a plain browser tab and the bars pad by it only where the browser exposes it. (4) A phone day cell with two events opens the first; the list below holds the rest. (5) With no upcoming event there is no ticket; for the host or an admin, or someone not invited, the ticket shows no Join and Can't make it (the title opens the detail, as in the dialog's footer). (6) Added accessible names (`Search events`, `Category`, `Sort`, `New department`, `Add department`, `Search users to add`) and made the directory's cards real buttons, so the focus ring check could cover them. (7) The emoji pins on the map list became the location icon. (8) `Attending ✓` and the pressed outline stand in for the states the comps do not draw. (9) The spec for the focus ring counts a date field's segments as one element, since a native picker icon takes no `:focus-visible`.
