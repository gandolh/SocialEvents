# Task 11 — Host rating display

## Context
From the TP-06 audit (finding F2) and todo
[2026-06-25-host-rating-display](../../todos/2026-06-25-host-rating-display.md).
The event detail modal's host star control renders `value={0}` — it never shows
the host's current aggregate. The API already supports it
(`GET /api/users/:id/rating` → `{ aggregate, myRating }`).

## Files you OWN
- `client/src/api/hooks.ts` (add `useHostRating`)
- `client/src/components/EventDetailModal.tsx` (wire the host StarRating)

## Files you must NOT touch
- server (the endpoint exists and is tested)

## What to do
1. Add a `useHostRating(hostId)` query hook mirroring how event ratings are read,
   keyed `["host-rating", hostId]`, hitting `GET /users/:id/rating`.
2. Make `useSetHostRating` invalidate `["host-rating", hostId]` on success so the
   display updates after rating.
3. In EventDetailModal, read the host rating and pass its `aggregate.average` +
   `count` to the host StarRating (consistent with the event rating display).

## Acceptance
Host star control shows the host's current average + count, and updates after the
caller rates. Typecheck + build clean.
