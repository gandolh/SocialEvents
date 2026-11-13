---
summary: Weather, maps and email: the real service each one uses with a key, and its stand-in without one
updated: 2026-11-13
---

# Integrations (optional keys, mock fallback)

Pattern: each integration is an **interface** with a **real** impl (used when its
key/config is present) and a **mock** impl (otherwise), chosen at startup. **The
app must run and demo with zero keys configured.** Startup logs which mode each is
in. Detail: [sources/SPEC.md](../sources/SPEC.md) §8.

| Integration | Env | Real | Mock |
|---|---|---|---|
| Weather | `WEATHER_API_KEY` | fetch provider, **24h cache** keyed by rounded lat/lng | deterministic fake current weather (icon + description) |
| Maps | `VITE_MAPS_BROWSER_KEY` (public, client) | Google Maps JS (markers, picker, views) | static/non-interactive placeholder + coords |
| Email | `SMTP_*` | Nodemailer SMTP | console / dev-capture transport |

## Notes
- **Weather + Email are server-side** (keys stay on server). Weather proxied via
  `GET /api/weather`; email sent during event create / register. English copy.
- **Maps is client-side** (browser key); enablement surfaced via
  `GET /api/maps/config` so the client knows whether to render the live map or the
  fallback.
- Weather cache: in-memory is acceptable for v1 (matches old app), keyed by
  rounded coords with 24h TTL. Tested in Vitest.
- **Weather call (2026-11-13):** it carries `AbortSignal.timeout(5000)`; a slow provider
  falls back to the mock like any other failure. The URL stays **plain HTTP**: the
  provider's free plan has no HTTPS (a paid-plan feature), so the key travels in the
  query string in the clear. Moving to a paid plan is the only fix; then change the
  scheme in `server/src/features/integrations/weather.ts`.
- **Mail HTML (2026-11-13):** every user-supplied value in the invite and welcome mail
  goes through `escapeHtml` (`server/src/lib/html.ts`), and the invite subject through
  `singleLine`. A new mail template must do the same.
