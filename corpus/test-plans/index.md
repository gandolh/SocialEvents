# Test plans

Plain-text descriptions of **what** to test in the SocialEvents UI. The **how**
(server bring-up, fixtures, routes, conventions) lives in the Playwright hub:
[../../playwright/README.md](../../playwright/README.md). Screenshots captured
during a run go to `playwright/screenshots/` (gitignored).

These are manual/MCP-driven exploratory + audit plans, not automated specs (no
automated E2E suite yet — see [status.md](../wiki/status.md)).

## Plans
- [TP-01 — Authentication](TP-01-auth.md) — login, register, logout, gating, errors
- [TP-02 — Calendar](TP-02-calendar.md) — month grid, day agenda, navigation
- [TP-03 — Events](TP-03-events.md) — directory, detail, create, RSVP, delete
- [TP-04 — Ratings & weather](TP-04-ratings-weather.md) — event/host stars, mock weather
- [TP-05 — Admin](TP-05-admin.md) — departments & member management, role gating
- [TP-06 — UI/UX audit](TP-06-ui-audit.md) — design fidelity, a11y, responsive, states

## How a plan run works
1. Bring up a seeded test server (see Playwright hub).
2. Walk each numbered case; record pass/fail.
3. Save screenshots as `screenshots/<plan-id>-<step>.png`.
4. Note findings; file durable issues as corpus todos/briefs.

## Latest run
See [RESULTS.md](RESULTS.md) for the most recent audit outcome.
