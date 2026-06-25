import { describe, it, expect, beforeEach } from "vitest";
import type { FastifyInstance } from "fastify";
import { freshDb, resetData } from "../test/helpers.js";
import { buildApp } from "../app.js";
import { getDb } from "../db/connection.js";

let app: FastifyInstance;

beforeEach(async () => {
  freshDb();
  resetData();
  app = await buildApp();
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

describe("auth & authorization", () => {
  it("registers, sets cookie, and returns me", async () => {
    const { cookie, body } = await registerUser("Alice", "alice@x.com");
    expect(body.user.email).toBe("alice@x.com");
    const me = await app.inject({ method: "GET", url: "/api/auth/me", headers: { cookie } });
    expect(me.statusCode).toBe(200);
    expect(me.json().user.email).toBe("alice@x.com");
  });

  it("blocks unauthenticated access (401)", async () => {
    const res = await app.inject({ method: "GET", url: "/api/events" });
    expect(res.statusCode).toBe(401);
  });

  it("blocks non-admin from admin routes (403)", async () => {
    const { cookie } = await registerUser("Alice", "alice@x.com");
    const res = await app.inject({
      method: "POST", url: "/api/departments", headers: { cookie },
      payload: { name: "Eng" },
    });
    expect(res.statusCode).toBe(403);
  });

  it("rejects duplicate registration (409)", async () => {
    await registerUser("Alice", "alice@x.com");
    const res = await app.inject({
      method: "POST", url: "/api/auth/register",
      payload: { name: "A2", email: "alice@x.com", password: "password123" },
    });
    expect(res.statusCode).toBe(409);
  });

  it("rejects bad login generically (401)", async () => {
    await registerUser("Alice", "alice@x.com");
    const res = await app.inject({
      method: "POST", url: "/api/auth/login",
      payload: { email: "alice@x.com", password: "nope" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("validation error returns 400", async () => {
    const res = await app.inject({
      method: "POST", url: "/api/auth/register",
      payload: { name: "", email: "bad", password: "short" },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("event ownership", () => {
  it("only host or admin can edit/delete an event", async () => {
    const host = await registerUser("Host", "host@x.com");
    const other = await registerUser("Other", "other@x.com");

    const created = await app.inject({
      method: "POST", url: "/api/events", headers: { cookie: host.cookie },
      payload: {
        name: "Party", startsAt: "2026-07-01T18:00:00+00:00", description: "",
        category: "Other", location: { label: "HQ", lat: 1, lng: 2 },
        attendeeUserIds: [], attendeeDepartmentIds: [],
      },
    });
    expect(created.statusCode).toBe(201);
    const eventId = created.json().event.id;

    // other user cannot delete
    const forbidden = await app.inject({
      method: "DELETE", url: `/api/events/${eventId}`, headers: { cookie: other.cookie },
    });
    expect(forbidden.statusCode).toBe(403);

    // host can delete
    const ok = await app.inject({
      method: "DELETE", url: `/api/events/${eventId}`, headers: { cookie: host.cookie },
    });
    expect(ok.statusCode).toBe(204);
  });

  it("admin can delete another user's event", async () => {
    const host = await registerUser("Host", "host@x.com");
    await registerUser("Admin", "admin@x.com");
    // promote to admin directly in the DB, then re-login to refresh the JWT role.
    getDb().prepare("UPDATE users SET role = 'admin' WHERE email = ?").run("admin@x.com");
    const relog = await app.inject({
      method: "POST", url: "/api/auth/login",
      payload: { email: "admin@x.com", password: "password123" },
    });
    const adminCookie = cookieFrom(relog);

    const created = await app.inject({
      method: "POST", url: "/api/events", headers: { cookie: host.cookie },
      payload: {
        name: "P", startsAt: "2026-07-01T18:00:00+00:00", description: "",
        category: "Other", location: { label: "HQ", lat: 1, lng: 2 },
        attendeeUserIds: [], attendeeDepartmentIds: [],
      },
    });
    const eventId = created.json().event.id;

    const ok = await app.inject({
      method: "DELETE", url: `/api/events/${eventId}`, headers: { cookie: adminCookie },
    });
    expect(ok.statusCode).toBe(204);
  });
});
