---
summary: How the client, server and shared contract fit together, and how a request flows through them
updated: 2026-11-11
---

# Architecture

## Monorepo (npm workspaces)
```
SocialEvents/
├─ package.json          # workspaces root: client, server, shared
├─ shared/               # API contract: zod schemas + inferred TS types
├─ server/               # Fastify + better-sqlite3 + hand-written SQL stores, one folder per feature
├─ client/               # React + Vite + Tailwind + TanStack Query/Router
├─ corpus/               # wiki + work tracker + sources/ + test-plans/
├─ playwright/           # UI testing hub (screenshots gitignored)
```

`shared/` is the **single source of truth for the API contract**. Both client and
server import its Zod schemas; request/response shapes change in one place.

## Structure & dependency direction
```
client  ─uses→  shared  ←uses─  server
                              server/src: server.ts → app.ts → plugins/ + features/<name>/ → db
```
- **client** never imports from `server`; only from `shared` + its own code.
- **server** is grouped by feature, not by layer (the owner's call of 2026-11-09, built in brief 17):
  - `server.ts` is the process: settings, `buildApp`, `close-with-grace`, `listen`. Nothing else listens.
  - `config.ts` is the one reader of the environment (`loadConfig`, `loadEnvFile`).
  - `app.ts` builds the app: the zod type provider, the error plugin first, external plugins, then each feature
    registered by name with the parts of one context object (stores, mailer, weather, auth) as its plugin options.
  - `features/<name>/` (`auth`, `users`, `departments`, `events`, `ratings`, `notifications`, `integrations`, `health`)
    holds `routes.ts` (schemas on every route, thin handlers), `store.ts` (parameterised SQL behind
    `createXStore(db)`), `service.ts` where there is business logic (auth, events) and an `index.ts`, the only file
    another feature or `app.ts` imports. dependency-cruiser fails an import around an index.
  - `plugins/` holds what every feature uses: `errors.ts`, `auth/` (tokens, cookie, guards, passwords) and
    `client-static.ts` (the built client and its SPA fallback).
  - `lib/http-error.ts` is `HttpError`, with no Fastify import. `db/` opens the SQLite file and runs the migrations.
- **Dependencies are passed, never imported as singletons:** there is no module-level database handle. A test builds
  its own app over an in-memory database (`buildTestApp()` in `testing/helpers.ts`).
- **integrations** (weather, mail) sit in the feature that uses them (`integrations/weather.ts`,
  `notifications/email.ts`); each has a real and a mock implementation, selected at start by env presence. See
  [integrations.md](integrations.md).

## Data flow (request)
1. Client calls typed fetch wrapper → TanStack Query hook.
2. Fastify route: a `preValidation` guard verifies the auth cookie (→ `request.user`), so a signed-out request is a
   401 before anything is validated; then zod validates params, query and body from the route's own schema.
3. Handler → store (prepared statements) → SQLite; features with business rules go through a service first
   (authorization beyond role, e.g. host ownership; invite fan-out).
4. The reply is encoded with the route's response schema, so a field the schema does not list never leaves the server.

## Persistence
Single **SQLite file** (better-sqlite3, synchronous). Schema created by
forward-only `.sql` migrations in `server/src/db/migrations/`, applied by a small
hand-written runner tracked in a `schema_migrations` table. No ORM — see
[decisions.md](decisions.md). Backup = copy the file.

## Auth transport
Self-signed JWT (HS256) in an httpOnly + SameSite=Lax + Secure cookie. Same-origin
deploy keeps cookies simple (server can serve the built client). See [auth.md](auth.md).

## Deploy target
Single origin: Fastify serves the built client (or both behind one origin). Only
persistent state is the SQLite file.
