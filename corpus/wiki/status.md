# Status — 2026-06-25

## Where things stand
**v1 complete and verified end-to-end.** The full rebuild — shared contract,
Fastify+SQLite backend, self-made auth, all features, integrations with mock
fallback, seed, and the React/Vite/Tailwind-v4 client implementing the Stitch
design — is built, typechecks clean, passes its test suite, and was smoke-tested
live in a browser against the running server.

Since v1: audit findings F1/F2 fixed and a **Windows-7 "Aero" theme** (modern
interpretation — frosted glass + glossy blue + glow) applied across the UI.

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

## Verification (2026-06-25)
- `npm install` clean, **0 vulnerabilities**.
- `tsc -b` clean across all 3 workspaces.
- **27/27 Vitest tests** pass (DAL, auth, guards, ownership, ratings, weather cache).
- Client builds (220 modules); shared + server build clean.
- **Live browser smoke:** login → calendar (today highlighted) → All Events
  directory (4 seeded events, correct category colors/hosts) → event detail
  (purple star rating 4.5, mock weather, attendees, admin delete). 401 enforced;
  built client served single-origin (SPA fallback 200).

## How to run
See [README.md](../../README.md). `npm install` → `build:shared` → `migrate` →
`seed` → `dev:server` + `dev:client`. Runs with zero API keys (mocks active).
Seed logins: admin@/alex@/dana@/max@/sam@socialevents.local (password123).

## Possible next work (not started)
- Content-area contrast polish under Aero (audit finding F4 — see
  [test-plans/RESULTS.md](../test-plans/RESULTS.md) run 2).
- Aero dark mode (the original Stitch dark-mode plan is superseded by Aero).
- Live Google Maps interactive markers (currently iframe embed + fallback).
- Automated E2E tests (Playwright) for the key flows.
- See [open-questions.md](open-questions.md) for the cover-image decision.
