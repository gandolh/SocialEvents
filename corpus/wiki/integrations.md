# Integrations (optional keys, mock fallback)

Pattern: each integration is an **interface** with a **real** impl (used when its
key/config is present) and a **mock** impl (otherwise), chosen at startup. **The
app must run and demo with zero keys configured.** Startup logs which mode each is
in. Detail: [docs/SPEC.md](../../docs/SPEC.md) §8.

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
