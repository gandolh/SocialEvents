fix

# SocialEvents redesign, critic's findings (2026-11-13)

I looked at today's shots and the renders before reading the manifest, and I measured with headless Chromium on the twins (CSS injected in a scratch run, nothing edited). The Open invitation holds. The ticket, the whole names and the islands over the Aero desktop make it a clear step up from today. What's owed is one dialog layer, the selected states, a 360 first screen and a few Android details.

## First-screen density, today against the build

| Screen | Month rows whole | Event names whole | Next event | In November rows above the bar |
|---|---|---|---|---|
| 1280x800 today | 5 of 6 (row 5 ends y 746, row 6 cut) | 5 of 7 ("Board Game ...", "Winter Lights ...") | no | none |
| 1280x800 build | 6 of 6 (ends 783) | 7 of 7, with times | ticket, ends 150, with Join | none |
| 390x844 today | 5 of 6 (ends 766) | 0 of 7 (one letter each) | no | no list |
| 390x844 build | 6 of 6 (ends 559) | dot grid, names in ticket and list | ticket, ends 198 | 2 (end 698, 755; bar top 764) |
| 360x800 today | 5 of 6 (inferred from 390, not captured) | 0 of 7 (inferred) | no | no list |
| 360x800 build | 6 of 6 (ends 577) | as 390 | ticket, ends 216 (three lines) | 0 (first ends 750; bar top 720) |

Today's counts come from the grid hairlines in today's PNGs. The build's numbers are mine and match the builder's.

What to do at 360. Two rows can't be reached there without cutting content, so the target is one whole row with the list head. Three moves, measured together with nothing removed:
1. The key on one line under 380 px. Use 12x4 bars, 4 px from bar to label and 10 px between items. It fits at 360 with no overflow and is 31 px tall instead of 51, with Other no longer alone on a second line.
2. "In November" at 17/24 with 6 px top padding at phone widths (now 20/28, 10 px).
3. Under 380 px, put the chip on the name line and give time and place the row's full width below. Make the row a grid: a 48 px tile column spanning both lines, the name and the chip on line 1, time and place across line 2, row gap 0 and 4 px block padding. With a 12 px row gap the rows grow to 64 and the gain is gone. At 360 the meta now wraps to two lines and rows are 70 px. After the move they're 56 again, and Board Game Afternoon's name wraps between words to 70.

Together the first row ends at 706 at 360, 14 px above the bar, with all six weeks kept. At 390 only the head changes: rows end 688 and 745, 19 px clear. With the 48 px controls from issue 6 the month head grows from 52 to 56, and the margins become 10 px at 360 (710) and 15 px at 390 (692, 749). Don't shrink the 44 px day cells and don't drop the place or the chip. One more option is the owner's call. Drawing five weeks when the month needs five (November 2026 does) frees another 45 px, but it departs from the fixture's "six rows as today" and does nothing in a six-week month.

The 1280 fold depends on the fixture. No day holds two events. With a second chip on the 19th the sixth row ends at 820, and at 804 with time-first one-line chips on busy days. Don't cap rows or add "+2 more", which hides events. Reword the floor sticky to "all six weeks at 1280x800 when no day holds two events".

## Regressions against today

1. **The dialog backdrop, every dialog, both widths.** Today's `Dialog.tsx` renders Base UI's Backdrop with `bg-scrim backdrop-blur-sm`, so the page goes soft. The comps only darken it with `filter: brightness(.52) saturate(.85)` (islands #fcfeff to #838484) and leave it sharp. On the phone the ticket's Join and Can't make it stay crisp right above the sheet's own Join and Can't make it. design-system.md records L3 as "strong shadow + 8px backdrop blur", and nothing reopens it. Fix: keep today's Backdrop layer and fill it with the new `--color-scrim` (rgb(10 32 48 / .55) light, rgb(0 8 20 / .72) dark). Keep `blur-sm` and the 150 ms fade. Nothing is read through a scrim, so this doesn't clash with "glass only on the bars".
2. **One primary per screen.** Today Create Event is the only gloss and the selected invite tab is a pale tint with blue text. Now the selected Month segment and the selected People tab are solid accent fills, as heavy as the Join and Create gloss next to them. The 1280 light first screen has four solid blue blocks (Create Event, Join, Month, the 12 disc). In dark the #6db3ff Month segment is the brightest thing in the phone's top bar. Fix: put the segment track on `sunk` with a 1 px `line-strong` edge. Make the selected segment a `surface` pill (#fcfeff light, #1f3456 dark) with a 1 px `line-strong` edge, accent text at 600 and `aria-current`. That's the direction's own rule for selected navigation. Do the same for People | Departments, so gloss means "act" everywhere.

Nothing else regressed. Density, names, the islands and the category hues all hold or improve, and the current place is now marked where today marked nothing. Folding List into All Events loses nothing, because `Shell.tsx` points List at `/events`.

## The builder's four changes

- **Create Event in the bottom bar holds.** It's Material 3's bottom app bar with the action at the right, in Android thumb reach, and it can't cover content. Scrolled to the end, the list stops 23 px above the bar at 390 and 360 (the builder's `shoot.txt`). With an Admin tab it still fits at 360 (four 61 px tabs), though "Calendar" and "All Events" nearly touch. Raise it from 44 to 48 px, which is free in a 64 px bar.
- **The filter dim holds as a drawing, not as the build.** See regression 1. The app already has the Backdrop layer, and the recorded L3 blur goes with it. The Direction sheet lists `--color-scrim` for "behind a dialog or a sheet" and says every value is used, but no comp uses it.
- **Month | Day in the phone top bar holds on Calendar.** It leaves the month head to full-size arrows and keeps the month short, and screen actions in the top app bar are the Android convention. It needs the selected-state fix, 48 px height (the bar is 56) and a stated rule for All Events and Map, which no screen shows. Hide the segment there rather than disabling it.
- **The phone key under the grid holds at 390.** A legend under a chart is the convention, and it uses the cells' own 16x4 bars. At 360 it fails as drawn. The one-line fix is above.

