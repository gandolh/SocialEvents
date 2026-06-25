# Log

## [2026-06-25] ingest | Corpus bootstrapped + Stitch design ingested

Bootstrapped `corpus/` (CLAUDE.md, index.md, log.md, wiki spine). Ingested the
Stitch design (5 screens + DESIGN.md) into [wiki/design-system.md](wiki/design-system.md).
Folded the product spec ([docs/SPEC.md](../docs/SPEC.md)) into wiki synthesis
pages (overview, architecture, data-model, api-contract, auth, integrations).
Locked tech choices + pinned package versions in [wiki/decisions.md](wiki/decisions.md).
Rebuild has not started; old `frontend/` + `backend/` still present (to be wiped).

## [2026-06-25] done | Brief 01 — Monorepo scaffolded

npm workspaces (client/server/shared), pinned deps, TS project refs, Vite 8 +
Tailwind v4 CSS-first theme (tokens from Stitch), Fastify 5 stack, Vitest. Old
frontend/+backend/+README wiped (recoverable in git). Install clean, shared +
client build green, 0 vulnerabilities. Swapped `geist`→`@fontsource/geist-sans`
(geist pulls next+vuln postcss); added `@fastify/static`. See brief 01 outcome.

## [2026-06-25] done | Briefs 02–08 — Full backend shipped & verified

shared API contract (zod schemas + types), server foundations (better-sqlite3,
migration runner, 8-table schema, hand-written DAL), self-made auth (bcrypt + HS256
JWT cookie + guards), all REST routes/services (events w/ dept→attendee expansion,
invites, notifications, dup guard; ratings; RSVP; notifications; weather/maps),
integrations with mock fallback, idempotent seed. 27 Vitest tests + end-to-end
inject smoke all green; 0 vulns. Decided: ship RSVP toggle in v1 (removed from
open-questions). Added deps: dotenv, @fastify/static. Next: client (09, 10).

## [2026-06-25] decision | Brief numbering = actual build order

Numbering diverged from the initial status plan: 02=shared contract, 08=tests.
Client split into briefs 09 (shell/design) + 10 (screens). status.md updated.

## [2026-06-25] done | Briefs 09–10 — Client shipped; v1 complete & verified

React 19 + Vite 8 + Tailwind v4 + TanStack Query/Router client implementing the
Stitch design: app shell (sidebar + view switcher), auth gating, calendar
month/day, All Events directory, map (iframe + keyless fallback), event detail
(weather/ratings/RSVP/attendees), admin dept/member manager, profile, notifications.
Typed fetch client + query hooks for every endpoint.

Final verification: tsc -b clean (3 workspaces), 27/27 tests pass, client builds
(220 modules), live browser smoke confirmed on-design rendering with real seed data
(login → calendar → directory → event detail). Single-origin static serving works.
All 10 briefs done. v1 complete.
