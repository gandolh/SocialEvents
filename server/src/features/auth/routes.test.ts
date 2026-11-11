import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildTestApp } from "../../testing/helpers.js";

let app: FastifyInstance;

beforeEach(async () => {
  ({ app } = await buildTestApp());
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
      method: "POST",
      url: "/api/departments",
      headers: { cookie },
      payload: { name: "Eng" },
    });
    expect(res.statusCode).toBe(403);
  });

  it("rejects duplicate registration (409)", async () => {
    await registerUser("Alice", "alice@x.com");
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { name: "A2", email: "alice@x.com", password: "password123" },
    });
    expect(res.statusCode).toBe(409);
  });

  it("rejects bad login generically (401)", async () => {
    await registerUser("Alice", "alice@x.com");
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: "alice@x.com", password: "nope" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("validation error returns 400", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { name: "", email: "bad", password: "short" },
    });
    expect(res.statusCode).toBe(400);
  });
});
