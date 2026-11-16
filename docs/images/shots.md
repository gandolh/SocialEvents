# README images

How each image was made, so the next refresh is a re-run. Take an image again when the screen it shows changes. All of them show the redesign of 2026-11-13.

| File | Shows | How to reach that state | Viewport | Data | Taken |
|---|---|---|---|---|---|
| calendar.webp | The calendar: the ticket over the month | sign in as the seed's engineer account, Alex; the page opens on `/`; cropped to the top 1620 px | 1440×900 @2x | the seed and the fixture month (below) | 2026-11-16 |
| events.webp | The event directory | same, open `/events`; cropped to the top 1672 px, the first three rows of cards | 1440×900 @2x | same | 2026-11-16 |
| event-detail.webp | One event's dialog, Halloween Mixer | same, click Halloween Mixer on `/events`; cropped to the dialog with a 40 px edge | 1440×900 @2x | the seed's event, which has map coordinates, so the weather row shows the stand-in "(mock)" | 2026-11-16 |
| phone-calendar.webp | The calendar on a phone: ticket, dot grid, key, bottom bar | same as calendar.webp; scaled to 780 px wide | iPhone 14 (390×664 @3x) | same | 2026-11-16 |
| phone-event-sheet-dark.webp | The event sheet on a phone, dark theme | `socialevents-theme` set to `dark` in localStorage before the first paint, open `/`, tap the Pub Quiz Night ticket; scaled to 780 px wide | iPhone 14 (390×664 @3x) | the fixture's Pub Quiz Night, which has no coordinates, so its weather row is empty | 2026-11-16 |

Data: `npm run seed` on a scratch database, then the fixture month of the Playwright hub, the seven November 2026 events in `playwright/global-setup.ts` (and Dana's 4-star rating of Ada as a host), posted through the API as the seed users. The browser clock was frozen at Thursday 12 November 2026, 10:00 UTC, as `playwright/fixtures.ts` does, so Pub Quiz Night is tonight's ticket. Time zone Europe/Bucharest, locale `en-US`, the light theme unless the row says otherwise.

Server: `VITE_MAPS_BROWSER_KEY= npm run build`, then the one-port run, `npm run start --workspace server`, with `NODE_ENV=production`, a random `JWT_SECRET`, `DATABASE_PATH` on a scratch file, `TRUST_PROXY=true`, and empty `WEATHER_API_KEY` and `SMTP_HOST`. The scratch database's passwords were reset to a random value before the run, so the capture script signed in through `POST /api/auth/login` with no password written down.

Captured with a Playwright script kept outside the repo, then `ffmpeg -i shot.png -vf <crop or scale> -c:v libwebp -quality 82 shot.webp`.

For every screen at once, at 1280, 390 and 360 px in both themes (UTC clock): start the hub's test server and run `SHOTS_DIR=<dir> npm run e2e -- tests/shots` ([playwright/README.md](../../playwright/README.md)).

The names, the departments and the events are made up: the seed's five people and the fixture's November events.

Left out: the map view, which shows only a list of places without a Google Maps key. `phone-events.webp`, the directory on a phone, was replaced on 2026-11-16 by `phone-calendar.webp`, since the phone calendar is the screen the redesign changed most.
