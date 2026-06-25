# SocialEvents — Product & Architecture Specification (Rebuild)

> **Status:** Authoritative spec for a ground-up rebuild.
> **Audience:** the developer (candid, technical).
> **Process:** This document → visual design (Stitch) → wipe the existing code → rebuild from scratch, autonomously, on the stack below.
> **Visual design is deliberately deferred** to the Stitch phase. This document defines *what* and *how it works*, plus UX/IA recommendations to feed Stitch — not the final look.

---

## 1. Goal & Product Overview

**SocialEvents** is an internal company tool for planning and managing social events.

People at a company are grouped into **departments**. Any logged-in user can **create an event** (name, date/time, location on a map, category, description) and **invite attendees** — either whole departments or individual people. Invitees receive an **email invite**. Events appear on a **calendar** (month/day/list), on a **map**, and show **live weather** at the event's location. Users can **rate events** and **rate hosts** (1–5 stars). **Admins** manage departments and assign users to them.

It is an internal, trusted-but-authenticated app — not a public consumer product. Optimize for clarity, correctness, and low operational overhead (single small SQLite-backed deployment).

### Primary user stories
- As a user, I register/login with email + password.
- As a user, I create an event and invite individuals and/or whole departments.
- As an invitee, I receive an email and see the event on my calendar.
- As a user, I browse events by month/day or as a searchable, sortable, filterable list.
- As a user, I view an event's location on a map and the current weather there.
- As a user, I rate an event and rate the host.
- As an admin, I create/delete departments and assign users to departments.
- As a host, I edit or delete my own events.

---

## 2. Tech Stack (locked)

### Frontend
- **React + Vite + TypeScript**
- **Tailwind CSS** for styling
- **TanStack Query** (server state / data fetching & caching) + **TanStack Router** (routing)
- Forms + validation: **Zod** schemas (shared with backend), light form handling (react-hook-form optional; not mandated)

### Backend
- **Fastify** (Node, TypeScript)
- **Zod** request/response validation on every route
- REST API with correct HTTP verbs and status codes (the old app used POST for reads — **do not** repeat that)

### Database & data layer
- **SQLite** via **`better-sqlite3`** (synchronous, fast, zero external service)
- **Hand-written Data Access Layer (DAL). No ORM.** Plain parameterized SQL in repository modules.
- **Migrations:** plain `.sql` files in `server/db/migrations/`, applied by a small hand-written migration runner that tracks applied migrations in a `schema_migrations` table.

### Auth (self-made — no auth library for the core flow)
- Email/password only (no Google/OAuth).
- Passwords hashed with **bcrypt**.
- **Self-signed JWT** (HMAC-SHA256) stored in an **httpOnly, SameSite=Lax, Secure cookie**.
- Authorization enforced server-side on every protected route (see §6).

### Tooling / quality
- **Vitest** for unit tests on core logic (DAL, auth, authorization rules).
- ESLint + TypeScript strict mode.
- Single monorepo with workspaces.

---

## 3. Repository Structure (monorepo)

