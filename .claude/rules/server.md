---
paths:
  - "server/src/**"
  - "shared/src/**"
---

# The API (`server/src`, `shared/src`)

- Read [corpus/wiki/architecture.md](../../corpus/wiki/architecture.md),
  [corpus/wiki/data-model.md](../../corpus/wiki/data-model.md) and [corpus/wiki/auth.md](../../corpus/wiki/auth.md)
  before you change a route, a table or a guard.
- SQL stays parameterised and hand-written (better-sqlite3 prepared statements); there is no ORM.
- A schema the client imports lives in `shared/`, and `shared` is built before the server or client sees a change.
- `server/src/config.ts` is the one reader of the environment. Add no other `process.env` read.
- A thrown `HttpError` is how a route answers with a status; a 500 never echoes a thrown message.
- The server is grouped by feature: `server/src/features/<name>/` holds `routes.ts`, `store.ts`, an optional
  `service.ts` and an `index.ts`. Another feature, and `app.ts`, import a feature through its `index.ts` only
  (dependency-cruiser fails anything else). `plugins/` is cross-cutting, `lib/` has no Fastify import.
- `server.ts` listens and nothing else does; `app.ts` builds the app and hands each feature what it needs as typed
  plugin options (stores, mailer, weather, auth). No module-level database handle: a store is `createXStore(db)`.
- Every route declares its params, query and body, and a `response` schema, through the zod type provider
  (`FastifyPluginAsyncZod`). A handler never parses `request.body`, `.query` or `.params` itself.
- Session guards are `preValidation` hooks, so a signed-out request is a 401 before it can be a 400.
- Tests build their own app: `buildTestApp()` in `server/src/testing/helpers.ts`, over an in-memory database.
- `npm run check:conventions` runs `check-structure` strict. An accepted finding goes in `scripts/conventions.json`
  with its reason.
