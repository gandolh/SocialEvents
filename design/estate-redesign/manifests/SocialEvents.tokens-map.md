# SocialEvents tokens: board role to app token

The app's own mechanism is kept: `@theme` holds the light values and `:root[data-theme="dark"]` restates the colours and shadows, as `index.css` does today. The font mismatch is fixed on the way: `index.css` asks for "Geist" but fontsource registers "Geist Sans", so the system face rendered; both Geist imports go and Figtree and Lexend take their place (Google Fonts, or the matching @fontsource packages).

## Renamed or remapped (board role to app token)
- ground -> `background`
- bar-top -> `glass-from`
- bar-bottom -> `glass-to`
- bar-edge -> `glass-highlight`
- surface -> `surface-bright`
- sunk -> `surface-container-high`
- ink -> `on-surface`
- muted -> `on-surface-variant`
- line -> `outline-variant`
- line-strong -> `outline`
- accent -> `primary`
- on-accent -> `on-primary`
- gloss-top -> `gloss-top` (same name, new value)
- gloss-mid -> `gloss-mid` (same name, new value)
- gloss-bottom -> `gloss-bottom` (same name, new value)
- gloss-sheen -> `gloss-sheen` (same name, new value)
- gloss-drop -> `gloss-drop` (same name, new value)
- focus -> `focus-ring`
- danger -> `error`
- cat-game-night -> `cat-game-night` (same name, new value)
- cat-game-night-tint -> `chip-game-night`
- cat-holiday -> `cat-holiday` (same name, new value)
- cat-holiday-tint -> `chip-holiday`
- cat-team-building -> `cat-team-building` (same name, new value)
- cat-team-building-tint -> `chip-team-building`
- cat-other -> `cat-other` (same name, new value)
- cat-other-tint -> `chip-neutral`
- scrim -> `scrim` (same name, new value)
- surface -> `surface-bright`, and `glass-card`, `glass-edge`, `gloss-mid-low`, `on-background` become aliases of tokens above
- bar-top and bar-bottom are opaque in the board, so the contrast table is exact; the code brief may add alpha of 0.97 or more for the backdrop blur and re-run check-contrast
- chip-neutral (Other) was rgb(255 255 255 / 0.9) and is opaque now
- radii: `radius-sm` 4 -> 6, `radius-md` 9.6 -> 10, `radius-lg` 14.4 -> 16, `radius-xl` 20.8 -> 20
- `shadow-panel` takes the island shadow
- `font-sans` Geist -> Figtree
- the dialog and sheet backdrop is `scrim` with an 8 px backdrop blur, as the board draws it; the build keeps Base UI's Backdrop layer and only its colour changes
- a selected segment (Month | Day, People | Departments) is a `surface-bright` pill with an `outline` edge and `primary` text on a `surface-container-high` track; the solid primary fill is only for the one action per screen
- isolated phone controls (bell, avatar, month arrows, Create Event, stars) are 48 px (`size-touch` 44 stays for day cells); stars stay buttons

## New tokens (component that needs them)
- `on-surface-faint`: other months' dates in the grid (4.71 on the weekday-band tone)
- `gloss-edge`: the 1 px edge of every glossy button (Join, Create Event, Create, the avatar)
- `focus-halo`: the second tone of the two-tone focus ring (the ring is `focus-ring`)
- `chip-neutral-edge`: the Other chip's edge (the other chips edge in their own text colour)
- `font-display`: wordmark, month title, ticket title, dialog titles, list head
- `text-label`, `text-small`, `text-body`, `text-list`, `text-title`, `text-dialog`, `text-month` (each with its line height): the type scale, replacing Tailwind's defaults in the screens
- `radius-tile`: the date tile in the ticket and in the phone list
- `shadow-dialog`: dialogs and the phone sheet
- `height-topbar`, `height-bottom-bar`, `height-month-cell`, `size-touch`: the glass top bar, the phone bottom bar, a month row, the 44 px target

## App tokens the design no longer uses (keep or drop is the code brief's call)
- `desktop-top`, `desktop-mid`, `desktop-bottom`, `desktop-bloom`, `desktop-glow`: the board paints the desktop as flat `background`, as Shell.tsx does today; the body's layered gradient sits under it
- `aero-glow`: focus is a two-tone ring, not a glow
- `glass-strong-from`, `glass-strong-to`, `glass-strong-edge`, `glass-strong-highlight`, `glass-strong-shadow`: dialogs are opaque surfaces with a glass title bar (`glass-from` / `glass-to`)
- `glass-panel`, `glass-panel-ring`, `glass-divider`, `glass-hover`, `glass-shadow`: islands are opaque and carry `outline-variant` edges
- `field`, `field-focus`, `shadow-field`: fields are opaque `surface-bright` with an `outline` edge
- `gloss-light-from`, `gloss-light-to`, `gloss-shade`: the secondary button is a flat outlined surface
- `danger-top|mid|bottom`, `social-top|mid|bottom`: no glossy danger or social button is drawn
- `secondary*`, `tertiary*`, `primary-container`, `on-primary-container`, `inverse-primary`, `surface-tint`, `surface-dim`, `surface-container-lowest|low|highest`, `surface-variant`, `inverse-surface`, `inverse-on-surface`, `error-container`, `on-error-container`, `success`: not drawn in the three screens; check the other screens (All Events, Map, Admin, sign-in) before dropping
- `scrollbar`: unchanged, not drawn
