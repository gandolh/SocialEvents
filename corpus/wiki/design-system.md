---
summary: The applied design, "The open invitation" (the ticket over the month, glass only on the bars, Lexend and Figtree, a light and a dark theme), with the Stitch source it replaced kept below
updated: 2026-11-13
---

# Design system

> **Applied design: "The open invitation" (2026-11-13, brief 18).** Tonight's event, or the next one with its
> date, sits on top of the calendar as a raised **ticket** with its two answers, over a full-width month on the
> blue Aero desktop. The Stitch inventory further down is the source; where it disagrees with this section (the
> **280 px sidebar**, the view switcher, the Geist type), this section wins and the change is recorded in
> [decisions.md](decisions.md).
>
> - **Frame.** A glass top bar (64 px, 56 on a phone) holds the wordmark, the places as tabs (Calendar, All
>   Events, Map, and Admin for admins), Create Event (a 40 px gloss button, icon-only below 1024 px), the bell and
>   the avatar. **Month | Day** is a segmented pair of router links in the month's head, and in the top bar on a
>   phone, on Calendar only. On a phone a glass **bottom bar** holds the places and Create Event at its right
>   end; nothing floats, and the page pads by the bar and the gesture inset. The breakpoint is Tailwind's `md`
>   (768 px); `narrow` (380 px) tightens the rules for a 360 px phone.
> - **Surfaces.** Aero stays in both themes, narrowed: **glass only on the bars and the dialogs' title bars**
>   (`aero-bar`, a two-stop gradient with a light top edge). Islands (the ticket, the month, the lists, the cards),
>   dialogs and fields are opaque `surface-bright` with a 1 px edge (`outline-variant`; `outline` for controls)
>   over the flat `background` desktop. Elevation: `shadow-panel` for an island, `shadow-dialog` for a dialog and
>   the phone sheet; dialogs sit on Base UI's Backdrop in `scrim` with an 8 px blur.
> - **Colour.** Tokens in `client/src/styles/index.css`: the light values in `@theme`, the dark ones in the
>   `:root[data-theme="dark"]` block. Primary blue `#1a66b9` (dark `#6db3ff`); `gloss-top|mid|bottom` and
>   `gloss-edge` for the one gloss button per screen region; `on-surface-faint` for other months' dates;
>   `focus-ring` + `focus-halo` make the two-tone focus ring (`aero-focus`). Category hues are the old ones, tuned for
>   contrast: Game night `#5a2cc4`, Holiday `#9c3410`, Team building `#14663e`, Other `#3c5871`, each with an opaque
>   `chip-*` fill; the stars use the Game night colour. `scripts/check-contrast.mjs` checks 36 pairs in both
>   themes, a gradient at both of its stops, with no known floors: the text minimum is 4.62:1 light and 5.32:1
>   dark, icons, edges and the focus ring 3.99 and 3.28.
> - **Type.** Lexend (`font-display`, 500; the wordmark 600) for the wordmark, the month title, the ticket title,
>   dialog titles and the list head; Figtree for everything else, tabular figures, 14/20 on the body. Both are
>   self-hosted variable fonts (`@fontsource-variable/lexend` and `figtree`, 5.3.0). Seven steps as `text-*` tokens:
>   `label` 12/16, `small` 13/18, `body` 14/20, `list` 16/22, `title` 20/28, `dialog` 22/28, `month` 28/36.
> - **Shape and size.** Radii: 6 chips, 10 controls and fields, 12 the date tile (`radius-tile`), 16 islands and
>   dialogs, 20 the phone sheet. `height-topbar`, `height-bottom-bar`, `height-month-cell` (88 px; 44 on a
>   phone) and `size-touch` (44 px) are tokens. Isolated phone controls are 48 px; the phone's day cells stay 44.
> - **Calendar.** The month keeps six rows. Each event is a chip with its whole name (wrapping between words)
>   and its time. On a phone the grid is dots: a 16x4 bar in the category colour per event, each day a 44 px
>   button named for its event, with the category key as bars under the grid and an **In November** list below it
>   (the month shown). Today's cell keeps its disc.
> - **Dialogs.** Opaque, with a glass title bar and a footer on the sunk tone; Join (gloss) and Can't make it
>   (outlined) sit in the footer. On a phone the event detail is a bottom sheet (`SheetDrawer`, swipe down or the
>   grab bar), and the create and profile dialogs fill the screen with a footer that stays. A selected segment
>   (Month | Day, People | Departments, the filters) is a `surface-bright` pill with a 1 px edge and primary text
>   at 600; the solid fill is only for the one action per screen. Loading is a still skeleton, never a spinner.
> - **Copy added.** `Today, 8:30 PM` on the ticket (`Nov 19, 3:00 PM` when it is not today), `In November`,
>   `Categories`, `No events in November.`, `Couldn't load events.` with `Try again`, `Couldn't load this event.`.
>
> **Two themes (since 2026-11-11, brief 16).** The picker (Light / Dark / System) is in the profile dialog's
> Appearance section; `lib/theme.ts` keeps the choice in `localStorage` (`socialevents-theme`), a first visit
> shows light, and `data-theme` on `<html>` is always `light` or `dark`. A named z scale (`z-sticky` 20,
> `z-overlay` 40, `z-dialog` 50, `z-popup` 60) orders the layers.
>
> **Widgets.** Dialog, menu, popover, the sheet drawer, tabs, radio group and checkbox are Base UI 1.9.0
> wrappers in `client/src/components/ui/`; the deletes use `InlineConfirm`. Selects, text, password and date-time
> inputs stay native.

