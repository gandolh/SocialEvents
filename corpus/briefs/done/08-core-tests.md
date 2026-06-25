# Task 08 — Vitest core-logic tests

## Files you OWN
server/vitest.config.ts, server/src/test/helpers.ts, *.test.ts

## What to do
In-memory DB harness. Cover DAL CRUD + constraints (cascade/set-null, dup guard,
RSVP), auth (hash, JWT), ratings aggregation/upsert, dept→attendee expansion,
HTTP guards (401/403/409/400, ownership), weather cache.

## Acceptance
`npm test` green.

---
## Outcome (2026-06-25)
Shipped. 4 files, 27 tests, all green.
