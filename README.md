# SocialEvents

Internal company social-events planner. Departments, events with attendees,
calendar/map/list views, ratings, notifications, weather, email invites.

A ground-up rebuild. The project's knowledge & work tracking live in
[`corpus/`](corpus/index.md); the product spec is [`docs/SPEC.md`](docs/SPEC.md);
the visual design is in [`docs/stitch_design/`](docs/stitch_design/).

## Stack
- **client** — React 19 + Vite 8 + TypeScript + Tailwind v4 + TanStack Query/Router
- **server** — Fastify 5 + better-sqlite3 (hand-written DAL, no ORM) + self-made JWT auth
- **shared** — Zod schemas + TS types = the API contract
- npm workspaces monorepo. All dependency versions are **pinned** (see
  [corpus/wiki/decisions.md](corpus/wiki/decisions.md)).

## Quick start
```bash
npm install
cp server/.env.example server/.env      # optional; runs with mocks if blank
cp client/.env.example client/.env      # optional

npm run build:shared                     # build the shared contract first
npm run migrate                          # create the SQLite schema
npm run seed                             # sample data (admin + users + events)

npm run dev:server                       # Fastify on :3001
npm run dev:client                       # Vite on :5173 (proxies /api → :3001)
```

The app runs with **zero API keys** — weather, maps, and email fall back to mock
implementations. Provide keys in `.env` to enable the real ones.

## Scripts (root)
- `npm run typecheck` — `tsc -b` across all workspaces
- `npm test` — Vitest (server core logic)
- `npm run build` — build shared + server + client
- `npm run migrate` / `npm run seed`

## Layout
```
shared/  server/  client/   # the app (npm workspaces)
corpus/                      # LLM-maintained wiki + work tracker
docs/                        # SPEC.md + Stitch design
```