# Stitch source (kept for reference)

The sections below are the original Stitch output. The **typography, spacing/layout and screen inventory** parts
are superseded by the section above.

Source: [sources/stitch_design/](../sources/stitch_design/) — 5 screens (HTML + PNG)
+ `internal_connection_system/DESIGN.md` (tokens). System name: **"Internal
Connection System"**, aesthetic **"Professional Play" / Corporate Modern**: a
structured high-utility frame punctuated by energetic accents and soft geometry.

> Tokens go in the Tailwind **v4 `@theme`** block in client CSS (no JS config —
> see [decisions.md](decisions.md)).

## Typography (Stitch source; replaced 2026-11-13)
- ~~**Font: Geist** via `@fontsource/geist-sans`~~ (history: it never rendered, since the stylesheet asked for "Geist"
  while the package registers "Geist Sans"). Now Lexend and Figtree, see above. The Stitch scale was:
- Display 48/56 700 · headline-lg 32/40 600 · headline-md 24/32 600 ·
  title-md 18/24 600 · body-lg 16/24 400 · body-md 14/20 400 ·
  label-md 12/16 500 · label-sm 10/12 600.
- Weight usage: 600 for UI headers, 500 for interactive labels. Calendar event
  titles use `label-md`.

## Color (Material-3-style tokens, light mode)
Anchor = **"Trust Blue"** primary. Key tokens (full set in DESIGN.md):
- primary `#003d9b` / on-primary `#fff` / primary-container `#0052cc`
- secondary `#5700e2` (purple) / tertiary `#851800` (orange-red) / error `#ba1a1a`
- surface `#faf9ff` / background `#faf9ff` / on-surface `#051a3e`
- surface-container scale `#ffffff → #d8e2ff`; outline `#737685`, outline-variant `#c3c6d6`
- **Category accents:** Game night = purple (secondary family), Holiday =
  orange-red (tertiary), Team building = emerald green, Other = neutral. These map
  the [data-model.md](data-model.md) categories.
- **Dark mode:** deep navy-grays (not pure black); category colors +10% luminance;
  elevation via tonal layering, not just shadow.

## Shape & elevation
- Radius: standard **8px** (buttons/inputs/cards), **16px** (modals/banners),
  pill (badges/category chips), circular (avatars/pips). Tokens: sm .25 / DEFAULT
  .5 / md .75 / lg 1 / xl 1.5rem / full.
- Elevation L0 canvas → L1 card (1px border + 4px/2% shadow) → L2 hover/dropdown
  (12px/8%) → L3 modal (strong shadow + 8px backdrop blur).

## Spacing / layout
- 4px base unit. xs4 sm8 md16 lg24 xl32; gutter 20, margin 24.
- 12-col fluid grid desktop; ~~**280px fixed left nav**~~ (history: replaced by the top bar and the places as tabs,
  2026-11-13).
- Breakpoints: mobile <600 (single col, 16px margins, sidebars→bottom sheets);
  tablet 600–1024 (8-col, sidebars→icon rails); desktop >1024 (12-col, 24px margins).

## Components (from DESIGN.md)
- **Calendar chips:** compact pill, subtle category-tinted bg + same-hue border/text.
- **Buttons:** primary = solid Trust Blue/white; secondary = ghost + 1px border;
  social = high-vibrancy accent for Join/RSVP.
- **Avatar stacks:** 32px circles, 2px bg-matching border, `+X` overflow in label-sm.
- **Star ratings:** active star = Game-night **purple** (not yellow) — playful brand cue.
- **Inputs:** 8px radius, 1px border; focus = 2px primary ring @20% opacity.
- **Status badges:** lowercase, pill ("in progress", "full").
- **Notification dots:** 8px; orange/red = urgent, blue = social.

## Screen inventory (the 5 designed screens)
1. **calendar_month_view** — *the Stitch shell (replaced 2026-11-13).* Left sidebar (logo
   "SocialEvents / Internal Coordination", **Create Event** button, nav
   Calendar/All Events/Map/Admin, bottom: Filters + Mini Calendar). Top bar:
   search, view switcher **Month/Day/List/Map**, notification bell (with pip),
   avatar. Main: month grid, "October 2023" headline, prev/next, category-colored
   event chips, today highlighted.
2. **all_events_list_view** — Event Directory; cards with category chip,
   title, date/time, location, host avatar+name, RSVP/Join/Attending action,
   bookmark. Top controls: All Events / Mine·Invited toggle, Filters, Sort.
3. **event_details** — modal with photographic cover banner (see
   [open-questions.md](open-questions.md) re: image field), category chip, star
   rating, close button. (Other detail fields per SPEC §11.6.)
4. **event_map_discovery** — full map with category-colored markers + search.
5. *(login/register, admin panel, create-event modal, profile/settings are NOT in
   the Stitch set — derive from this system + SPEC §11.)*

## HTML reference
Each screen's `code.html` is Tailwind-class HTML — useful as a structural/class
reference when building React components, **but** it targets Tailwind v3-style
config; translate tokens into the v4 `@theme` block and into reusable components.
