# Task 17: The server in the house code structure

**Depends on:**

- In SocialEvents: brief 15, for the gate, `eslint-plugin-n`'s `no-process-env` and `.claude/rules/server.md`.
- In the owner's skills library:
  - brief 03, *A code-structure skill for the Fastify + React apps*: rules 1-11, the `server-skeleton.md` reference, `zod-type-provider.md`, `migrating-a-server.md`, `check-structure.mjs`, and the dependency-cruiser and knip presets;
  - brief 16, *The Fastify servers adopt the code structure*: the method;
  - brief 15, *Enforce the base-ui and code-structure skills in every repo*: `check-structure` runs `--warn-only` until this brief is done.
- The owner's grilling of 2026-11-10 and its technical calls: Q23, Q24, Q25, Q27, Q43, Q52, Q53, Q54, Q55, Q56.

**Order:** after 15. It touches no file in `client/`, so it can run before or after 16, but never at the same time as it (both change `package-lock.json`).

## Context

The owner asked on 2026-11-09 for one researched code structure, enforced in every repo. SocialEvents' server is small (35 files, about 2,250 lines, SQL included under `server/src/`) and layered: `routes/` call `services/`, which call `dal/`, which call a module-level SQLite handle. The structure asks for something different:

- one folder per feature;
- dependencies passed as typed plugin options, never imported as singletons;
- a schema, with a response schema, on every route;
- one config module, one error handler and an entry that only starts the app.

SocialEvents is not deployed (README), so there is no Dockerfile or deploy stack that names the entry file, and Q1 does not apply. Fastify 5.8.5 is also behind: this brief bumps it first.

### The versions (read 2026-11-10, `npm view <pkg> version`)

- **fastify** 5.8.5 pinned in `server/package.json:25`; the latest is **5.12.8**. In a scratch copy with 5.12.8, `npx tsc -b` and `npx vitest run` in `server/` pass (27 tests).
- Plugins behind their latest, left alone here: `@fastify/cookie` 11.0.2 (11.1.5), `@fastify/cors` 11.2.0 (11.4.1), `@fastify/helmet` 13.0.2 (13.2.0), `@fastify/rate-limit` 11.0.0 (11.2.2), `@fastify/static` 9.1.3 (10.1.10, a major that needs `fastify-plugin` 6). They bump together in the estate's next Fastify round.
- **zod 4.4.3**, one copy (`npm ls zod`: client, server and shared all dedupe to it). `@fastify/type-provider-zod` 1.0.3 needs `>=4.2.0`, so no zod move.
- New pinned dependencies: `@fastify/type-provider-zod` 1.0.3 (with its non-optional peers `@fastify/swagger` 9.9.3 and `openapi-types` 12.1.3, type weight only), `fastify-plugin` 6.0.1, `close-with-grace` 2.5.0, and `dependency-cruiser` 18.7.2 as a dev dependency.

### What is there (read 2026-11-10)

