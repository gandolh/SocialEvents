---
title: Clear the runtime dependency advisories
created: 2026-11-11
status: open
tags: [security, dependencies]
---

# Clear the runtime dependency advisories

`npm audit --omit=dev` on 2026-11-11 (after brief 17) lists high advisories in runtime packages that were already there before the brief: `@fastify/static` 9.1.3 (≤ 10.1.8: an authorization bypass through non-canonical paths, and a route-guard bypass through path traversal), `zod` 4.4.3 (< 4.6.6: memory exhaustion on oversized constrained collections), `nodemailer` (≤ 10.1.3), `seroval` (≤ 1.6.7), plus `brace-expansion`, `glob`, `minimatch` and the estate-wide moderate `fast-uri`. SocialEvents isn't deployed, so nothing is exposed today; anything that deploys it must clear these first.

## What to do

- Pin `zod` 4.6.7 in `server/` and `shared/` (the estate's version; satchel's move from 4.5.4 kept all 169 captured replies byte-identical).
- Move `@fastify/static` to the first major past 10.1.8 that supports Fastify 5, and read its changelog for the options the static-client plugin uses.
- `nodemailer` and `seroval`: the patched versions, with the changelog read for breaking changes.
- Before and after, capture the API's replies with the brief 17 method and compare; `npm run check`; `npm audit --omit=dev` lists only what has no fix.
