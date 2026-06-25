# Architecture

## Monorepo (npm workspaces)
```
SocialEvents/
├─ package.json          # workspaces root: client, server, shared
├─ shared/               # API contract: zod schemas + inferred TS types
├─ server/               # Fastify + better-sqlite3 + hand-written DAL
├─ client/               # React + Vite + Tailwind + TanStack Query/Router
├─ corpus/  docs/
```

`shared/` is the **single source of truth for the API contract**. Both client and
server import its Zod schemas; request/response shapes change in one place.

## Layers & dependency direction
```
client  ─uses→  shared  ←uses─  server
                              server: routes → services → dal → sqlite
```
- **client** never imports from `server`; only from `shared` + its own code.
- **server** layers, outer→inner: `routes` (HTTP, validation, guards) →
  `services` (business logic: event creation, invite fan-out, rating aggregation)
  → `dal` (parameterized SQL repositories) → `db` (better-sqlite3 connection).
- **integrations** (maps/weather/email) sit beside services; each has a real impl
  + a mock impl, selected at startup by env presence. See [integrations.md](integrations.md).

## Data flow (request)
1. Client calls typed fetch wrapper → TanStack Query hook.
2. Fastify route: `preHandler` guard verifies auth cookie (→ `request.user`),
   Zod validates body/params/query.
3. Route → service (business rules, authorization beyond role, e.g. host
   ownership) → DAL (prepared statements) → SQLite.
4. Response validated/shaped per shared schema; client cache updated.

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
