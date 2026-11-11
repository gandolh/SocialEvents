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
- `server/src/config/env.ts` is the one reader of the environment. Add no other `process.env` read.
- A thrown `HttpError` is how a route answers with a status; a 500 never echoes a thrown message.
- `npm run check:conventions` runs `check-structure` over these folders, `--warn-only` until brief 17.
- Brief 17 adds the structure lines here.
- Read the `house-style` skill for the rest of the rules and why each exists.
