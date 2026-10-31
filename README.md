# SocialEvents

A planner for a company's social events. Anyone signed in can create an event, invite people or whole departments, and see everything on a calendar, a list or a map, with the weather at each place.

<p align="center">
  <img src="docs/images/calendar.webp" width="100%" alt="The month calendar for November 2026 in a light blue, frosted Windows 7 style: today, the 1st, circled, and coloured chips for made-up events such as Coffee & Code, Autumn Hike, Pub Quiz Night and Thanksgiving Potluck">
</p>

**Status:** Personal project, version 1 built and checked on 2026-06-25, with all 14 briefs done. It runs locally and is not deployed. It is a ground-up rebuild of a 2023 Next.js, Express and MongoDB app, whose spec is kept in [corpus/sources/SPEC.md](corpus/sources/SPEC.md).

## What it does

- People belong to departments. An event has a name, a time, a category, a place on the map and a description, and its host invites single people or whole departments.
- Invitees get an email and a notification in the app, and answer Join or Can't make it.
- Events show on a month or day calendar, in a directory you can search and filter by category, and on a map.
- Each event shows the current weather at its place, and people rate both the event and its host from one to five stars.
- Admins create departments and move people between them.

<table>
<tr>
<td width="62%" valign="top"><img src="docs/images/events.webp" alt="The event directory: a search box, All Events and Hosted By Me tabs, category and sort filters, and cards with each event's category, time, place, host and number attending"></td>
<td width="38%" valign="top"><img src="docs/images/phone-events.webp" alt="The event directory on a phone, with the side menu folded into a button"></td>
</tr>
</table>

<p align="center">
  <img src="docs/images/event-detail.webp" width="70%" alt="One event, Pub Quiz Night: its category, time, mock weather, host with a four-star rating, place with a View map link, details, four attendees, and Join and Can't make it buttons">
</p>

It runs with no API keys. Weather, maps and email fall back to built-in stand-ins, so the weather above reads "(mock)" and the map shows the places as a list. Keys in `.env` turn on the real services.

## How it works

Three npm workspaces. `shared` holds the Zod schemas and types that are the API contract. `server` is a Fastify API on one SQLite file, with hand-written queries and its own JWT sign-in in a cookie. `client` is a React page built with Vite, Tailwind and TanStack Query and Router.

```mermaid
flowchart LR
  client["client<br/>React, Vite"] -->|"/api, cookie"| server["server<br/>Fastify"]
  server --> db[("SQLite")]
  server -.->|"optional keys"| ext["weather API, SMTP"]
  client -.->|"optional key"| maps["Google Maps"]
  shared["shared<br/>Zod contract"] --- client
  shared --- server
```

More in the wiki: [architecture](corpus/wiki/architecture.md), [data model](corpus/wiki/data-model.md), [API](corpus/wiki/api-contract.md) and [sign-in](corpus/wiki/auth.md).

## Run it locally

Requires Node 20.11 or newer.

```bash
npm install
npm run build:shared     # build the shared contract first
npm run migrate          # create the SQLite schema
npm run seed             # five people in three departments, four events
npm run dev:server       # Fastify on :3001
npm run dev:client       # second terminal: Vite on http://localhost:5173, forwarding /api to :3001
```

The seed prints the accounts it made. `npm run typecheck`, `npm test` and `npm run build` check and build all three workspaces. Settings, the optional keys and a single-port production run: [docs/getting-started.md](docs/getting-started.md).

## Project layout

| Path | What lives there |
|---|---|
| `shared/` | The API contract: Zod schemas and types |
| `server/` | Fastify API, SQLite migrations, data access, sign-in, the weather, maps and email adapters, the seed and the Vitest tests |
| `client/` | The React page |
| `corpus/` | The project wiki: decisions, design system, status, briefs, the source spec and the Stitch design, and the UI test plans |
| `playwright/` | How to start a test server for the UI test plans |

## Docs

- [docs/](docs/README.md): setup and how the images were made
- Project wiki: [corpus/](corpus/index.md), starting with [overview.md](corpus/wiki/overview.md)

## License

MIT, see [LICENSE](LICENSE).