```
SocialEvents/
├─ package.json            # workspaces root
├─ docs/
│  └─ SPEC.md              # this file
├─ shared/                 # TS types + Zod schemas shared by client & server
│  ├─ src/
│  │  ├─ schemas/          # zod schemas (auth, event, user, dept, rating, ...)
│  │  └─ types/            # inferred types + API contract types
│  └─ package.json
├─ server/
│  ├─ src/
│  │  ├─ app.ts            # Fastify instance + plugin registration
│  │  ├─ index.ts          # server bootstrap
│  │  ├─ config/           # env loading & validation (zod)
│  │  ├─ db/
│  │  │  ├─ connection.ts  # better-sqlite3 singleton
│  │  │  ├─ migrate.ts     # migration runner
│  │  │  └─ migrations/    # 0001_init.sql, 0002_*.sql, ...
│  │  ├─ dal/              # repositories: users, departments, events,
│  │  │                    #   attendees, ratings, notifications, sessions
│  │  ├─ auth/             # hashing, jwt sign/verify, cookie helpers, guards
│  │  ├─ routes/           # fastify route modules (REST)
│  │  ├─ services/         # business logic (event creation, invites, ratings)
│  │  ├─ integrations/     # maps, weather, email — each with real + mock impl
│  │  └─ seed/             # dev seed data
│  └─ package.json
└─ client/
   ├─ src/
   │  ├─ main.tsx
   │  ├─ router.tsx        # TanStack Router
   │  ├─ api/              # typed fetch client + TanStack Query hooks
   │  ├─ routes/           # route components (login, calendar, map, admin, ...)
   │  ├─ components/       # UI components (built from Stitch design)
   │  ├─ lib/              # date utils, formatting, auth context
   │  └─ styles/
   └─ package.json
```

**`shared/` is the single source of truth for the API contract.** Both client and server import its Zod schemas/types. If a request/response shape changes, it changes in one place.

---

## 4. Data Model

Relational, normalized, with real foreign keys. (The old app used free-text `host` and loosely-typed `attendees` blobs — **replaced** with proper relations.)

> SQLite types are dynamic; the columns below use SQLite affinities. Timestamps stored as **ISO-8601 TEXT (UTC)**. Booleans as `INTEGER 0/1`. IDs are `TEXT` UUIDs (generated app-side) for stable, non-guessable identifiers.