- **Routes:** 30 in 7 route files plus `GET /api/health` in `server/src/app.ts:71`. Counts: `routes/auth.ts` 4, `routes/users.ts` 5, `routes/ratings.ts` 3, `routes/departments.ts` 3, `routes/events.ts` 9 (three of them event-rating routes), `routes/notifications.ts` 3, `routes/integrations.ts` 2.
- **Hand parsing:** 30 `.parse(request.` calls in 7 files (`routes/events.ts` 12, `routes/users.ts` 6, `routes/ratings.ts` 4, `routes/notifications.ts` 3, `routes/auth.ts` 2, `routes/departments.ts` 2, `routes/integrations.ts` 1): `grep -rn "\.parse(request\." server/src | wc -l`. No service parses request input, so the regex check does not miss helper parsing here. There is **no route `schema`** at all, and so no response schema.
- **The error handler** is inline at `server/src/app.ts:33-48`. It maps `ZodError` to 400 `validation_error`, `HttpError` to its code, a status of 429 to `rate_limited`, and everything else to 500 `internal_error`. So **Fastify's own 4xx fall to a 500**: a malformed JSON body or an unsupported content type is logged as a server error. The body is flat, `{ error, message? }` (`shared/src/common.ts:27`, read by `client/src/api/client.ts:31-37`).
- **The guards** reply 401 and 403 themselves from `preHandler`s (`server/src/auth/guards.ts:26, 37, 41`). By the Round 8 fact, a status declared in a response schema that the handler never sends becomes a 500, so each route declares only its own success statuses.
- **Config** is one module, `server/src/config/env.ts`, parsed with zod at import time (line 21, the only `process.env` read), after `import "dotenv/config"` (line 1). Seven files import it: `server/src/app.ts`, `server/src/index.ts`, `server/src/db/connection.ts`, `server/src/auth/jwt.ts`, `server/src/auth/cookie.ts`, `server/src/integrations/email/index.ts`, `server/src/integrations/weather/index.ts`. `dotenv/config` reads `.env` from the working directory, so a run from the repo root (`playwright/scripts/start-test-server.sh:25`) reads a different file than `npm run dev -w server`. A missing file is normal here (every key is optional), so quiet is right; a missing `JWT_SECRET` in production already throws (`env.ts:24-27`).
- **The data layer is a module singleton.** `getDb()` is called 36 times across `server/src/dal/*.ts` (601 lines in 5 files), `server/src/db/*.ts` and the seed; tests swap it with `setDb()` (`server/src/test/helpers.ts`). Nothing is passed as a plugin option.
- **The entry** is `server/src/index.ts` (46 lines): it runs migrations, builds the app, registers `@fastify/static` and a SPA fallback that replaces the 404 handler, and listens on `0.0.0.0`. It has no signal handling and no timeouts. `@fastify/rate-limit` is a dependency, but the 404 handler is not rate-limited.
- **Names the rename touches:** `server/package.json` (`dev` and `start`, lines 7 and 9), `playwright/scripts/start-test-server.sh:25`, `playwright/README.md:29`. No Dockerfile, and `docs/getting-started.md` names the npm scripts, not the file.
- **Transforms:** none in `shared/src`. `weatherQuerySchema` (`shared/src/integrations.ts:12-13`) uses `z.coerce`, which is input only. So the provider's "unidirectional transform" serializer trap does not apply.
- **Tests:** 4 files, 27 tests, vitest. `server/src/routes/routes.test.ts` (135 lines) builds the app with `buildApp()` and calls `app.inject()` 13 times; `server/src/dal/dal.test.ts` (187) covers five stores in one file.

### The move map: every file under `server/src/` (35 files)

