# Design system (Stitch output)

Source: [docs/stitch_design/](../../docs/stitch_design/) — 5 screens (HTML + PNG)
+ `internal_connection_system/DESIGN.md` (tokens). System name: **"Internal
Connection System"**, aesthetic **"Professional Play" / Corporate Modern**: a
structured high-utility frame punctuated by energetic accents and soft geometry.

> Tokens go in the Tailwind **v4 `@theme`** block in client CSS (no JS config —
> see [decisions.md](decisions.md)).

## Typography
- **Font: Geist** via `@fontsource/geist-sans` (the `geist` npm pkg drags in
  `next`+vulnerable postcss — avoided). Weights 400/500/600/700 imported in
  `client/src/styles/index.css`. Tight modular scale.
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
- 12-col fluid grid desktop; **280px fixed left nav**.
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
1. **calendar_month_view** — *primary shell reference.* Left sidebar (logo
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
