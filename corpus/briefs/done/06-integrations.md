# Task 06 — Integrations (real + mock)

## Files you OWN
server/src/integrations/{email,weather,maps}/*

## What to do
Each integration: real impl when key present, mock otherwise; chosen at startup;
mode logged. Weather 24h in-memory cache by rounded coords. Email via Nodemailer
(jsonTransport mock). Maps config endpoint (client owns browser key).

## Acceptance
App runs with zero keys; weather/email mocks active; weather cache tested.

---
## Outcome (2026-06-25)
Shipped. weatherMode/emailMode report mock with no keys; deterministic mock
weather + cache tested; mock email logs to console. Startup logs integration modes.