### `users`
| column | type | notes |
|---|---|---|
| id | TEXT PK | uuid |
| name | TEXT NOT NULL | |
| email | TEXT NOT NULL UNIQUE | login identifier, case-insensitive (store lowercased) |
| password_hash | TEXT NOT NULL | bcrypt |
| role | TEXT NOT NULL DEFAULT 'user' | `'user'` \| `'admin'` |
| department_id | TEXT NULL | FK → departments.id, ON DELETE SET NULL |
| job_title | TEXT NULL | (old app's `role` free-text field) |
| created_at | TEXT NOT NULL | |

- Users with no department are treated as the implicit **"Guest"** group (department_id NULL). Guest is not a real department row; it's the NULL state. (Old app had a literal "Guest" dept — we model it as the absence of a department to avoid a magic row.)

### `departments`
| column | type | notes |
|---|---|---|
| id | TEXT PK | uuid |
| name | TEXT NOT NULL UNIQUE | |
| created_at | TEXT NOT NULL | |

### `events`
| column | type | notes |
|---|---|---|
| id | TEXT PK | uuid |
| name | TEXT NOT NULL | |
| host_id | TEXT NOT NULL | FK → users.id, ON DELETE CASCADE |
| starts_at | TEXT NOT NULL | ISO-8601 UTC |
| description | TEXT NOT NULL DEFAULT '' | |
| category | TEXT NOT NULL DEFAULT 'Other' | see categories below |
| location_label | TEXT NOT NULL | human-readable place name |
| location_lat | REAL NULL | |
| location_lng | REAL NULL | |
| created_at | TEXT NOT NULL | |

- **Categories** (seeded constant, shared): `Game night`, `Holiday`, `Team building`, `Other`. Each has an associated color used in calendar/filtering (color is a UI concern; the canonical list lives in `shared/`).

### `event_attendees` (join)
| column | type | notes |
|---|---|---|
| event_id | TEXT | FK → events.id, ON DELETE CASCADE |
| user_id | TEXT | FK → users.id, ON DELETE CASCADE |
| status | TEXT NOT NULL DEFAULT 'invited' | `'invited'` \| `'accepted'` \| `'declined'` |
| PRIMARY KEY (event_id, user_id) | | |

### `event_ratings`
| column | type | notes |
|---|---|---|
| event_id | TEXT | FK → events.id, ON DELETE CASCADE |
| user_id | TEXT | FK → users.id (the rater), ON DELETE CASCADE |
| rating | INTEGER NOT NULL | 1–5 |
| updated_at | TEXT NOT NULL | |
| PRIMARY KEY (event_id, user_id) | | one rating per user per event, upsert-able |

### `host_ratings`
| column | type | notes |
|---|---|---|
| host_id | TEXT | FK → users.id (the rated host), ON DELETE CASCADE |
| user_id | TEXT | FK → users.id (the rater), ON DELETE CASCADE |
| rating | INTEGER NOT NULL | 1–5 |
| updated_at | TEXT NOT NULL | |
| PRIMARY KEY (host_id, user_id) | | |

> Rationale for two rating tables: events and hosts are different entities. Old app crammed both into a generic `ratings(ratingID, ratings[])` document keyed by either an event id or a host string — we split for integrity and queryability. Aggregate (avg + count) computed on read.

### `notifications`
| column | type | notes |
|---|---|---|
| id | TEXT PK | uuid |
| user_id | TEXT NOT NULL | FK → users.id, ON DELETE CASCADE (recipient) |
| message | TEXT NOT NULL | |
| read | INTEGER NOT NULL DEFAULT 0 | |
| created_at | TEXT NOT NULL | |

> Old app stored notifications by email and had unimplemented update/delete handlers. We model per-user with a read flag, mark-as-read, and delete.

### `sessions` (optional, see Auth note)
JWT is self-contained, so a session table is **not required** for the chosen approach. We include an optional `sessions` table only if we later add server-side revocation. **v1: not used.** (Documented so the DAL leaves room for it.)

### Indexes
- `users(email)` unique (login lookups)
- `events(starts_at)` (calendar range queries)
- `events(host_id)`
- `event_attendees(user_id)` (a user's events)
- `event_ratings(event_id)`, `host_ratings(host_id)` (aggregates)

---

## 5. API Contract (REST)

Base path: `/api`. All bodies JSON. All protected routes require a valid auth cookie. Validation via shared Zod schemas. Standard status codes (`200/201/204/400/401/403/404/409/500`).

### Auth
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create account → sets cookie, returns user. Sends welcome email. |
| POST | `/api/auth/login` | public | Verify credentials → sets cookie, returns user. |
| POST | `/api/auth/logout` | user | Clears cookie. |
| GET | `/api/auth/me` | user | Current user from cookie. |

### Users
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/users` | user | List users (no password hashes). |
| GET | `/api/users/:id` | user | One user (public profile fields). |
| GET | `/api/users?departmentId=` | user | Users in a department. |
| PATCH | `/api/users/me` | user | Update own name / job_title. |
| PATCH | `/api/users/me/password` | user | Change password (requires current password). |
| PATCH | `/api/users/:id/department` | admin | Assign/unassign a user's department. |

### Departments
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/departments` | user | List departments. |
| POST | `/api/departments` | admin | Create. |
| DELETE | `/api/departments/:id` | admin | Delete (members fall back to Guest/NULL). |

### Events
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/events` | user | List; supports `?from=&to=&category=&hostId=&attendeeId=` filters. |
| GET | `/api/events/:id` | user | One event, with host, attendees, aggregate rating. |
| POST | `/api/events` | user | Create; body may include `attendeeUserIds[]` and `attendeeDepartmentIds[]` (expanded server-side to a unique user set). Sends email invites. |
| PATCH | `/api/events/:id` | host or admin | Update. |
| DELETE | `/api/events/:id` | host or admin | Delete. |

### Ratings
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/events/:id/rating` | user | Aggregate + caller's own rating. |
| PUT | `/api/events/:id/rating` | user | Upsert caller's rating (1–5). |
| DELETE | `/api/events/:id/rating` | user | Remove caller's rating. |
| GET | `/api/users/:id/rating` | user | Host aggregate + caller's own. |
| PUT | `/api/users/:id/rating` | user | Upsert host rating. |
| DELETE | `/api/users/:id/rating` | user | Remove host rating. |

### Notifications
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/notifications` | user | Caller's notifications. |
| PATCH | `/api/notifications/:id` | owner | Mark read. |
| DELETE | `/api/notifications/:id` | owner | Delete. |

### Integrations (server-proxied; keys stay server-side)
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/weather?lat=&lng=` | user | Current weather; **24h server cache**; **mock** if no key. |
| GET | `/api/maps/config` | user | Returns whether Maps is enabled + (public) map config; client falls back to a static/mock map if disabled. |

> **Note on Maps:** Google Maps JS needs a browser key. Expose enablement via `/api/maps/config`; the browser key may be provided at build/runtime as a public env var. If absent, the client renders a non-interactive fallback (coordinates + static placeholder) instead of the live map.

---

## 6. Auth & Authorization (self-made)

### Authentication
1. **Register/Login:** verify/create user, bcrypt the password.
2. **Token:** sign a JWT (HS256) with claims `{ sub: userId, role, name, email, iat, exp }`. `exp` = 7 days (internal app; long-lived single token, no refresh in v1 — documented as a future addition).
3. **Cookie:** set as `httpOnly; SameSite=Lax; Secure (prod); Path=/`. Name e.g. `se_session`.
4. **Verification:** Fastify `preHandler` decodes+verifies the cookie on protected routes, attaches `request.user`.
5. **Secret:** `JWT_SECRET` from env, required in prod; dev fallback generates an ephemeral secret with a startup warning.

### Authorization (enforced server-side — the old backend had **none**)
- **`requireAuth`** guard: rejects 401 if no/invalid token.
- **`requireAdmin`** guard: 403 unless `role === 'admin'`.
- **Host-or-admin ownership** check for `PATCH/DELETE /events/:id`: load event, allow if `event.host_id === request.user.sub` or admin; else 403.
- **Self-only** for `/users/me*` and notification owner checks.
- Never trust client-supplied user identity; always derive the acting user from the verified token.

### Security baseline (autonomous build must include)
- All SQL **parameterized** (no string interpolation) — SQLite + better-sqlite3 prepared statements.
- Zod validation rejects malformed/oversized input before it reaches the DAL.
- bcrypt cost ≥ 10.
- Generic auth error messages (don't reveal whether email exists on login).
- CORS: same-origin in prod (client served by/with the API or behind one origin); permissive only in dev with explicit origin.
- Rate-limit auth endpoints (`@fastify/rate-limit`).
- Security headers (`@fastify/helmet`).
- No secrets in the client bundle except intentionally-public ones (e.g. Maps browser key).

---

## 7. Features (functional spec)

### 7.1 Accounts
- Register (name, email, password), login, logout, "me".
- Edit own profile (name, job title). Change password (verify current).
- A user belongs to 0 or 1 department.

### 7.2 Departments (admin)
- Create / delete departments. List departments and their members.
- Assign users to a department; remove a user (→ Guest/NULL).
- Admin panel mirrors the old two-pane layout: departments list (left) + members of selected dept with user search (right), plus "add users" and "create department" flows. Deleting a department asks for confirmation.

### 7.3 Events
- Create event: name, date/time, location (map picker → label + lat/lng), category, description, attendees.
- **Attendee selection:** pick individual users and/or whole departments; server expands departments to their members and de-duplicates. Host is implicitly the creator.
- On create: persist, create `event_attendees` rows (status `invited`), create in-app notifications for invitees, and send **email invites** (real or mock).
- Edit/delete event: host or admin only.
- Duplicate guard: reject creating an identical event (same host+name+time+location) with 409 (preserves old behavior, now scoped to host).

### 7.4 Calendar & browsing
- **Month view** (grid; events as colored chips by category).
- **Day view** (hour-scrolled schedule for a single day).
- **List view** ("all events"): searchable, sortable (by date/name), filterable by category and by mine/invited.
- Category filter checkboxes (colors per category) shared across views.
- (Old "year view" dropped as low-value — see §10.)

### 7.5 Map
- Single-event map (marker at event location).
- All-events map (markers for all upcoming events; label = event name).
- Map location **picker** in the event creator.
- If Maps key absent → graceful non-interactive fallback.

### 7.6 Weather
- On an event detail, show current weather at the event's coordinates (icon + description).
- Server-side fetch, **24h cache** keyed by rounded lat/lng. Mock data if no key.

### 7.7 Ratings
- Event rating: 1–5 stars, one per user, upsert/remove; show aggregate (avg + count).
- Host rating: 1–5 stars on a user (as a host), one per rater, upsert/remove; show aggregate.

### 7.8 Notifications
- In-app notification list for the current user (e.g. "You were invited to X").
- Mark read / delete. Unread indicator in the shell.

### 7.9 Email
- Welcome email on register; invite emails on event creation.
- Real transport via SMTP (Nodemailer) when configured; otherwise **mock** (log to console / capture in dev), so the app is fully functional without SMTP. **English copy** (old emails were Romanian).

---

## 8. Integrations — optional keys, mock fallback

All three integrations follow the **same pattern**: an interface with a **real** implementation (used when the relevant env key/config is present) and a **mock** implementation (used otherwise), selected at startup. The app must run and be demoable with **zero keys configured**.

| Integration | Key/env | Real | Mock |
|---|---|---|---|
| Weather | `WEATHER_API_KEY` | fetch provider, 24h cache | deterministic fake current weather |
| Maps | `MAPS_BROWSER_KEY` (public) | Google Maps JS | static/non-interactive placeholder + coords |
| Email | `SMTP_*` | Nodemailer SMTP | console/dev-capture transport |

Startup logs clearly state which mode each integration is in.

---

## 9. Non-Functional Requirements

- **TypeScript strict** everywhere; shared types prevent client/server drift.
- **Tests (Vitest):** DAL repositories (CRUD + constraints), password hashing, JWT sign/verify, authorization guards (admin, host-ownership, self-only), department→attendee expansion, rating upsert/aggregate, weather cache behavior. Pragmatic coverage where bugs hurt, not 100%.
- **Migrations** are forward-only `.sql` files; runner is idempotent and runs on boot (dev) / via script (prod).
- **Seed script** creates: an admin, a few departments, sample users per department, and a handful of events across categories — so the app is non-empty on first run.
- **Config** validated with Zod at startup; fail fast on missing *required* prod vars (`JWT_SECRET`), warn on optional ones.
- **Single-origin deploy** target: server can serve the built client, or both sit behind one origin (keeps cookies same-site simple). SQLite file is the only persistent state; document backup = copy the file.
- **Accessibility & responsiveness** are expected in the design phase (keyboard nav, labels, contrast); flagged here so Stitch output is held to it.

---

## 10. Deliberate Changes vs. the Old App

| Area | Old | New | Why |
|---|---|---|---|
| Backend | Express, POST-for-reads | Fastify, proper REST verbs | correctness, conventions |
| DB | Two Mongo connections (backend `IBM` + NextAuth adapter) | one SQLite file | drastically simpler ops |
| Data layer | Mongoose models, loose `Array`/`Object` fields | hand-written DAL, normalized SQL, FKs | integrity, queryability |
| host/attendees | free-text string / loose objects | FKs + join table | real relations |
| Ratings | one generic `ratings` collection keyed by event id or host string | two typed tables (event/host) | integrity |
| Auth | NextAuth (credentials + Google) + hand-hashing split across services | self-made JWT-in-httpOnly-cookie, email/password only | single, owned, simple flow |
| Authorization | **none** (any caller hit any route) | guards on every protected route + host ownership | security |
| Notifications | by email, update/delete unimplemented | per-user, read flag, full CRUD | completeness |
| Integrations | hard dependency on keys | optional keys + mock fallback | runs anywhere, easy dev |
| Copy | mixed Romanian/English | English only | consistency |
| Calendar | day + year + list | month + day + list | month is the expected view; year was low value |
| Guest dept | magic "Guest" row | NULL department | no magic data |

---

## 11. UX / IA Recommendations (input for Stitch — not final design)

> These are starting recommendations to brief the design tool. Treat as defaults to react to, not constraints.

**App shell**
- Persistent left **sidebar**: avatar/account menu, category filter checkboxes, mini-calendar for quick date navigation. Main area = current calendar/list/map view. (Mirrors the old layout, which worked.)
- Top of main area: a **view switcher** (Month / Day / List / Map) + the displayed date range + a prominent **"Create event"** button.

**Key screens**
1. **Login / Register** — single focused card; minimal chrome. Clear error states.
2. **Calendar (Month)** — default landing after login. Days with events show colored category chips; clicking a day → day view; clicking an event → event detail modal.
3. **Day view** — vertical hour grid; events placed by time; tap to open detail.
4. **All events (List)** — table/cards with search box, sort control, category filter, and a mine/invited toggle.
5. **Map** — all-events markers; selecting a marker peeks the event.
6. **Event detail (modal)** — name + event rating at top; date, weather, host (+ host rating), description, category, attendees (chips), location with "view on map". Host/admin see edit/delete.
7. **Create/Edit event (modal or page)** — name, datetime picker, **map location picker**, category picker, description, attendee selector (tabs: individuals | departments).
8. **Admin panel (modal)** — two-pane departments/members manager with user search, add-users, create-dept, delete-dept-with-confirm.
9. **Profile / Settings** — edit name/job title, change password, theme switch.

**Cross-cutting**
- Notifications: bell with unread count → dropdown list (mark read / dismiss).
- Confirmation dialog for destructive actions (delete event, delete department).
- Empty states for: no events this month, no notifications, no users in department.
- Theme switch (light/dark) preserved as a nicety.
- Loading/skeleton states for data-fetching views (TanStack Query gives status flags — use them).

**Tone:** clean, functional, slightly playful is fine (old app had personality). Final visual language comes from Stitch.

---

## 12. Build Plan (post-design, autonomous)

When the Stitch design is in hand:

1. **Wipe & scaffold:** delete `frontend/` and `backend/`; scaffold the monorepo (§3). Old code remains in git history.
2. **Shared:** define Zod schemas + types (the API contract) first.
3. **Server foundations:** Fastify app, config (Zod), SQLite connection, migration runner + `0001_init.sql` (full schema §4), DAL repositories with tests.
4. **Auth:** hashing, JWT, cookie, guards (§6) with tests.
5. **Routes/services:** implement the API contract (§5) feature by feature: auth → users/departments → events+attendees → ratings → notifications → integrations (real+mock).
6. **Seed script.**
7. **Client:** Vite + Tailwind + TanStack Router/Query scaffold; typed API client; implement screens per Stitch design (§11), wiring to the API.
8. **Integrations on the client:** map picker/views with fallback; weather display; notification bell.
9. **Tests green, lint clean, seed-and-run smoke check.**
10. **Docs:** update root `README.md` (run, env, architecture).

**Definition of done for the rebuild:** app runs with zero keys (mocks active), full auth+authorization enforced, all features in §7 working against the new data model, core-logic tests passing.

---

## 13. Open Items / Future (explicitly out of v1 scope)
- Refresh tokens / server-side session revocation (table stubbed, unused).
- Google/OAuth login (dropped for v1).
- Attendee RSVP UI (status column exists; surfacing accept/decline in UI is optional).
- i18n (English-only v1; copy kept in one place to ease later extraction).
- Year-at-a-glance calendar view (dropped).