| Today | Lines | Target | Note |
|---|---|---|---|
| `index.ts` | 46 | `server.ts` | The entry: config, migrations, `buildApp`, `close-with-grace`, `listen`. |
| `app.ts` | 74 | `app.ts` | `buildApp(config, deps)`. The error handler leaves for `plugins/errors.ts`, the health route for `features/health/routes.ts`. |
| `config/env.ts` | 61 | `config.ts` | Gains `loadConfig(env = process.env)` and `loadEnvFile()` (an explicit path to `server/.env`). 7 importers change. |
| `http/errors.ts` | 16 | `lib/http-error.ts` | `HttpError` and its helpers. No Fastify import. |
| `auth/cookie.ts`, `guards.ts`, `jwt.ts`, `password.ts`, `auth.test.ts` | 20, 49, 34, 11, 33 | `plugins/auth/` (same names) | Cross-cutting: every feature uses the guards. |
| `routes/auth.ts`, `services/authService.ts` | 42, 44 | `features/auth/routes.ts`, `service.ts` | |
| `routes/users.ts`, `dal/users.ts` | 61, 121 | `features/users/routes.ts`, `store.ts` | |
| `routes/departments.ts`, `dal/departments.ts` | 27, 64 | `features/departments/routes.ts`, `store.ts` | |
| `routes/events.ts`, `dal/events.ts`, `services/eventService.ts` | 87, 273, 121 | `features/events/routes.ts`, `store.ts`, `service.ts` | The three event-rating routes leave `routes/events.ts` (decision 1). `store.ts` stays whole (Q54). |
| `routes/ratings.ts`, `dal/ratings.ts` | 34, 61 | `features/ratings/routes.ts`, `store.ts` | Gains the three event-rating routes, same URLs. |
| `routes/notifications.ts`, `dal/notifications.ts` | 38, 82 | `features/notifications/routes.ts`, `store.ts` | |
| `integrations/email/index.ts` | 55 | `features/notifications/email.ts` | The invite mail. Takes the Fastify logger, so the two `console` calls go. |
| `routes/integrations.ts`, `integrations/weather/index.ts`, `weather.test.ts`, `integrations/maps/index.ts` | 18, 77, 26, 10 | `features/integrations/routes.ts`, `weather.ts`, `weather.test.ts`, `maps.ts` | |
| `dal/dal.test.ts` | 187 | `features/{users,departments,events,ratings,notifications}/store.test.ts` | Split by store, no assertion changes. |
| `routes/routes.test.ts` | 135 | `features/auth/routes.test.ts`, `features/events/routes.test.ts` | The auth cases and the ownership cases. |
| `test/helpers.ts` | 27 | `testing/helpers.ts` | Gains `buildTestApp()` (step 6). |
| `db/connection.ts`, `migrate.ts`, `util.ts`, `migrations/0001_init.sql` | 38, 60, 9, 70 | the same | `connection.ts` shrinks to `openDb(path)`. |
| `seed/seed.ts` | 140 | the same | A CLI (`npm run seed`). |
| (new) | | `plugins/errors.ts`, `plugins/client-static.ts`, `features/health/routes.ts`, one `index.ts` per feature | |