## Priority issues, ranked by cost to the user

1. **At 360x800 no In November row clears the bar.** It's a common Android width, and the user sees the list head with no row under it. Fix with the three measured moves above.
2. **The page stays sharp behind dialogs.** Regression 1.
3. **Selected segments look like primary buttons.** Regression 2.
4. **The rating is drawn as a picture of a control.** decisions.md says `StarRating` stays buttons and each click saves. The comp draws 18 px `role="img"` stars and leaves the hit area to the code brief. At real size (five 48 px targets) the chip-and-stars row overflows the phone sheet by 34 px at 360 and 4 px at 390 (measured). Fix: on phones, give the stars their own row under the chip, five 48 px buttons with 24 px glyphs and "0.0 (0)" after them. At 1280, give each star a 44 px target, which the 590 px row has room for.
5. **Today's cell carries an event-like bar.** `.cell.is-today` adds a 3 px accent stripe on top. On the phone it sits right over the 12 disc in the same language as the 16x4 event bars, so it reads as a blue event. Drop it. The 26 px accent disc marks today on its own, as it does in today's app.
6. **Android targets.** The bell, AE, the month arrows, Month, Day and Create Event are 44 px. Make them 48. The top bar (56) and bottom bar (64) absorb it, and the month head grows 4 px (measured above, still clear). Keep the day cells at 44x47. 48 px cells add 24 px and push the second 390 row to 779, past the bar, which breaks ruling 3.
7. **The sheet's grab bar promises a swipe.** Build the phone detail sheet on the app's `Drawer` wrapper. It's Base UI's Drawer, with swipe-to-dismiss and a backdrop that fades with swipe progress, and the dropped phone menu leaves it free. Otherwise drop the grab bar.

Minor: at 1024, "4 attending" sits alone on the ticket's second line, so move the whole meta group to line two as at 768. The weather dash drawn as U+2012 to pass gate 19 is a comp trick, so the code keeps the app's own character. A render-rig bug, not a design one: the 768 dialog renders end in a 224 px white band, because the twin's `.stage` is 800 px tall in a 1024 px viewport. Give `.stage` `min-height: 100dvh` so the owner doesn't see a broken comp.

Clashes with the rulings: none of the fixes above clashes with one. The five-week month is flagged as an owner call. The phone ticket leaves out Host and "4 attending", as the winning sketch did. That's removal rather than truncation, and the sheet carries both, so I'd keep it.

## Strengths to keep

- The ticket at 1280 is one 70 px row with tonight's event, place, host and both answers. It's the reason B won, and RSVP no longer needs the dialog.
- At 1280 every name is whole with its time and all six weeks are in view. Today shows five weeks and cuts two names.
- The islands stay. Ticket and month each sit on their own surface over the Aero desktop, with the weekday band and December on `sunk` and 1 px edges in both themes. Dark is designed: islands are lighter than the night ground (1.43:1 plus edges), the chips use deep tints with light text, and the gloss flips to light blue with #04223f text.
- The phone is a real phone design: a bottom bar, sheets from the bottom with 48 px full-width answers, a dot grid of named day buttons and list rows with date tiles.

## Heuristic scores: 32/40, Good band (28-35)

1. Visibility of system status: 3. The current place and view are marked and the states sheet is full, but the ticket's answered state isn't drawn.
2. Match with the real world: 4. Calendar conventions, date tiles and plain words (Join, Can't make it).
3. User control and freedom: 3. Close, Cancel and Can't make it all exist, but the grab bar may not drag.
4. Consistency and standards: 3. Selected states look like actions, and today's stripe looks like an event bar.
5. Error prevention: 3. Inline required message, and answers disabled while pending.
6. Recognition rather than recall: 4. Labelled tabs, a key that names the hues, names in the list.
7. Flexibility and efficiency: 3. One-tap RSVP from the calendar and day cells that jump to the list, but no keyboard paths.
8. Aesthetic and minimalist design: 3. Calm islands, but four solid blues compete at 1280.
9. Error recovery: 3. "Couldn't load events." has Try again. "Could not create event." offers no next step.
10. Help and documentation: 3. Empty states point to Create Event, but nothing says the stars take a tap (inherited).

Cognitive load is low, with one failure on the checklist: visual hierarchy, from the competing blues. No decision point shows more than four options.

Detector: run as written it reported DEGRADED and returned `[]`. From a scratch copy using presentation-sites' parser modules it exits 2, with 6 findings on calendar, 10 on event-detail, 12 on create-event and 6 on scrolled per theme, and 71 on the Direction sheet.
- `cramped-padding` on `.se`, `.island`, `.dh` and `.seg` is a false positive: a full-bleed grid and a segment track.
- `gpt-thin-border-wide-shadow` is the recorded Aero elevation (a 1 px edge plus a 20 or 60 px shadow), so keep it.
- `side-tab` on `.cell.is-today` is real. It's issue 5.
- On the sheet, `tiny-text` (54, the 11 px captions) and `tight-leading` (4) are specimen-only. `dark-glow` is the two-tone focus halo. `em-dash-overuse` is false: its 66 hits are `--color-*` token names.
- `low-contrast` is real on the sheet only: the "Elevation, on the desktop" caption is white on the #5b8bbf ground at 3.5:1. Move it off the ground or set it at 19 px bold.

While fixing, don't dilute the ticket with its two answers, the whole names with times, or the islands over the Aero desktop, and keep every density fix free of cut content.
