---
summary: A dated snapshot of where the project stands, what was checked, and what could come next
updated: 2026-11-11
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
content-area contrast fixed (brief 14).

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
config. `check-structure` (67) runs `--warn-only` until the server brief. See [decisions.md](decisions.md) and the
log entry of that date.

## Base UI and the theme (2026-11-11, brief 16)
The client is on Base UI 1.9.0 (dialog, menu, popover, drawer, tabs, radio group, checkbox) under
`client/src/components/ui/`, with a Light / Dark / System switch in the profile dialog. `check-base-ui` runs strict
and reports 0; `scripts/check-contrast.mjs` is in `check:conventions`. `npm run check` passes, with 22 client
jsdom tests beside the 27 server ones.

## How to run
See [README.md](../../README.md). `npm install` → `build:shared` → `migrate` →
`seed` → `dev:server` + `dev:client`. Runs with zero API keys (mocks active).
The seed prints its sign-in addresses and their shared local password.

## Possible next work (not started)
- Live Google Maps interactive markers (currently iframe embed + fallback).
- Automated E2E tests (Playwright) for the key flows.
- See [open-questions.md](open-questions.md) for the cover-image decision.
