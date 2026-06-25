# Overview

**SocialEvents** is an internal company tool for planning and managing social
events. People belong to **departments**; any logged-in user can **create an
event** (name, date/time, map location, category, description) and **invite**
individuals and/or whole departments. Invitees get an **email invite** and an
in-app **notification**. Events appear on a **calendar** (month/day/list), on a
**map**, and show **live weather** at the location. Users can **rate events** and
**rate hosts** (1–5 stars). **Admins** manage departments and assign users.

It's an internal, authenticated app — not a public product. Optimize for clarity,
correctness, and low ops overhead (single SQLite file).

## Lineage
This is a **ground-up rebuild** of an older Next.js + Express + (two) MongoDB app.
The old code is being wiped; only `corpus/` and `docs/` survive. See
[docs/SPEC.md](../../docs/SPEC.md) §10 for the full old-vs-new diff.

## Cast (top-level)
- `client/` — React + Vite SPA (the UI)
- `server/` — Fastify API + SQLite + hand-written data access layer
- `shared/` — Zod schemas + TS types shared as the API contract
- `corpus/` — this wiki + work tracker
- `docs/` — SPEC.md + Stitch design output

See [architecture.md](architecture.md) for how it fits together,
[decisions.md](decisions.md) for the locked stack.
