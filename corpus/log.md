# Log

## [2026-06-25] ingest | Corpus bootstrapped + Stitch design ingested

Bootstrapped `corpus/` (CLAUDE.md, index.md, log.md, wiki spine). Ingested the
Stitch design (5 screens + DESIGN.md) into [wiki/design-system.md](wiki/design-system.md).
Folded the product spec ([sources/SPEC.md](sources/SPEC.md)) into wiki synthesis
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

## [2026-06-25] ingest | UI test plans + Playwright hub; docs moved into corpus

Added corpus/test-plans/ (TP-01…06 plain-text plans + RESULTS.md) and a
playwright/ hub (README with server bring-up + fixtures, start-test-server.sh;
screenshots gitignored). Ran an MCP-driven UI audit on a seeded server: all
functional flows PASS (auth, calendar, events incl. create round-trip, ratings,
admin). Findings: F1 no responsive layout (medium), F2 host-rating value not shown
(low) — filed as todos; F3 dark mode (known). Moved docs/ → corpus/sources/ and
fixed all relative links (wiki, index, CLAUDE, README, TP-06).

## [2026-06-25] done | Briefs 11–13 — Audit fixes + Aero theme

Worked the open todos. Brief 11: host rating now displays its aggregate
(useHostRating hook). Brief 12: responsive shell — sidebar→glass drawer below lg,
top bar fits on mobile, no clipped controls. Brief 13: full modern Windows-7 "Aero"
theme (frosted glass + glossy blue gradients + glow) across shell, cards, modals,
inputs, buttons, and login, over a desktop-style gradient background. Layout
unchanged. tsc+build clean, 27/27 tests green. Playwright re-audit (run 2 in
test-plans/RESULTS.md) confirms F1+F2 resolved and Aero applied; screenshots in
playwright/screenshots/ (gitignored). New minor nit F4 (content-area contrast).
Closed both todos.

## [2026-06-25] lint | UI audit over screenshots (run 3)

Refreshed all stale (pre-Aero) screenshots and audited the full current Aero set.
Aero theme coherent + functional. Findings cluster around one root cause — the
transparent content area over the mid-blue desktop gradient: calendar grid
blue-on-blue (F4a), neutral "Other" chips invisible (F4b), low-contrast headings
(F4c), over-translucent cards (F5). Filed todo
[2026-06-25-aero-content-contrast]. Recommended single fix: light content surface.
See test-plans/RESULTS.md run 3. Screenshots gitignored.

## [2026-06-25] done | Brief 14 — Aero content-area contrast fix

Resolved the run-3 audit cluster (F4a/F4b/F4c/F5): wrapped main content in a light
glass panel, gave the calendar grid a white surface, switched category chips to
solid light tints (visible "Other" chip). Re-audit (RESULTS run 4) confirms all
resolved; Aero aesthetic preserved. tsc+build clean, 27/27 tests green. Closed
todo 2026-06-25-aero-content-contrast.

## [2026-11-01] maintenance | README rewritten, docs/ added, production start fixed, corpus brought to corpus-flow

The README follows the readme-docs standard now: a calendar hero, three more screenshots, an honest status line, a diagram and checked run commands, with the long setup moved to `docs/getting-started.md` and the image recipes to `docs/images/shots.md`. The images come from a local run on the seed plus seven made-up November events. The one-port production run, `npm run start --workspace server`, died on start because `tsc` does not copy the SQL migrations into `dist/`; the server build now copies them. Corpus: every wiki page got `summary:` and `updated:` frontmatter, the index lists the wiki from a generated catalog, and `routing.md`, `lint.sh`, `briefs/todo/` and `briefs/superseded/` were added. `status.md` lists brief 14 and today's re-check, and no longer prints the seed password. New todo: `todos/2026-11-01-eslint-config.md`.

## [2026-11-10] briefs | Briefs 15-18 written: harness, Base UI adoption, server structure, redesign

Four briefs for the owner's calls of 2026-11-09 and the grilling of 2026-11-10, in `briefs/todo/`. 15: the house style and quality harness (Prettier at width 120, `erasableSyntaxOnly`, typed ESLint, `check` and `check:fast`, `.claude/rules/`, a root `CLAUDE.md`, a `pretest` so a fresh clone tests); it also closes the ESLint todo. 16: Base UI adopted by the conventions (the app has none, so an adoption, not a bump), with the Light / Dark / System switch. 17: the server in the code structure, with Fastify 5.8.5 to 5.12.8 first. 18: a redesign with Hallmark on the estate board. No Tailwind brief: the app is on Tailwind v4 already. Measurements are in each brief, dated 2026-11-10.

## [2026-11-11] done | Brief 15 — the house style and the quality harness

Vendored house-style 1.0.0, formatted at width 120 (one commit, 44 files), added `noUnusedLocals` and `erasableSyntaxOnly`, and put the house ESLint config, knip, dependency-cruiser and the two convention checkers behind `npm run check`; `check:fast` and a `pretest` that builds `shared` came with it. Measured first: the six typed rules found 4, 5, 0, 0, 2 and 0 (as on 2026-11-10); `!` 5 in source and 3 in tests; `tsc` with `noUnusedLocals` 0 errors and `erasableSyntaxOnly` 4; vitest's recommended rules 0; typed lint 12.8 s with `projectService` against 11.6 s with `project: true`; knip 1 unused dependency, 5 unused exports, 1 unused type. All fixed. `check` runs in 25 s, `check:fast` in 9 s with one file changed. The convention checkers still run `--warn-only`: check-base-ui 7 findings, check-structure 67. Closed the ESLint todo; added `CLAUDE.md` and `.claude/rules/`.

