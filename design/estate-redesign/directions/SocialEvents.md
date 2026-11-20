# SocialEvents: two directions

Written 2026-11-12 by the art director. Repo: SocialEvents, brief 18. Both directions keep the recorded decisions: the Windows 7 **Aero** skin in both themes (decisions.md, "Visual theme"; brief 18 default 1), English only, Light / Dark / System with light on a first visit (the picker stays in the profile dialog), the four categories and their hues, the Base UI wrappers, and the token names in `client/src/styles/index.css` (`surface*`, `on-surface*`, `outline*`, `primary`, `cat-*`, `chip-*`, `glass-*`, `gloss-*`, `desktop-*`, `focus-ring`). Brief 18 forbids changes to `server/`, `shared/`, routes and behaviour, so both skeletons use only fields the client already has.

**Aero, kept in both:** the blue desktop as the ground, glass bars with a light top edge, the glossy blue primary button, the soft blue focus glow (now with a 2 px ring inside it), the night-blue dark theme with smoked glass. **What both change in it:** glass only where nothing is read through it (bars); text sits on near-opaque surfaces (research §4, NN/g on glass [S44]). Gloss stops are deepened so the white label passes 4.5:1 at the lightest stop (today's mid `#2a87e0` is 3.72). That is a tuning of Aero, not a reopen.

**Faces and accent.** The Aero blue is today's, so the registry allows it: `#1a66b9` light (today `#1d6fc7`, deepened for contrast; both hue 211°) / `#6db3ff` dark. It sits 2° from comercial-website's Voroneț azure `#1a5f9e` (209°) and 4° from atrium's `#2b5185` (215°); all three are today's. Aero's gradient gloss and the blue desktop are what tell SocialEvents apart. A sets Geist, today's recorded face; B sets Lexend and Figtree. None of these three appears in the registry or in any directions file (checked against the losing options too: Manrope, Castoro, Onest, Red Hat Mono, Inter, IBM Plex, Source Code Pro).

**Category colours keep their hues; the values are tuned.** Brief 18's acceptance deletes the `KNOWN_LIGHT` floors (team-building text on its tint is 4.44 today). This is not a reopen.

## 1. Today's strengths (keep all of them)

1. **One primary action, always in reach on desktop.** `Create Event` is the only glossy button, at the top of the sidebar.
2. **Visible islands.** The sidebar and the top bar are glass bands with their own edge, and the content sits on a raised panel over the blue desktop. It reads in dark too (smoked navy over night blue, with a light edge).
3. **Category chips you read without reading.** Each event is a pill in its category's tint, with a same-hue edge and text. Game night is purple, Holiday orange-red, Team building green, and Other a white pill with a grey edge.
4. **The month reads as a calendar.** A big `November 2026` with ‹ › on the right, the weekday row in its own band, today's date in a filled blue disc, and other months' days muted.
5. **The views are always on screen as words.** `Month` `Day` `List` `Map` sit in the top bar at both widths, with the bell and the avatar on the right.
6. **Dark is its own palette,** not an inversion: a night desktop, smoked glass, lighter category hues.

**What today gets wrong (both directions fix it):**
- **Geist never loads.** `index.css` asks for `"Geist"`, but fontsource registers `'Geist Sans'`, so the shots render the system fallback (DejaVu on Linux).
- **On `/`, nothing is marked current.** Neither `Calendar` nor `Month` lights up, because the code tests for `/calendar`.
- **A card inside a card** (Floor 11). The bordered month box sits inside the glass panel.
- **Tracked capitals** in `SUN`…`SAT` (Floor 9).
- **Names are cut off.** `Board Game …` and `Winter Lights …` at 1280; one letter (`A…`) at 390.
- **Create is hidden on the phone.** It is reachable only through the drawer.
- **The sidebar is mostly empty.** Its three links repeat the top bar's views.
- **The fold.** At 1280×800 today shows five week rows and a sliver of the sixth; at 390, about 5.5 rows of unreadable chips.

## 2. The main screen

The month calendar with its shell, route `/` (clock frozen at Thu 12 Nov 2026 10:00, signed in as the seed's engineer, a `user`, so no Admin). Today's shots are in `board/shots/SocialEvents/`: `light-1280-calendar.png` and `light-390-calendar.png` (dark: `dark-1280-calendar.png`, `dark-390-calendar.png`). The Stitch design calls this screen the primary shell reference.

## 3. The content fixture (shared by both directions)

- **Shell, from the shot.** Wordmark `SocialEvents`, tagline `Internal Coordination`, `Create Event` with a plus icon. Places: `Calendar`, `All Events`, `Map`, plus `Admin` for admins only (not drawn). Views: `Month` `Day` `List` `Map`. Icon buttons: `Notifications` (bell; no count, as today) and `Account` (disc `AE`). At 390, also `Open menu`. `Calendar` and `Month` are drawn as current (a fix: today lights neither).
- **Month head.** `November 2026`, then `Previous month` / `Next month` (icon-only, with those names). Weekday heads become `Sun` `Mon` `Tue` `Wed` `Thu` `Fri` `Sat` (Floor 9; today `SUN`…).
- **Grid.** Six rows as today: 1–7, 8–14, 15–21, 22–28, then 29 30 with Dec 1–5, then Dec 6–12. December's days are muted. 12 is today.
- **The seven November events.** Times are local; `*` marks a time or place no shot shows (from the capture's seed, UTC+2). In the grid each name appears whole.

| Day | Name | Category | Time | Location | Host |
|---|---|---|---|---|---|
| Thu 5 | Autumn Lunch | Team building | 1:30 PM | Roof terrace | Ada Admin |
| Thu 12 | Pub Quiz Night | Game night | 8:30 PM | The Corner Tap | Ada Admin |
| Tue 17 | Book Swap | Other | 2:15 PM | Kitchen | Ada Admin |
| Thu 19 | Board Game Afternoon | Game night | 3:00 PM | Meeting room 3 | Ada Admin |
| Tue 24 | Planning Offsite | Team building | 11:00 AM | Lakeside hall | Ada Admin |
| Thu 26 | Winter Lights Walk | Holiday | 7:00 PM* | Main square* | Ada Admin |
| Mon 30 | Holiday Party | Holiday | 9:00 PM* | The Grand Room* | Ada Admin |

- **Counts.** Each event shows `4 attending`, the list's own string. All four people are only `invited` in the seed, so keep the string exactly as shot and build no meaning on it (see the note in §6).
- **Pub Quiz Night's detail,** from the dialog shot: `Teams of four, one answer sheet per table.`; attendees `Alex Engineer`, `Dana Designer`, `Max Marketer`, `Sam Guest`; host rating `4.0 (1)`; actions `Join` and `Can't make it`.
- **Text rule.** No ellipsis anywhere. Names wrap between words. Each direction's 390 answer is in its section.
- **New copy (flag it on the board):** A's `Categories`, the 390 list head `In November`, B's `Today, 8:30 PM` and `Host` (the dialog's own label), and the three state strings below.
- **States for the Direction sheet:**
  - loading: a static grid skeleton, no shimmer;
  - empty month: `No events in November.` plus `Create Event`;
  - error: `Couldn't load events.` plus `Try again`.

## 4. Directions

**Palette by role** (light / dark; app token in brackets). Pre-checked with WCAG 2; sketchers re-run `contrast.mjs`.

| Role | A light | A dark | B light | B dark |
|---|---|---|---|---|
| ground (`background`, flat as `Shell.tsx` paints it) | `#5b8bbf` | `#0b1730` | `#5b8bbf` | `#0b1730` |
| bar, glass, composited (`glass-from` / `glass-to`) | `#dbe8f6` | `#1b2f4d` | `#dbe8f6` | `#1b2f4d` |
| surface (`glass-card`) | `#f5f9fd` | `#1d3150` | `#ffffff` | `#1f3456` |
| surface-sunk (`surface-container-high`, the weekday band today) | `#e6eef8` | `#152640` | `#e9f1fa` | `#162844` |
| ink / muted / faint | `#0b2942` / `#3c5871` / `#546d87` | `#e4eefa` / `#a9bed4` / `#8ba0b9` | as A | as A |
| line / line-strong (`outline-variant` / `outline`) | `#c9dbee` / `#4f7397` | `#33507a` / `#5d86b3` | as A | as A |
| accent / on-accent (`primary`) | `#1a66b9` / `#ffffff` | `#6db3ff` / `#04223f` | as A | as A |
| gloss top / mid / bottom | `#2f78c6` / `#1a66b9` / `#124f96` | `#86c1ff` / `#5aa6f2` / `#4a98e8` | as A | as A |
| focus ring / halo (two-tone, research 2.7) | `#0b2942` / `#ffffff` | `#6db3ff` / `#0b1730` | as A | as A |
| chip text on tint: Game night / Holiday / Team building / Other | `#5a2cc4` on `#ece3ff`; `#9c3410` on `#ffe4d9`; `#14663e` on `#d9f1e4`; `#3c5871` on `#ffffff` | `#c9b3ff` on `#2c2350`; `#ffa587` on `#40241a`; `#6ad9a3` on `#173729`; `#c3d3e3` on `#26406a` | as A | as A |

- **Pre-checked pairs** (light / dark):
  - surface on ground: A 3.37 / 1.36, B 3.57 / 1.43; bar on ground 2.87 / 1.32;
  - sunk against surface: A 1.11 / 1.16, B 1.14 / 1.18;
  - ink on surface 14.1 / 11.1; muted on bar 5.97 / 7.05;
  - faint on sunk: A 4.59 / 5.66, B 4.71 / 5.51;
  - accent on bar: 4.63 / 6.12;
  - on-accent at the worst gloss stop under the label (lightest in light, darkest in dark): 4.54 / 5.32;
  - focus ring on ground 4.18, halo on ground 3.57, ring on halo 14.9 / ring on ground 8.09, on surface 5.94;
  - line-strong on bar: 3.99 / 3.54;
  - chip text on its tint: 6.56, 5.96, 5.88, 7.43 / 7.77, 7.40, 7.47, 6.79.
- **The bar is a gradient composite.** Glass alpha stays at or above 0.85 over the ground, so no point of the bar is darker than `#dbe8f6` (light) or lighter than `#1b2f4d` (dark). Today's sidebar foot composites near `#bacee4`, where accent text falls to 3.58; re-check accent and muted at the bar's darkest point.
- **Selected fills.** A selected fill barely shows on the bar (`#e3eefb` on `#dbe8f6` is 1.06), so a selected nav item is a white pill with a `line-strong` edge, accent text at 600 and `aria-current`. Never a tint alone.
- **Chips.** Tints sit 1.12–1.24:1 from the light surfaces and 1.00–1.26:1 from the dark ones (Team building on dark A is 1.00; Other on B's white is 1.00). So every chip carries a 1 px edge in its own text colour (`cat-*`, ≥ 4.5:1 on the surface); Other's edge is `line-strong`. Never a side stripe.

### A. Aero, cleared (Evolve today)

- **Idea:** today's shell and month, with glass only on the frame and every name readable. The whole month fits above the fold in one island.
- **Skeleton at 1280:**
  - **Sidebar:** 264 px on the glass `bar`, with a 1 px light edge. It holds the wordmark (20/28, 700, accent) over the tagline, then `Create Event` (gloss, 44 px, radius 10, full width). Then the three places as 40 px rows with icons, `Calendar` current. At the foot, a `Categories` group: the four chips as a key, so each colour also has a name. This is new UI from existing data.
  - **Top bar:** 64 px of glass. The views on the left, `Month` current (accent text, 2 px underline); the bell and `AE` on the right.
  - **The month:** one island on the ground, 24 px from the edges. `surface`, radius 16, a 1 px light edge and `shadow-panel`. Its head row holds `November 2026` (30/36, 700) and ‹ › (40 px, `line-strong` edges). Under it, the weekday band on `surface-sunk`, then six rows at 92 px, so **all six rows show at 1280×800**. December cells are `surface-sunk` with faint numbers. Today is the 28 px accent disc. The panel-in-panel goes (Floor 11).
  - **Chips:** a rounded rectangle (radius 6), 13/18 at 500, the name whole, wrapping to two lines. The name only, as today.
- **Skeleton at 390:**
  - **Top bar:** today's (menu, the four views, the bell, `AE`). The drawer keeps the sidebar's content.
  - **The month island:** 12 px in from the sides. `November 2026` at 24/32 with 48 px ‹ ›. Weekday heads `Sun`…`Sat` at 12/16. Rows are 52 px. Under each date number, one 16×4 px bar per event in its category's solid colour. A day with events is a button named, for example, "Thursday 12 November, Pub Quiz Night"; it opens that event's dialog, and on a day with two or more it scrolls the In November list to that day's first row (no new route). This shows about all six rows.
  - **In November:** a second island under the month. Seven 64 px rows, each a date tile (`Thu` over `5`), the name at 16/24, the time and location under it in `muted`, and the chip. A row opens the detail dialog.
  - **Create Event:** an extended gloss button, 56 px, bottom-right, 16 px above the gesture area. The list pads by its height.
- **Type:** Geist (Google Fonts `Geist`; fix the family name), 400/500/600/700, with tabular figures. Stamp it "found in the project", because Hallmark lists Geist as saturated. Sizes: 12/16 weekday heads and tagline; 13/18 chips and date numbers; 14/20 nav and UI; 16/24 phone list and body; 20/28 wordmark; 30/36 month title (24/32 at 390).
- **Signature:** the whole month in one glance. All six weeks and every event name whole, above the fold at 1280×800, in one glass-edged island over the Aero desktop.
- **Reference:** `apple`, for one move: translucent materials only on chrome (bars, sidebars), content on opaque surfaces. Nothing of its palette or type.
- **Reopens:** nothing recorded.

### B. The open invitation

- **Idea:** today's or the next event sits on top as a raised ticket with `Join` and `Can't make it`. The month runs full width under it. One row of places replaces the sidebar and the view row.
- **Skeleton at 1280:**
  - **Top bar:** 64 px of glass across the full width. The wordmark (Lexend 20/28, 600, accent) with the tagline under it. Then the places as tabs, an icon plus a label: `Calendar` (current: accent text, a 3 px accent underline), `All Events`, `Map`, and `Admin` for admins. On the right: `Create Event` (gloss, 40 px), the bell and `AE`.
  - **Under it,** a 1200 px container on the ground, 24 px gutters, holding two islands 16 px apart.
  - **The ticket:** `surface`, radius 16, a 1 px light edge and `shadow-panel`, about 112 px tall.
    - A 72 px date tile on `surface-sunk`: `Thu` over `12` (Lexend 28) over `Nov`.
    - Then `Today, 8:30 PM` (13/18, muted); `Pub Quiz Night` (Lexend 24/32, a button that opens the dialog); a row with the Game night chip, a pin icon with `The Corner Tap`, `Host` with `Ada Admin`, and `4 attending`.
    - At the right: `Join` (gloss, 44 px) and `Can't make it` (bordered, 44 px).
    - When nothing is on today, the ticket shows the next event and its date. It fetches that one event's detail for the answer state and shows it the way `EventDetailModal.tsx` does, with no new copy: client-only, the existing endpoints.
  - **The month:** `surface`, radius 16. Its head row holds `November 2026` (Lexend 28/36) with ‹ ›, then on the right a segmented `Month` | `Day` (Month chosen; these are today's two calendar routes). The weekday band is on `surface-sunk`. Six rows at 88 px with columns about 164 px wide, so **at 1280×800 five rows and half the sixth show** (today: five and a sliver). The ticket costs the full-month view that A has; the critic weighs it.
  - **Chips:** two lines, the name (13/18, 600) then the time (12/16, tabular), radius 6. The 164 px columns hold every name whole.
- **Skeleton at 390:**
  - **Top bar:** 56 px. The wordmark (Lexend 18/24), the bell and `AE`. No menu button: the drawer goes.
  - **The ticket:** 12 px in. A 56 px date tile, `Today, 8:30 PM`, `Pub Quiz Night` at 20/28, the chip and `The Corner Tap`, then `Join` | `Can't make it` as two 48 px buttons across the full width.
  - **The month:** an island. The head row, then `Month` | `Day` at full width (48 px). The grid with 52 px rows and A's 16×4 category bars and cell names.
  - **In November:** A's seven-row list in its own island.
  - **Bottom bar:** 64 px plus the gesture inset. `Calendar`, `All Events`, `Map` (plus `Admin` for admins), each an icon over a label, the current one in accent.
  - **Create Event:** an extended gloss button, 56 px, above the bar on the right. The content pads by both heights.
- **Type:** Lexend 500/600 for the wordmark, the month title and the ticket's title; Figtree 400/500/600/700 for the UI, with tabular figures. Sizes: 12/16, 13/18, 14/20 UI, 16/24 body and phone list, 20/28 the 390 ticket title and wordmark, 24/32 the ticket title, 28/36 the month title.
- **Signature:** the ticket. Tonight's quiz, where and who hosts, and the two answers, with no click into the dialog.
- **Reference:** `airbnb`, for its upcoming-trip card: a date tile, the place, and one clear action on a raised card. Nothing of its palette, type or pink.
- **Reopens:**
  - decisions.md, "Visual theme": "Stitch layout/IA preserved; only the skin changed" (brief 13; also design-system.md, the 280 px sidebar and the view switcher Month/Day/List/Map). B moves the places to top tabs, folds `List` and `Map` into them, puts `Month` | `Day` in the month's head, and adds a phone bottom bar in place of the drawer.
  - decisions.md (brief 16): "The phone menu is a `Drawer`". B drops the drawer for a bottom bar. `Month` | `Day` and the bottom bar are router links styled as segments and tabs, so B adds no Base UI part (brief 18).
  - It adds RSVP from the calendar (the ticket), using the dialog's existing `Join` / `Can't make it` calls.

## 5. Registry lines

| SocialEvents (A) | Aero, cleared | Geist (today's, now loaded) | Geist | Aero blue `#1a66b9`, hue 211° (today's; 2° from comercial-website's azure, 4° from atrium's, all today's), glossy | 264 px glass sidebar (Create Event, places, a category key); 64 px glass top bar with Month/Day/List/Map; one month island with all six rows above the fold; phone: today's top bar and drawer, a month of category bars over an In November list, a Create Event button |
| SocialEvents (B) | The open invitation | Lexend (wordmark, month title, ticket title) | Figtree | Aero blue `#1a66b9` (as A), glossy | 64 px glass top bar of places with Create Event; a raised ticket for today's or the next event with Join and Can't make it; a full-width month island with Month/Day in its head; phone: ticket, month, In November list, bottom bar of places, a Create Event button |

## 6. Questions for the owner (ask sticky) and notes

1. **Approve this direction?**
2. **Aero.** Both directions keep it (decisions.md, "Visual theme"), with glass only on the bars. Keep Aero, or open a plain, non-glass variant on the board? Research finds text over glass hard to read [S44].
3. **B's shell.** B reopens "Stitch layout/IA preserved": the sidebar and the Month/Day/List/Map row become one row of places, plus a phone bottom bar in place of the drawer. Is that change welcome?

- **Note (no question):** `attendeeCount` counts people who are only invited, so `4 attending` overstates. The string is copy that states a fact, so brief 18 can't change it; flag it for a later brief.
