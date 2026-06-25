# Task 05 — API routes & services

## Files you OWN
server/src/routes/*, server/src/services/*, server/src/http/errors.ts,
server/src/app.ts, server/src/index.ts

## What to do
REST routes per api-contract.md (auth, users, departments, events+rsvp+ratings,
host ratings, notifications, integrations). Services for auth + events (dept→
attendee expansion, invites, notifications, duplicate guard). Central error
handler (Zod 400, HttpError, 429, 500). Single-origin static client serving.

## Acceptance
Full inject smoke (register→login→event→rate→weather) + route tests green.

---
## Outcome (2026-06-25)
Shipped. End-to-end inject smoke passes; 12 HTTP/route tests green. RSVP toggle
included (resolved open-question toward shipping it). Host excluded from own
event's attendees.