**Boundaries after the move** (only through a feature's `index.ts`): events use users, departments, notifications and ratings; ratings use events and users (`findSummaryById`, `findById`). To avoid a cycle, `features/ratings/` takes the two lookups as plain functions in its options, not an import of the events feature.

### Every reader of the environment

| Where | What | Afterwards |
|---|---|---|
| `config/env.ts:21` | `envSchema.parse(process.env)` | `loadConfig(env = process.env)` in `config.ts`, the one reader |
| `config/env.ts:1` | `import "dotenv/config"` | `loadEnvFile()`, with an explicit path |
| `config/env.ts:61` | `export type AppConfig` (knip: unused) | used by `buildApp` |
| `server/src/seed/seed.ts` | none: it uses the same module | `loadConfig()` |

No file reads `NODE_ENV` outside the config.

### Every route: 30, by feature

`GET /api/health` has no params, and `GET` routes have no body. Each route declares only its success status. A wrapper schema (`{ events }`, `{ user }`) is new in `shared/src/` because the client types the same shapes (Q55).

| Feature | Method and path | In | Response |
|---|---|---|---|
| health | `GET /api/health` | | `200`: new `healthSchema` |
| auth | `POST /api/auth/register` | `registerSchema` | `201`: `authResponseSchema` |
| | `POST /api/auth/login` | `loginSchema` | `200`: `authResponseSchema` |
| | `POST /api/auth/logout` | | `204` |
| | `GET /api/auth/me` | | `200`: `authResponseSchema` |
| users | `GET /api/users` | query: `listQuerySchema` | `200`: new `userListResponseSchema` |
| | `PATCH /api/users/me` | `updateProfileSchema` | `200`: `authResponseSchema` |
| | `PATCH /api/users/me/password` | `changePasswordSchema` | `204` |
| | `GET /api/users/:id` | params: `idParamsSchema` | `200`: `authResponseSchema` |
| | `PATCH /api/users/:id/department` | `idParamsSchema`, `assignDepartmentSchema` | `200`: `authResponseSchema` |
| departments | `GET /api/departments` | | `200`: new `departmentListResponseSchema` |
| | `POST /api/departments` | `createDepartmentSchema` | `201`: new `departmentResponseSchema` |
| | `DELETE /api/departments/:id` | `idParamsSchema` | `204` |
| events | `GET /api/events` | query: `eventQuerySchema` | `200`: new `eventListResponseSchema` |
| | `GET /api/events/:id` | `idParamsSchema` | `200`: new `eventResponseSchema` |
| | `POST /api/events` | `createEventSchema` | `201`: `eventResponseSchema` |
| | `PATCH /api/events/:id` | `idParamsSchema`, `updateEventSchema` | `200`: `eventResponseSchema` |
| | `DELETE /api/events/:id` | `idParamsSchema` | `204` |
| | `PUT /api/events/:id/rsvp` | `idParamsSchema`, `rsvpSchema` | `200`: `rsvpSchema` |
| ratings | `GET`, `PUT`, `DELETE /api/events/:id/rating` (3) | `idParamsSchema`, `setRatingSchema` on the `PUT` | `200`: `ratingResponseSchema` |
| | `GET`, `PUT`, `DELETE /api/users/:id/rating` (3) | the same | `200`: `ratingResponseSchema` |
| notifications | `GET /api/notifications` | | `200`: new `notificationListResponseSchema` |
| | `PATCH /api/notifications/:id` | `idParamsSchema`, `markNotificationSchema` | `204` |
| | `DELETE /api/notifications/:id` | `idParamsSchema` | `204` |
| integrations | `GET /api/weather` | query: `weatherQuerySchema` | `200`: `weatherSchema` |
| | `GET /api/maps/config` | | `200`: `mapsConfigSchema` |

`idParamsSchema` is `z.object({ id: idSchema })` and moves from five route files into `shared/src/common.ts`. A response schema strips fields it does not list, so a field a store returns that a schema omits disappears from the JSON; step 1 and step 8 catch that.

### The error plugin

`plugins/errors.ts`, wrapped in `fastify-plugin`, registered first. It **keeps the flat body** `{ error, message? }` (Q43: the repo's own shape). In order:

1. `HttpError` goes to its status and code.
2. `hasZodFastifySchemaValidationErrors(error)` goes to 400 `validation_error`, with the first issue's message, as today.
3. `isResponseSerializationError(error)` goes to 500 `internal_error`, logged with the method and URL, never shown to the client.
4. A 4xx that Fastify raised passes through with its status and its own message (400 `bad_request`, 404 `not_found`, 413 `payload_too_large`, 415 `unsupported_media_type`, 429 `rate_limited`, other 4xx `bad_request`). Today these are 500s.
5. Anything else goes to 500 `internal_error`, logged, with no detail.

The 404 handler is rate-limited (`@fastify/rate-limit` is present, so the skill's rule 8 applies). It lives in `plugins/client-static.ts` when a built client exists: that plugin registers `@fastify/static` and the SPA fallback, and leaves `/api` paths a JSON 404. Without a built client, `buildApp` sets the JSON 404 handler itself, so Fastify never sees two handlers.

### `server.ts`

1. `loadEnvFile()` and `loadConfig()`. A bad config prints to stderr and exits 1, before any logger exists.
2. `runMigrations()`.
3. `buildApp(config, { logger: true, server: { connectionTimeout: 10_000, requestTimeout: 30_000, trustProxy: config.trustProxy } })`. `TRUST_PROXY` is a new optional env key, default false: `@fastify/rate-limit` keys on `request.ip`, and a proxy would make every client one address.
4. `close-with-grace`, closing the app and then the database (`closeDb` stops being an unused export).
5. `listen({ host: "0.0.0.0", port })`.

No route runs long (the weather call is one `fetch`; the mail is `void`ed), so no timeout is raised.

## Decisions of 2026-11-10

1. **`server/src/features/<name>/`** (Q23), as in the move map.
2. **Typed plugin options, explicit registration** (Q24). `app.ts` imports each feature and registers it by name.
3. **A response schema on every route** (Q25). No route sends a stream or binary, so Q53's exemption is not used.
4. **One error handler, the repo's body** (Q43), passing Fastify's own 4xx through and never echoing a thrown message.
5. **`store.ts` stays whole** (Q54): `features/events/store.ts` is 273 lines, one file.
6. **A schema lives in `shared/` when the client imports it** (Q55). The wrapper response schemas are the client's types, so they go there.
7. **`HttpError` stays one class** (Q56), and no decorator is a test seam: tests pass dependencies as plugin options.
8. **vitest stays** (Q27).
9. **Validation before authorisation is accepted** (Q52). Routes behind `requireAuth` still check the session first, in `preHandler`, so this matters only for the two public routes.

## Owner decisions (defaults)

1. **Where the event-rating routes live.** Default: in `features/ratings/`, with the host-rating routes, at the same URLs. The alternative is to leave them in events and import the store across features.
2. **Singleton or factories.** Default: each store becomes `createXStore(db)`, built once in `buildApp` into a `FeatureContext { config, db, log }` and passed as plugin options, as the house does and as Q24 asks. It removes the 36 `getDb()` calls and `setDb()`, and tests build an isolated in-memory app. The alternative is to keep the singleton and record it as an exception in `scripts/conventions.json`.
3. **`TRUST_PROXY`.** Default: a new optional env key, false. It is unused until the app is deployed.
4. **Fastify 4xx passthrough.** Default as in the error plugin above: a behaviour fix, from 500 to the real 4xx, with a test per case. It changes what a client sees for a malformed body.

## Files you OWN

- `server/src/**`: the moves, the new plugins, the schemas wired in.
- `server/package.json` (scripts, the Fastify pin, the new dependencies pinned) and `package-lock.json`.
- `shared/src/**`, only to add `healthSchema`, `idParamsSchema` and the wrapper response schemas, with tests if the repo gains a shared test runner (it has none; the server tests cover them).
- `playwright/scripts/start-test-server.sh` and `playwright/README.md`: the entry name.
- `.dependency-cruiser.cjs` (new), `eslint.config.js` (the email `no-console` exception goes), `scripts/conventions.json`, `.claude/rules/server.md`.
- The root `package.json`: `check:conventions` gains dependency-cruiser and loses `check-structure`'s `--warn-only`.
- Corpus: [wiki/architecture.md](../../wiki/architecture.md) (the layers section and the layout), [wiki/api-contract.md](../../wiki/api-contract.md), [wiki/auth.md](../../wiki/auth.md), [wiki/decisions.md](../../wiki/decisions.md), [wiki/status.md](../../wiki/status.md), [log.md](../../log.md).

## Files you must NOT touch

- `client/`. A response schema that drops a field the client reads is a finding: fix the schema.
- `server/src/db/migrations/0001_init.sql`.
- Behaviour: routes, status codes and JSON, apart from the Fastify 4xx fix and fields the comparison shows were leaks.

## What to do

Follow `migrating-a-server.md`. One commit per step; after each, `npm run check` passes, and `npm run build` then `npm run start --workspace server` serves `GET /api/health`.

1. **Before.** Run `check-structure` strict and record its counts by rule. Seed a scratch database (`DATABASE_PATH` on a temp file, `npm run seed`) and save the JSON of every route above, signed in as a seed admin, with fixed query values ([../../../playwright/README.md](../../../playwright/README.md) has the bring-up). Include an event with attendees, ratings and a notification.
2. **Fastify.** Pin `fastify` to `5.12.8` in `server/package.json`. `npm run typecheck` and `npm test` pass.
3. **`config.ts` and the entry.** Rename `config/env.ts` to `config.ts` with `loadConfig` and `loadEnvFile`; update the 7 importers for now (they still import the module value, built once in `server.ts`'s caller until step 6). Rename `index.ts` to `server.ts` with `close-with-grace`, the timeouts and `trustProxy`; change `server/package.json`, `playwright/scripts/start-test-server.sh` and `playwright/README.md` in the same commit. Move the static and SPA code into `plugins/client-static.ts`. Add a test that the 404 handler answers JSON under `/api`.
4. **The error plugin**, `lib/http-error.ts` and the rate-limited 404. Add the Fastify 4xx tests: a malformed JSON body gives 400, an unsupported content type 415, a thrown plain `Error` gives 500 `internal_error` with no message.
5. **Feature folders.** Use `git mv`, file by file per the map, so history follows. Add each `index.ts`, split the two test files, add `.dependency-cruiser.cjs`, and check that a deliberate import of `features/events/store.js` from `features/ratings/` fails it.
6. **Factories and the context.** One store per commit: `createUsersStore(db)`, departments, events, ratings, notifications. `buildApp(config, deps)` builds the `FeatureContext`; the guards, the token and cookie code take `config`; the mailer takes the logger. Delete `getDb`, `setDb` and `resetData`; `testing/helpers.ts` gets `buildTestApp()` over an in-memory database. The 27 tests pass with only their setup lines changed. The seed builds its own database handle.
7. **The type provider and the schemas, one feature per commit:** health, departments, notifications, integrations, users, auth, ratings, events. Each commit declares params, query, body and the response; removes that feature's `.parse(request.…)`; types the plugin as `FastifyPluginAsyncZod<FeatureContext>`; and adds a test that a store row with an extra field is stripped from the reply. Add one test that a reply failing its response schema is a 500 `internal_error` with no detail.
8. **After.** Save the same JSON as step 1 and diff it. A field that disappeared is a leak (keep it dropped, list it) or a missing schema field (add it). Put the diff's summary in the `log.md` entry.
9. **Strict.** Drop `check-structure`'s `--warn-only`, make dependency-cruiser part of `check:conventions`, and delete the email adapter's `no-console` exception from `eslint.config.js`.
10. **Corpus.** Revisit [wiki/decisions.md](../../wiki/decisions.md)'s "Backend" and layering lines: the server no longer splits by layer, it is grouped by feature (the owner's call of 2026-11-09). Add the structure entry with what was rejected (the layer split, autoload) and why. Update the pages listed above and run `bash corpus/lint.sh` until it is clean.

## Acceptance

- [ ] `check-structure` passes strict, with any exception in `scripts/conventions.json` and its reason. Its counts before and after are in the outcome note.
- [ ] `grep -rnE "\.(safe)?[pP]arse\(request\." server/src` prints nothing, and every route in the table has a `schema` with a `response`.
- [ ] `grep -rn "process\.env" server/src --include=*.ts | grep -v "\.test\.ts"` prints only `config.ts`.
- [ ] `grep -rn "getDb\|setDb" server/src` prints nothing (or, if decision 2's alternative was taken, only the exception named in `conventions.json`).
- [ ] The 4xx tests, the stripped-field test, the serialization-500 test, the JSON 404 test and the health test pass, along with the 27 existing tests.
- [ ] The before and after JSON comparison is in `log.md`, with every dropped field named.
- [ ] `grep '"fastify"' server/package.json` prints `"5.12.8"`, and `npm run build` writes `server/dist/server.js`. After it, `npm run start --workspace server` answers `GET /api/health` and exits cleanly on SIGTERM.
- [ ] dependency-cruiser fails on a deliberate cross-feature import and passes clean.
- [ ] `npm run check` passes, and `bash corpus/lint.sh` ends clean.

## Interplay

- Update 2026-11-11: brief 15 already added `.dependency-cruiser.cjs` and put dependency-cruiser in `check:conventions`, with no findings. This brief keeps the rest: the cross-feature check on the new feature folders. The harness configs are `eslint.config.mjs`, `knip.config.js` and `prettier.config.mjs` (the root has no `"type": "module"`). The `n/no-process-env` allow-list for `server/src/config/env.ts` is a block in `eslint.config.mjs`; it goes when the module becomes `config.ts`.
- Brief 15's `no-console` exception for the email adapter ends here, and its `n/no-process-env` allow-list is `config.ts`.
- Brief 16 and this brief are independent in code. The client's `api/client.ts` reads `data.error` and `data.message`, which this brief keeps.
