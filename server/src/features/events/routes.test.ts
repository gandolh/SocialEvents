import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Db } from "../../db/connection.js";
import { buildTestApp } from "../../testing/helpers.js";

let app: FastifyInstance;
let db: Db;

beforeEach(async () => {
  ({ app, db } = await buildTestApp());
});

afterEach(async () => {
  await app.close();
});

function cookieFrom(res: { headers: Record<string, unknown> }): string {
  const sc = res.headers["set-cookie"];
  const arr = Array.isArray(sc) ? sc : [sc as string];
  return arr.map((c) => c.split(";")[0]).join("; ");
}

async function registerUser(name: string, email: string) {
  const res = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    payload: { name, email, password: "password123" },
  });
  return { cookie: cookieFrom(res), body: res.json() };
}

describe("event ownership", () => {
  it("only host or admin can edit/delete an event", async () => {
    const host = await registerUser("Host", "host@x.com");
    const other = await registerUser("Other", "other@x.com");

    const created = await app.inject({
      method: "POST",
      url: "/api/events",
      headers: { cookie: host.cookie },
      payload: {
        name: "Party",
        startsAt: "2026-07-01T18:00:00+00:00",
        description: "",
        category: "Other",
        location: { label: "HQ", lat: 1, lng: 2 },
        attendeeUserIds: [],
        attendeeDepartmentIds: [],
      },
    });
    expect(created.statusCode).toBe(201);
    const eventId = created.json().event.id;

    // other user cannot delete
    const forbidden = await app.inject({
      method: "DELETE",
      url: `/api/events/${eventId}`,
      headers: { cookie: other.cookie },
    });
    expect(forbidden.statusCode).toBe(403);

    // host can delete
    const ok = await app.inject({
      method: "DELETE",
      url: `/api/events/${eventId}`,
      headers: { cookie: host.cookie },
    });
    expect(ok.statusCode).toBe(204);
  });

  it("admin can delete another user's event", async () => {
    const host = await registerUser("Host", "host@x.com");
    await registerUser("Admin", "admin@x.com");
    // promote to admin directly in the DB, then re-login to refresh the JWT role.
    db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run("admin@x.com");
    const relog = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: "admin@x.com", password: "password123" },
    });
    const adminCookie = cookieFrom(relog);

    const created = await app.inject({
      method: "POST",
      url: "/api/events",
      headers: { cookie: host.cookie },
      payload: {
        name: "P",
        startsAt: "2026-07-01T18:00:00+00:00",
        description: "",
        category: "Other",
        location: { label: "HQ", lat: 1, lng: 2 },
        attendeeUserIds: [],
        attendeeDepartmentIds: [],
      },
    });
    const eventId = created.json().event.id;

    const ok = await app.inject({
      method: "DELETE",
      url: `/api/events/${eventId}`,
      headers: { cookie: adminCookie },
    });
    expect(ok.statusCode).toBe(204);
  });
});
