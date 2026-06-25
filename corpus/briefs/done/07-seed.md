# Task 07 — Seed script

## Files you OWN
server/src/seed/seed.ts

## What to do
Idempotent seed: 3 departments, 5 users (1 admin), 4 events across categories,
some ratings + notifications. Skip if users already exist.

## Acceptance
`npm run seed` populates a fresh DB and prints login credentials.

---
## Outcome (2026-06-25)
Shipped. Creates 3 depts, 5 users, 4 events; prints credentials (password123).
Skips if users exist.
