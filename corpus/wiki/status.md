---
summary: A dated snapshot of where the project stands: v1 built, then Base UI, the server structure and (2026-11-13) the "open invitation" redesign; what was checked and what could come next
updated: 2026-11-13
---

# Status — 2026-11-01

## Where things stand
**v1 complete and verified end-to-end.** The full rebuild — shared contract,
Fastify+SQLite backend, self-made auth, all features, integrations with mock
fallback, seed, and the React/Vite/Tailwind-v4 client implementing the Stitch
design — is built, typechecks clean, passes its test suite, and was smoke-tested
live in a browser against the running server.

Since v1: audit findings F1/F2 fixed and a **Windows-7 "Aero" theme** (modern
interpretation — frosted glass + glossy blue + glow) applied across the UI, then its
content-area contrast fixed (brief 14). Briefs 15-17 added the check gate, Base UI with a
Light / Dark / System switch, and the server's house structure. **2026-11-13 (brief 18):** the UI
was redesigned as "The open invitation": places as tabs on a glass top bar (no sidebar), a phone bottom
bar, tonight's event as a ticket over a full-width month, glass only on the bars, Lexend and Figtree,
a still skeleton for loading. The contrast check has no known floors left, and Playwright 1.63.0
specs (focus ring, reduced motion, 390 and 360 overflow, the first-screen geometry, states, the theme switch)
run against the seeded test server. See [design-system.md](design-system.md).

## Briefs (all done)
| # | brief | state |
|---|---|---|
| 01 | scaffold monorepo | done |
| 02 | shared contract (zod + types) | done |
| 03 | server foundations (sqlite, migrations, DAL) | done |
| 04 | auth (bcrypt, JWT, cookie, guards) | done |
| 05 | API routes & services | done |
| 06 | integrations (weather/maps/email, real+mock) | done |
| 07 | seed script | done |
| 08 | Vitest core-logic tests | done |
| 09 | client shell + design system | done |
| 10 | client screens | done |
| 11 | host rating display (audit F2) | done |
| 12 | responsive layout (audit F1) | done |
| 13 | Windows-7 Aero theme | done |
| 14 | Aero content-area contrast (audit F4/F5) | done |
| 15 | the check gate | done |
| 16 | Base UI and the theme switch | done |
| 17 | the server in the house structure | done |
| 18 | the redesign, "The open invitation" | done (README images not retaken: retakes are blocked) |

## Verification (2026-06-25)
- `npm install` clean, **0 vulnerabilities**.
- `tsc -b` clean across all 3 workspaces.
- **27/27 Vitest tests** pass (DAL, auth, guards, ownership, ratings, weather cache).
- Client builds (220 modules); shared + server build clean.
- **Live browser smoke:** login → calendar (today highlighted) → All Events
  directory (4 seeded events, correct category colors/hosts) → event detail
  (purple star rating 4.5, mock weather, attendees, admin delete). 401 enforced;
  built client served single-origin (SPA fallback 200).

## Re-check (2026-11-01)
Run from a fresh clone with Node 24 on Linux, during a README refresh.
- `npm install`, `build:shared`, `migrate`, `seed`, both dev servers; signed in
  and walked the calendar, the directory, an event dialog and the map fallback.
- `tsc -b` clean, **27/27 Vitest tests** pass, `npm run build` clean.
- **Fixed:** the one-port production run, `npm run start --workspace server`, died
  on start because `tsc` does not copy `src/db/migrations/*.sql` into `dist/`. The
  server build now copies them; `/`, `/events` and `/api` answer as expected.
- (`npm run lint` had no config then; the house-style harness fixed that on 2026-11-11, see below.)

## The harness (2026-11-11)
`npm run check` (typecheck, ESLint, Prettier, knip + dependency-cruiser + the two convention checkers, tests) passes;
`npm run check:fast` is the quick subset. The code is formatted at width 120 and linted by the vendored house
config. `check-structure` ran `--warn-only` until the server brief (brief 17, below). See [decisions.md](decisions.md) and the
log entry of that date.

## Base UI and the theme (2026-11-11, brief 16)
The client is on Base UI 1.9.0 (dialog, menu, popover, drawer, tabs, radio group, checkbox) under
`client/src/components/ui/`, with a Light / Dark / System switch in the profile dialog. `check-base-ui` runs strict
and reports 0; `scripts/check-contrast.mjs` is in `check:conventions`. `npm run check` passes, with 22 client
jsdom tests beside the 27 server ones.

## The server in the house structure (2026-11-11, brief 17)
The server is grouped by feature with typed plugin options, a schema and a response schema on every route (30), one
error plugin and `close-with-grace`; Fastify is 5.12.8. `check-structure` runs strict (0 errors, 5 excepted for
`NODE_ENV` in `config.ts`) and dependency-cruiser guards the feature indexes. 42 server tests and 22 client tests pass.
See [architecture.md](architecture.md) and [decisions.md](decisions.md).

## How to run
See [README.md](../../README.md). `npm install` → `build:shared` → `migrate` →
`seed` → `dev:server` + `dev:client`. Runs with zero API keys (mocks active).
The seed prints its sign-in addresses and their shared local password.

## Possible next work (not started)
- Live Google Maps interactive markers (currently iframe embed + fallback).
- More Playwright flows beyond the redesign's checks (create an event, the admin actions).
- Retake the README images and `docs/images/shots.md` once retakes are allowed (they still show the old look).
- The ticket and the directory count invited people as "attending" (the app's own count, a bug for a later brief).
- See [open-questions.md](open-questions.md) for the cover-image decision.