## [2026-11-11] done | Brief 16 — Base UI adopted by the conventions, with the theme switch

The client moved from hand-built widgets to Base UI 1.9.0 (exact pin, subpath imports, wrappers under `components/ui/`): the dialog, the account menu, the notifications popover, the phone drawer, the All / Hosted-by-me filter (a `RadioGroup`), the invite tabs and checkboxes, with `InlineConfirm` for the two deletes (the event delete now asks). `window.confirm` is gone. A Light / Dark / System switch sits in the profile dialog: light on a first visit, kept in `localStorage`, a night-blue Aero dark block, `data-theme` on `<html>` set by a boot script and `lib/theme.ts`. The picker is a `RadioGroup` (device-only, rule 16), not the guarded `ToggleGroup` the brief named. The stylesheet's glass, gloss, desktop and chip values are tokens, with a z scale. `check-base-ui` went from 7 findings to 0 and runs strict; `scripts/check-contrast.mjs` joined `check:conventions`, with floors for seven light pairs that were already short. 22 client tests now run beside the 27 server ones. Light screenshots at 1280 and 390 px match the before set to within 2 levels per channel, apart from the detail dialog (now centred on the viewport, not the content panel) and the drawn checkbox.

## [2026-11-11] done | Brief 17 — the server in the house code structure

The server moved from `routes/ services/ dal/` to `features/<name>/` behind an `index.ts` each, with `plugins/` (errors, auth, the static client), `lib/http-error.ts`, `config.ts` (`loadConfig`, `loadEnvFile`) and `server.ts` (the entry, with `close-with-grace`, timeouts and a `TRUST_PROXY` setting). Fastify went 5.8.5 to 5.12.8. Stores are `createXStore(db)` built once in `buildApp` and passed as typed plugin options; `getDb`, `setDb` and `resetData` are gone, and tests build an in-memory app through `buildTestApp()`. All 30 routes use the zod type provider with a response schema (new wrapper schemas in `shared/`); the event-rating routes moved to the ratings feature at the same URLs. One error plugin keeps the flat body and passes Fastify's own 4xx through (they were 500s); the 404 handler is rate-limited. `check-structure` went from 66 warnings to 0, strict, with five `NODE_ENV` findings in `config.ts` excepted; dependency-cruiser guards the feature indexes. Replies: 116 captured before and after, 100 identical, 16 changed on purpose (Fastify's 4xx, the JSON 404, "received null", and validation before a route's own 404 or 403 on two bad-body cases), no field lost. 42 server tests (was 27), 22 client. Guards run in `preValidation` to keep 401 ahead of 400.


## [2026-11-12] done | Todo: the runtime dependency advisories

`npm audit --omit=dev` went from 8 vulnerabilities (1 critical, 5 high, 2 moderate) to 0. Four commits, one per move: zod 4.4.3 to 4.6.7 in `server/` and `shared/` (one copy in the lockfile); `@fastify/static` 9.1.3 to 10.1.10 (the plugin passes only `root`, so the 10.0.0 `setHeaders` change doesn't touch it; 10.1.10 adds a `code` to the plugin's own 403 error, which no route reaches); `nodemailer` 9.0.1 to 10.5.0 (10.0.0 only raised the floor to Node 20; the transport options the mail code uses, `host`, `port`, `secure`, `auth` and `jsonTransport`, are unchanged; it ships its own types, so `@types/nodemailer` is gone); and `npm audit fix` for `seroval` 1.8.1, `fast-uri`, `minimatch` and `brace-expansion`, lockfile only. Before and after each move, 66 API replies (every route, each error status, signed in as an admin and users) and 14 static-client replies from a real socket (index, asset with its cache header, range, SPA fallback, directory, dotfile, traversal, the JSON `/api` 404) were compared: all identical. `npm run check` exit 0 after each. Left in the full audit, dev only: `vite`, `@vitest/mocker` and a `minimatch` range under the tooling. Not deployed, so no owner step. The todo file is deleted.

## [2026-11-13] approved | Brief 18 — the redesign direction

The owner approved the redesign direction "The open invitation" on the estate redesign board, with every question on the board standing as proposed: the sidebar and the Month / Day / List / Map row become one row of places on the top bar and a phone bottom bar, Aero stays in both themes, and the direction is The open invitation. The build follows, tokens first, then one screen per commit.

## [2026-11-13] done | Brief 18 — the redesign, "The open invitation"

Built from the owner's approval above: new tokens (the board's values in the app's own names, both themes), Lexend and Figtree 5.3.0 in place of Geist (which ends the "Geist" versus "Geist Sans" mismatch that had been rendering the system face), then one commit per screen: the shell (places as tabs on a glass top bar, a phone bottom bar, no sidebar and no phone menu), the calendar with the next-event ticket and the phone dot grid and list, the day view, the directory, the map, the admin page, the event detail (a dialog, and a bottom sheet on a phone), the create form, sign in and register, and the profile dialog with the menus. `check-contrast.mjs` has no known floors (text 4.62:1 light and 5.32:1 dark); Playwright 1.63.0 holds 31 specs (focus ring, reduced motion, overflow at 390 and 360, the first-screen geometry, states, the theme). The reopened decisions are changed in `wiki/decisions.md` with their old lines kept. README images and `docs/images/shots.md` are not retaken: retakes are blocked.

## [2026-11-13] done | Brief 19 — escape the mail HTML, bound the weather call

Promoted from two todos of 2026-11-10. User text in the invite and welcome mail is HTML-escaped through one helper, the invite subject is one line, and the weather fetch aborts after 5 s and falls back to the mock. The call stays on plain HTTP because the provider's free plan has no HTTPS; recorded in `wiki/integrations.md`. Not deployed, so no owner step.
