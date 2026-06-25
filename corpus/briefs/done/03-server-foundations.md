# Task 03 — Server foundations

## Context
Fastify + SQLite + hand-written DAL, no ORM. See architecture.md, data-model.md.

## Files you OWN
server/src/config, server/src/db (connection, migrate, migrations, util),
server/src/dal/*

## What to do
Config (zod env + ephemeral dev JWT secret), better-sqlite3 connection (WAL, FKs,
:memory: support), migration runner (schema_migrations), 0001_init.sql (full
schema + indexes + FK cascade/set-null), DAL repos (users, departments, events,
ratings, notifications) with parameterized SQL.

## Acceptance
Migrations create all 8 tables; DAL typechecks; smoke insert/query works.

---
## Outcome (2026-06-25)
Shipped. All 8 tables created via 0001_init.sql; FK ON DELETE SET NULL (dept) and
CASCADE (event children) verified by tests. DAL typechecks; in-memory smoke +
27-test suite green. Added `dotenv@17.4.2` for .env loading (recorded in decisions).
