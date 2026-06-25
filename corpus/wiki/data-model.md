# Data model

Normalized SQLite with real FKs. IDs are app-generated UUID `TEXT`. Timestamps are
ISO-8601 UTC `TEXT`. Booleans are `INTEGER 0/1`. Full rationale: [sources/SPEC.md](../sources/SPEC.md) §4.

## Tables
- **users** — `id, name, email (unique, lowercased), password_hash, role
  ('user'|'admin'), department_id (FK→departments, SET NULL), job_title, created_at`.
  No department ⇒ `department_id NULL` = the implicit "Guest" group (no magic row).
- **departments** — `id, name (unique), created_at`.
- **events** — `id, name, host_id (FK→users, CASCADE), starts_at, description
  (default ''), category (default 'Other'), location_label, location_lat,
  location_lng, created_at`. (Cover image: see [open-questions.md](open-questions.md).)
- **event_attendees** (join) — `event_id, user_id, status
  ('invited'|'accepted'|'declined' default 'invited')`, PK `(event_id, user_id)`.
- **event_ratings** — `event_id, user_id (rater), rating 1–5, updated_at`,
  PK `(event_id, user_id)` (one per user, upsert).
- **host_ratings** — `host_id (rated), user_id (rater), rating 1–5, updated_at`,
  PK `(host_id, user_id)`.
- **notifications** — `id, user_id (recipient, FK CASCADE), message, read (0/1),
  created_at`.
- **sessions** — *stubbed, unused in v1* (JWT is self-contained; room for future
  server-side revocation).

## Categories
Seeded constant in `shared/`: `Game night`, `Holiday`, `Team building`, `Other`.
Each has a color (UI concern; canonical list lives in `shared/`). Colors map to the
design palette — see [design-system.md](design-system.md).

## Indexes
`users(email)` unique · `events(starts_at)` · `events(host_id)` ·
`event_attendees(user_id)` · `event_ratings(event_id)` · `host_ratings(host_id)`.

## Aggregates
Event/host rating averages + counts computed on read (no denormalized column).
