# Decisions (locked)

Settled choices. Don't relitigate without an explicit revisit + a `log.md` note.

## Stack
- **Monorepo**, npm workspaces: `client` / `server` / `shared`. `shared` = API contract.
- **Frontend:** React + Vite + TypeScript + Tailwind + TanStack Query + TanStack Router.
- **Backend:** Fastify (TypeScript).
- **DB:** SQLite via `better-sqlite3`. **Hand-written DAL, NO ORM.** Parameterized SQL only.
- **Migrations:** forward-only `.sql` files + tiny hand-written runner (`schema_migrations` table).
- **Validation:** Zod everywhere, schemas shared via `shared/`.
- **Auth:** self-made. bcrypt + self-signed JWT (HS256) in httpOnly+SameSite=Lax+Secure cookie. Email/password only (no OAuth/Google). See [auth.md](auth.md).
- **Authorization:** roles `user`/`admin` + host-or-admin ownership on event mutate. Enforced server-side on every protected route.
- **Tests:** Vitest on core logic (DAL, auth, guards, dept→attendee expansion, rating aggregation, weather cache).
- **TS strict** everywhere. ESLint.
- **API style:** REST, proper verbs/status codes (old app's POST-for-reads is banned).
- **Integrations:** optional keys; **mock fallback** when key absent — app runs with zero keys. See [integrations.md](integrations.md).
- **Copy:** English only.
- **Data model:** normalized, real FKs (no free-text host / loose attendee blobs). See [data-model.md](data-model.md).
- **Greenfield:** no data migration from the old Mongo app. Seed instead.

## Package versions — PINNED (exact, no `^`/`~`)
Verified latest stable & mutually compatible on **2026-06-25**. Use these exact
versions in every `package.json`. When bumping, bump deliberately and update here.

### Root / tooling
| package | version |
|---|---|
| typescript | 6.0.3 |
| vitest | 4.1.9 |
| tsx | 4.22.4 |

### shared
| package | version |
|---|---|
| zod | 4.4.3 |

### server
| package | version |
|---|---|
| fastify | 5.8.5 |
| @fastify/cookie | 11.0.2 |
| @fastify/cors | 11.2.0 |
| @fastify/helmet | 13.0.2 |
| @fastify/rate-limit | 11.0.0 |
| @fastify/static | 9.1.3 |
| better-sqlite3 | 12.11.1 |
| bcrypt | 6.0.0 |
| jsonwebtoken | 9.0.3 |
| nodemailer | 9.0.1 |
| zod | 4.4.3 |
| @types/node | 26.0.1 |
| @types/better-sqlite3 | 7.6.13 |
| @types/bcrypt | 6.0.0 |
| @types/jsonwebtoken | 9.0.10 |
| @types/nodemailer | 8.0.1 |

### client
| package | version |
|---|---|
| react | 19.2.7 |
| react-dom | 19.2.7 |
| vite | 8.1.0 |
| @vitejs/plugin-react | 6.0.3 |
| tailwindcss | 4.3.1 |
| @tailwindcss/vite | 4.3.1 |
| @tanstack/react-query | 5.101.1 |
| @tanstack/react-router | 1.170.16 |
| react-icons | 5.6.0 |
| @fontsource/geist-sans | 5.2.5 |
| @types/react | 19.2.17 |
| @types/react-dom | 19.2.3 |
| zod | 4.4.3 |

## Notable version implications (load-bearing)
- **Tailwind v4** is CSS-first: configure via `@import "tailwindcss"` + `@theme`
  in CSS using the `@tailwindcss/vite` plugin. **No `tailwind.config.js`** by
  default. Design tokens (see [design-system.md](design-system.md)) go in the
  `@theme` block, not a JS config.
- **React 19** — no `React.FC` ceremony needed; new JSX transform; refs as props.
- **TanStack Router v1** — file-based or code-based routes; we use code-based in
  `client/src/router.tsx`.
- **Zod v4** — import from `zod` (v4 is the default export now). Shared schemas
  must work in both Node (server) and browser (client) — keep them runtime-only,
  no Node built-ins.
- **bcrypt v6** is native (node-gyp). If native build is a problem in the target
  env, `bcryptjs` is the documented fallback (revisit + log if switched).
- **better-sqlite3 v12** — synchronous; matches the no-ORM, prepared-statement DAL.

## Maps key note
Google Maps JS needs a **browser** key (public). It's the one intentionally-public
key, exposed to the client via Vite env (`VITE_MAPS_BROWSER_KEY`). All other keys
stay server-side. Absent → non-interactive fallback. See [integrations.md](integrations.md).
