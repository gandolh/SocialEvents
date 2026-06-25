# Test run results

Plans: [index.md](index.md). Setup: [../../playwright/README.md](../../playwright/README.md).
Screenshots from this run are in `playwright/screenshots/` (gitignored).

## Run — 2026-06-25 (MCP-driven, seeded server on :3009)

| Plan | Result | Notes |
|---|---|---|
| TP-01 Authentication | **PASS** | Login (valid/invalid), generic error, gating, admin nav visibility all correct. |
| TP-02 Calendar | **PASS** | Month grid, today highlight, dimmed out-of-month days, prev/next, day view + empty state. |
| TP-03 Events | **PASS** | Directory, search, **create round-trip** (event persisted + attendee + invitee notification), detail. |
| TP-04 Ratings & weather | **PASS** | Purple star ratings (seeded 4.5/2), mock weather "(mock)" line. (Verified earlier + via detail modal.) |
| TP-05 Admin | **PASS** | Two-pane manager: departments list, member add/remove, unassigned flag, create/delete dept. |
| TP-06 UI/UX audit | **PASS w/ findings** | Design fidelity strong; see findings below. |

### Evidence (selected)
- `TP-01-invalid-login.png` — generic auth error.
- `TP-03-search.png`, `TP-03-create-modal.png`, `TP-03-after-create.png` — search + create flow.
- `TP-05-admin.png` — admin two-pane manager.
- `TP-06-empty-day.png` — day empty state.
- `TP-06-mobile-calendar.png` — mobile viewport (see finding F1).
- Create round-trip also confirmed via API: event "QA Test Mixer" (host Ada,
  1 attendee Dana) created; Dana received the invite notification.

## Findings

### F1 — No responsive layout (medium)
At ~600px the 280px sidebar stays fixed and the top-bar avatar is clipped off the
right edge. DESIGN.md specifies sidebars → bottom sheets (mobile) / icon rails
(tablet). The app is currently **desktop-only**. → filed as
[todo](../todos/2026-06-25-responsive-layout.md).

### F2 — Host rating control shows no current value (low)
In the event detail modal, the host star control always renders empty (value 0)
rather than the host's current aggregate; rating still persists. Cosmetic/data
display gap. → filed as [todo](../todos/2026-06-25-host-rating-display.md).

### F3 — Dark mode not implemented (low / known)
Tokens + strategy exist in DESIGN.md but no dark theme is wired. Tracked in
[status.md](../wiki/status.md) "possible next work".

## Verdict
All functional flows pass end-to-end against the live API. UI matches the Stitch
design on desktop. The notable gap is responsive behavior (F1).
