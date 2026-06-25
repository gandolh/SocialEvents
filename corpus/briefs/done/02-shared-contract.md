# Task 02 — Shared API contract

## Files you OWN
shared/src/* (common, categories, auth, user, department, event, rating,
notification, integrations, index).

## What to do
Zod schemas + inferred TS types for every request/response in the API contract.
Categories constant with color slugs. Schemas must run in both Node and browser
(no Node built-ins).

## Acceptance
shared builds (tsc -b); schemas verified at runtime (Zod v4 forms work).

---
## Outcome (2026-06-25)
Shipped. All entity + auth + integration schemas; EVENT_CATEGORIES with color
slugs; RSVP schema added. Zod v4 chained forms (.uuid/.email/.datetime) verified
working at runtime. Built clean.
