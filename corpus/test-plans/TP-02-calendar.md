# TP-02 — Calendar

Run setup & fixtures: [../../playwright/README.md](../../playwright/README.md).

## Goal
Verify the month grid and day agenda views and their navigation.

## Cases
1. **Month grid renders** — `/calendar` shows a 7-column, 6-row grid with weekday
   headers (SUN…SAT) and the current month + year as a heading.
2. **Today highlight** — the current date cell shows a filled primary-blue circle.
3. **Out-of-month days** — leading/trailing days are dimmed.
4. **Event chips** — page forward to **July 2026**; events appear as
   category-colored pill chips on their day (e.g. Weekly Board Games on Jul 2).
5. **Month navigation** — prev/next arrows change the month heading and reload
   events for the range.
6. **Chip → detail** — clicking an event chip opens the event detail modal.
7. **Day view** — `/calendar/day` shows a single day's events sorted by time with
   a date heading; prev/next day arrows work; empty day shows an empty state.
8. **View switcher** — top-bar Month/Day/List/Map switch routes and the active
   tab is underlined.

## Pass criteria
Grid layout matches the Stitch month design; navigation and chip→detail work.
