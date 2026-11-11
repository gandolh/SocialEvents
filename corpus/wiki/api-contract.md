---
summary: The REST endpoints under /api, who may call each one, and what they return
updated: 2026-11-11
---

# API contract

REST, base `/api`, JSON, Zod-validated (shared schemas). Auth via cookie. Standard
status codes. Full table: [sources/SPEC.md](../sources/SPEC.md) §5. Authorization rules:
[auth.md](auth.md).

## Auth
- `POST /api/auth/register` (public) → set cookie, return user; welcome email
- `POST /api/auth/login` (public) → set cookie, return user
- `POST /api/auth/logout` (user) → clear cookie
- `GET  /api/auth/me` (user) → current user

## Users
- `GET /api/users` (user; `?departmentId=` filter) — no password hashes
- `GET /api/users/:id` (user) — public profile
- `PATCH /api/users/me` (user) — name / job_title
- `PATCH /api/users/me/password` (user) — requires current password
- `PATCH /api/users/:id/department` (admin)

## Departments
- `GET /api/departments` (user)
- `POST /api/departments` (admin)
- `DELETE /api/departments/:id` (admin) — members → NULL

## Events
- `GET /api/events` (user; `?from=&to=&category=&hostId=&attendeeId=`)
- `GET /api/events/:id` (user) — host, attendees, aggregate rating
- `POST /api/events` (user) — body may include `attendeeUserIds[]` +
  `attendeeDepartmentIds[]`; server expands depts → unique user set; emails + notifs.
  Duplicate guard (same host+name+time+location) → 409.
- `PATCH /api/events/:id` (host or admin)
- `DELETE /api/events/:id` (host or admin)

## Ratings
- `GET/PUT/DELETE /api/events/:id/rating` (user) — caller's event rating + aggregate
- `GET/PUT/DELETE /api/users/:id/rating` (user) — caller's host rating + aggregate

## Notifications
- `GET /api/notifications` (user)
- `PATCH /api/notifications/:id` (owner) — mark read
- `DELETE /api/notifications/:id` (owner)

## Integrations (server-proxied)
- `GET /api/weather?lat=&lng=` (user) — 24h cache; mock if no key
- `GET /api/maps/config` (user) — maps enabled? + public config

See [integrations.md](integrations.md).

## Errors
One flat body, `{ error, message? }` (`shared/src/common.ts`). Every route declares params, query, body and a response schema; a reply that does not match its schema is a 500 `internal_error` (logged, never shown).
- `400 validation_error` — the request failed its route schema (the first issue's message). A missing body reads "received null".
- `400 bad_request`, `413 payload_too_large`, `415 unsupported_media_type`, `429 rate_limited` — Fastify's and its plugins' own 4xx keep their status (before brief 17 they were 500s).
- `401 unauthorized`, `403 forbidden`, `404 not_found`, `409 conflict` — from the guards and `HttpError`.
- `404 not_found` for a path no route answers (rate-limited: 60 a minute); with a built client present, a non-`/api` path gets `index.html`.
- `500 internal_error` — anything else, with no detail. Validation runs before a route's own checks, so a malformed body on a route that also looks something up is a 400 before it is a 404 or 403.

The event-rating routes (`/api/events/:id/rating`) live in the ratings feature beside the host-rating routes (`/api/users/:id/rating`); the URLs did not change.
