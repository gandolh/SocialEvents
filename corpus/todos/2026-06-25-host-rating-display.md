---
title: Host rating control shows no current value
created: 2026-06-25
status: open
tags: [ui, ratings, audit]
---

# Host rating control shows no current value

In the event detail modal, the host star control always renders empty (value 0)
instead of the host's current aggregate average. Rating still persists correctly;
this is a display gap only.

## Context
Found in the TP-06 UI audit (finding F2) — see
[../test-plans/RESULTS.md](../test-plans/RESULTS.md). The component is
`client/src/components/EventDetailModal.tsx` (host row StarRating uses `value={0}`).
A `GET /api/users/:id/rating` call (hook `useHostRating` — to add) would supply the
aggregate + myRating, mirroring the event rating display.

## Acceptance
Host star control shows the host's current average (and the caller's own rating),
consistent with how event ratings are displayed.
