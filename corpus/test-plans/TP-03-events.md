# TP-03 — Events

Run setup & fixtures: [../../playwright/README.md](../../playwright/README.md).

## Goal
Verify the event directory, detail modal, creation, RSVP, and deletion.

## Cases
1. **Directory renders** — `/events` shows event cards with category chip, title,
   date/time, location, host avatar+name, and attendee count.
2. **Search** — typing in the search box filters by name/location.
3. **Category filter** — selecting a category narrows the list.
4. **Scope toggle** — "Hosted by me" shows only events the current user hosts.
5. **Sort** — switching Date/Name reorders the cards.
6. **Card → detail** — clicking a card opens the detail modal with all fields.
7. **Create event** — "Create Event" opens the modal; fill name/date/location/
   category, invite individuals and/or a department, submit; the event appears in
   the directory and invitees get a notification.
8. **Duplicate guard** — creating an identical event (same host+name+time+
   location) is rejected with a 409-driven error message.
9. **RSVP** — as an invited (non-host) user, the detail modal shows Join / Can't
   make it; choosing updates attendee status (✓/✗).
10. **Delete (host/admin)** — the host or an admin sees Delete event; it removes
    the event. A non-host/non-admin does NOT see delete.

## Pass criteria
Directory matches the Stitch "Event Directory"; create/RSVP/delete round-trip
through the API and reflect in the UI.
