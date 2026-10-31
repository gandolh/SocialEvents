# README images

How each image was made, so the next refresh is a re-run. Take an image again when the screen it shows changes.

| File | Shows | How to reach that state | Viewport | Data | Taken |
|---|---|---|---|---|---|
| calendar.webp | The month calendar | `migrate`, `seed`, both dev servers; sign in on `/` as the seed's engineer account; the page opens on the calendar | 1440×900 @2x | the seed, plus seven made-up November events posted to `POST /api/events` as the seed admin | 2026-11-01, so today is the 1st |
| events.webp | The event directory | same, open `/events`; cropped to the top 1690 px | 1440×900 @2x | same | 2026-11-01 |
| event-detail.webp | One event's dialog | same, click Pub Quiz Night on `/events`; cropped to the dialog | 1440×900 @2x | same, with no keys, so the weather is the stand-in | 2026-11-01 |
| phone-events.webp | The directory on a phone | same, iPhone 14 emulation; the top 1990 px, scaled to 585 px wide | 390×844 @3x | same | 2026-11-01 |

Captured with Playwright and Chrome, then `ffmpeg -i shot.png -vf <crop> -c:v libwebp -quality 82 shot.webp`. The server ran with a random `JWT_SECRET` and `DATABASE_PATH` on a scratch file.

The names, the departments and the events are made up: the seed's five people and the November events added for the pictures.

Left out: the map view, which shows only a list of coordinates without a Google Maps key.
