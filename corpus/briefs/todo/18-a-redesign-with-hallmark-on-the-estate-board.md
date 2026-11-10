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
  - `node scripts/check-contrast.mjs` passes for text and for the focus ring, in both themes;
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
