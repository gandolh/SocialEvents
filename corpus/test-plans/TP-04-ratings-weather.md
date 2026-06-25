# TP-04 — Ratings & weather

Run setup & fixtures: [../../playwright/README.md](../../playwright/README.md).

## Goal
Verify event and host star ratings and the (mock) weather display.

## Cases
1. **Event rating displays** — open *Weekly Board Games* (seeded with 2 ratings);
   the header shows purple stars with an average (e.g. 4.5) and count (2).
2. **Rate an event** — click a star; the average/count updates after the mutation.
3. **Host rating** — the host row has its own star control; rating it persists.
4. **Star color** — active stars use the Game-night purple (brand cue), not yellow.
5. **Weather (mock)** — an event with coordinates shows a weather line ending in
   "(mock)" when no key is configured.
6. **No coordinates** — an event without lat/lng shows "—" for weather, no error.

## Pass criteria
Ratings round-trip and aggregate correctly; weather shows mock data gracefully.
