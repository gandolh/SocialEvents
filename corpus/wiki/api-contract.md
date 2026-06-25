# API contract

REST, base `/api`, JSON, Zod-validated (shared schemas). Auth via cookie. Standard
status codes. Full table: [docs/SPEC.md](../../docs/SPEC.md) §5. Authorization rules:
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
