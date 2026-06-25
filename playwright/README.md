# Playwright — UI testing & validation hub

Reusable info for driving the SocialEvents UI in a real browser (manual MCP-driven
audits and ad-hoc validation). **Screenshots and traces here are gitignored** — do
not commit them unless explicitly asked. The plain-text **test plans live in
[../corpus/test-plans/](../corpus/test-plans/index.md)**; this directory is the
"how to run" companion to those "what to test" plans.

## Layout
```
playwright/
  README.md          ← you are here (how to run, fixtures, conventions)
  screenshots/       ← captured PNGs (gitignored; .gitkeep retained)
  scripts/           ← reusable helper scripts (e.g. start a seeded test server)
```

## Bring up a test server
The UI needs the API + the built client served from one origin.

```bash
# from repo root
npm run build:shared
npm run build --workspace client          # builds client/dist (served by the server)

# seed a throwaway DB and run the server on a test port
DATABASE_PATH=./data/pwtest.sqlite JWT_SECRET=pwtest-secret-pwtest-secret-1234 PORT=3009 \
  npx tsx server/src/seed/seed.ts
DATABASE_PATH=./data/pwtest.sqlite JWT_SECRET=pwtest-secret-pwtest-secret-1234 PORT=3009 \
  npx tsx server/src/index.ts      # run in background

# base URL
#   http://localhost:3009
```
Or use the helper: `bash playwright/scripts/start-test-server.sh` (see that file).

Tear down: kill the node process and `rm -f data/pwtest.sqlite*`.

## Seed fixtures (from server/src/seed/seed.ts)
All users share the password **`password123`**.

| email | name | role | department |
|---|---|---|---|
| admin@socialevents.local | Ada Admin | **admin** | Engineering |
| alex@socialevents.local | Alex Engineer | user | Engineering |
| dana@socialevents.local | Dana Designer | user | Design |
| max@socialevents.local | Max Marketer | user | Marketing |
| sam@socialevents.local | Sam Guest | user | (none) |

Seeded events (4): *Weekly Board Games* (Game night, host Alex, Jul 2),
*Q3 Team Offsite* (Team building, host Ada, Jul 16), *New Hire Welcome* (Other,
host Max, Jul 10), *Halloween Mixer* (Holiday, host Dana, Oct 28). Seed dates are
**July/October 2026** — the calendar opens on the current month, so use **List**
view or page the calendar forward to see events.

## Routes
| path | screen |
|---|---|
| `/` or `/calendar` | Calendar — month grid |
| `/calendar/day` | Calendar — day agenda |
| `/events` | All Events directory (list) |
| `/map` | Event map |
| `/admin` | Admin (departments/members) — admin only |
| (unauthenticated) | Login / Register card |

## Conventions
- **Integrations run in mock mode** with no keys: weather shows "(mock)", the map
  shows a keyless fallback panel. That's expected in tests.
- Screenshot filenames: `screenshots/<plan-id>-<step>.png` (e.g. `TP-01-login.png`)
  so they trace back to a test plan.
- Each run is independent; re-seed for a clean state. The seed is idempotent (skips
  if users exist) — delete the DB file to truly reset.
- Console: a benign favicon 404 may appear; ignore it.
