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
Tokens + strategy existed in the Stitch DESIGN.md but no dark theme was wired.
Now superseded by the Aero theme direction (see run 2 below).

## Verdict (run 1)
All functional flows pass end-to-end against the live API. UI matches the Stitch
design on desktop. The notable gap is responsive behavior (F1).

---

## Run 2 — 2026-06-25 (post-fixes + Aero theme)

Re-audited after briefs 11 (host rating), 12 (responsive), 13 (Aero theme).

| Check | Result | Evidence |
|---|---|---|
| F1 responsive — resolved | **PASS** | At 390px: hamburger + glass drawer, top bar fits, no clipped avatar, cards stack. `TP-06-mobile-events.png`, `TP-06-mobile-drawer.png`. |
| F2 host rating — resolved | **PASS** | Host row shows "Alex Engineer ★★★★★ 5.0 (1)". `TP-04-host-rating.png`. |
| Aero theme (brief 13) | **PASS** | Glass + gloss + blue-glow across login, shell, cards, modals, buttons. `TP-06-aero-login.png`, `TP-06-aero-events.png`. |
| Functional flows | **PASS** | Re-confirmed login → directory → detail; 27/27 unit tests still green. |

### New finding
- **F4 — content-area contrast (low).** With the Aero transparent main area, the
  "Event Directory" heading and some card text sit on the medium-blue desktop
  background; legible but contrast is modest. Consider a faint glass backing panel
  behind page headers, or darkening text. Not filed as a blocking todo; noted here.

## Verdict (run 2)
F1 and F2 resolved; Aero theme applied cleanly with no functional regressions.
One minor contrast nit (F4) noted for future polish.

---

## Run 3 — 2026-06-25 (screenshot-based UI audit, full current Aero set)

Refreshed all stale (pre-Aero) screenshots, then audited the complete current set
against the Aero design intent. Screenshots in `playwright/screenshots/`
(gitignored): login, invalid-login, calendar-month, create-modal, host-rating
(detail), admin, empty-day, aero-events, mobile-events, mobile-drawer.

### Strengths
- Aero identity is coherent across login, shell, modals, cards, admin, create form
  (glass + glossy blue + glow + desktop gradient).
- Login, invalid-login, create-modal, and event-detail are the strongest: opaque
  glass + white input fields → crisp, legible text.
- Responsive (mobile) and host-rating display confirmed good (carried from run 2).

### Findings — all stem from one root cause: the transparent content area sits
directly on the saturated mid-blue desktop gradient.

- **F4a — Calendar grid blue-on-blue (medium).** Month grid cells are translucent
  over the blue background; the calendar looks washed out and structure is hard to
  read. `TP-02-calendar-month.png`. Most prominent issue.
- **F4b — "Other"-category chips invisible (medium).** Neutral-tint chips (e.g.
  "New Hire Welcome") render as dark text with no visible chip background on the
  blue calendar; colored chips (purple/green) survive. `TP-02-calendar-month.png`.
- **F4c — Headings/body low contrast (low–med).** Page headings ("Event
  Directory", "Departments"), admin rows, and the empty-day message are dark text
  on mid-blue — legible but under a comfortable contrast bar.
  `TP-06-aero-events.png`, `TP-05-admin.png`, `TP-06-empty-day.png`.
- **F5 — Event cards over-translucent (low).** Blue bleeds through directory cards,
  muting text. `TP-06-aero-events.png`.

### Recommended fix (single, contained)
Give the **main content area a light glass backing** (or raise card/grid/cell
opacity and give the "Other" chip a real light background). Putting content on a
lighter surface rather than directly on the gradient resolves F4a–c and F5 at once.
Filed as todo [2026-06-25-aero-content-contrast](../todos/2026-06-25-aero-content-contrast.md).

## Verdict (run 3)
Aero theme is coherent and functional; the dominant issue is contrast where
content sits on the desktop gradient (calendar grid + neutral chips worst). One
contained CSS fix (light content surface) addresses the whole cluster.

---

## Run 4 — 2026-06-25 (post contrast fix, brief 14)

Re-audited calendar, events directory, and admin after the content-surface fix.

| Finding | Result | Evidence |
|---|---|---|
| F4a calendar grid blue-on-blue | **RESOLVED** | Grid now on a white surface inside a light glass content panel; cells + numbers crisp. `TP-02-calendar-month.png`. |
| F4b "Other" chip invisible | **RESOLVED** | Chips use solid light tints; "New Hire Welcome" shows a visible white pill. `TP-02-calendar-month.png`, `TP-06-aero-events.png`. |
| F4c headings/body low contrast | **RESOLVED** | Content sits on `bg-white/55` glass panel; headings/rows high-contrast. `TP-06-aero-events.png`, `TP-05-admin.png`. |
| F5 cards over-translucent | **RESOLVED** | Cards crisp on the lighter panel. `TP-06-aero-events.png`. |

Change: `<main>` wrapped in a light glass panel; calendar grid given a white
surface; `categoryChipClasses` switched to solid light tints. Aero glass aesthetic
preserved (translucency + desktop gradient still frame the panel). tsc+build clean;
27/27 tests green.

## Verdict (run 4)
All run-3 contrast findings resolved with one contained change; no functional or
aesthetic regression. UI is clean and legible across all audited screens.
