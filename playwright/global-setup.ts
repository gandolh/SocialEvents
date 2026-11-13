import { join } from "node:path";
import { request, type APIRequestContext } from "@playwright/test";

/**
 * Before the specs: sign the seed's made-up users in (their cookies go to `.output/<name>.json`) and add
 * the fixture month. The events are the ones the board's comps draw for November 2026, hosted and invited
 * through the app's own API, so nothing here edits the seed. A second run finds them and adds nothing.
 */
const PASSWORD = "password123";
const USERS = ["admin", "alex", "dana", "max", "sam"] as const;

interface FixtureEvent {
  name: string;
  startsAt: string;
  category: "Game night" | "Holiday" | "Team building" | "Other";
  place: string;
  host: (typeof USERS)[number];
  description?: string;
  invite?: (typeof USERS)[number][];
}

const EVENTS: FixtureEvent[] = [
  {
    name: "Autumn Lunch",
    startsAt: "2026-11-05T13:30:00Z",
    category: "Team building",
    place: "Roof terrace",
    host: "dana",
  },
  {
    name: "Pub Quiz Night",
    startsAt: "2026-11-12T20:30:00Z",
    category: "Game night",
    place: "The Corner Tap",
    host: "admin",
    description: "Teams of four, one answer sheet per table.",
    invite: ["alex", "dana", "max", "sam"],
  },
  { name: "Book Swap", startsAt: "2026-11-17T14:15:00Z", category: "Other", place: "Kitchen", host: "max" },
  {
    name: "Board Game Afternoon",
    startsAt: "2026-11-19T15:00:00Z",
    category: "Game night",
    place: "Meeting room 3",
    host: "alex",
  },
  {
    name: "Planning Offsite",
    startsAt: "2026-11-24T11:00:00Z",
    category: "Team building",
    place: "Lakeside hall",
    host: "admin",
  },
  {
    name: "Winter Lights Walk",
    startsAt: "2026-11-26T19:00:00Z",
    category: "Holiday",
    place: "Main square",
    host: "dana",
  },
  {
    name: "Holiday Party",
    startsAt: "2026-11-30T21:00:00Z",
    category: "Holiday",
    place: "The Grand Room",
    host: "max",
  },
];

async function signIn(baseURL: string, user: (typeof USERS)[number]): Promise<APIRequestContext> {
  const api = await request.newContext({ baseURL });
  const res = await api.post("/api/auth/login", { data: { email: `${user}@socialevents.local`, password: PASSWORD } });
  if (!res.ok()) throw new Error(`could not sign ${user} in: ${res.status()}`);
  await api.storageState({ path: join(__dirname, `.output/${user}.json`) });
  return api;
}

// Playwright loads a global setup by its default export.
// eslint-disable-next-line import-x/no-default-export
export default async function globalSetup(config: { projects: { use: { baseURL?: string } }[] }): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) throw new Error("no baseURL");
  const apis = Object.fromEntries(await Promise.all(USERS.map(async (u) => [u, await signIn(baseURL, u)]))) as Record<
    (typeof USERS)[number],
    APIRequestContext
  >;

  const users = (await (await apis.admin.get("/api/users")).json()) as { users: { id: string; email: string }[] };
  const idOf = (u: (typeof USERS)[number]) => users.users.find((x) => x.email === `${u}@socialevents.local`)?.id ?? "";

  const existing = (await (await apis.admin.get("/api/events")).json()) as { events: { name: string }[] };
  const have = new Set(existing.events.map((e) => e.name));
  for (const e of EVENTS) {
    if (have.has(e.name)) continue;
    const res = await apis[e.host].post("/api/events", {
      data: {
        name: e.name,
        startsAt: e.startsAt,
        category: e.category,
        description: e.description ?? "",
        location: { label: e.place, lat: null, lng: null },
        attendeeUserIds: (e.invite ?? []).map(idOf),
        attendeeDepartmentIds: [],
      },
    });
    if (!res.ok()) throw new Error(`could not create ${e.name}: ${res.status()}`);
    if (e.name === "Pub Quiz Night") {
      // The comp shows the host rated 4.0 by one person.
      await apis.dana.put(`/api/users/${idOf("admin")}/rating`, { data: { rating: 4 } });
    }
  }
  await Promise.all(Object.values(apis).map((a) => a.dispose()));
}
