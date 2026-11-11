import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import Fastify, { type FastifyInstance } from "fastify";
import { afterEach, describe, expect, it } from "vitest";
import { authRoutes } from "../features/auth/index.js";
import { departmentRoutes } from "../features/departments/index.js";
import { eventRoutes } from "../features/events/index.js";
import { integrationRoutes } from "../features/integrations/index.js";
import { notificationRoutes } from "../features/notifications/index.js";
import { ratingRoutes } from "../features/ratings/index.js";
import { userRoutes } from "../features/users/index.js";
import type { Auth } from "../plugins/auth/index.js";
import { errors } from "../plugins/errors.js";

// Each route runs here over a fake store that returns MORE than the route's response schema allows, to prove the
// schema strips the extra field, and over one that returns LESS, to prove a bad reply is a 500 with no detail.

const T = "2026-01-01T00:00:00.000Z";
const ID = "00000000-0000-4000-8000-000000000001";
const LEAK = "do-not-send";

const signedIn: Auth = {
  requireAuth: async (request) => {
    request.user = { sub: ID, role: "admin", name: "Ada", email: "ada@x.com" };
  },
  requireAdmin: async (request) => {
    request.user = { sub: ID, role: "admin", name: "Ada", email: "ada@x.com" };
  },
  startSession: () => undefined,
  endSession: () => undefined,
};

const user = {
  id: ID,
  name: "Ada",
  email: "ada@x.com",
  role: "admin",
  departmentId: null,
  jobTitle: null,
  createdAt: T,
};
const department = { id: ID, name: "Eng", createdAt: T };
const summary = {
  id: ID,
  name: "Party",
  hostId: ID,
  hostName: "Ada",
  startsAt: T,
  category: "Other",
  description: "",
  location: { label: "HQ", lat: null, lng: null },
  attendeeCount: 0,
  createdAt: T,
};
const detail = { ...summary, attendees: [], rating: { average: 0, count: 0 } };
const rating = { aggregate: { average: 0, count: 0 }, myRating: null };

/** A bare app: the compilers, the error handler, and one feature over fakes. */
async function appWith(register: (app: FastifyInstance) => PromiseLike<unknown>): Promise<FastifyInstance> {
  const app = Fastify();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(errors);
  await register(app);
  return app;
}

/** A stand-in for a store: only the methods a route calls exist. `never` fits every parameter type. */
function fake(value: unknown): never {
  return value as never;
}

let app: FastifyInstance | undefined;
afterEach(async () => {
  await app?.close();
  app = undefined;
});

async function get(url: string) {
  const res = await (app as FastifyInstance).inject({ method: "GET", url });
  return res;
}

describe("response schemas strip what they do not list", () => {
  it("users: GET /api/auth/me", async () => {
    const users = fake({
      findById: () => ({ ...user, passwordHash: LEAK }),
    });
    app = await appWith((a) => a.register(authRoutes, { users, mailer: fake({}), auth: signedIn }));
    const res = await get("/api/auth/me");
    expect(res.statusCode).toBe(200);
    expect(res.body).not.toContain(LEAK);
    expect(res.json()).toEqual({ user });
  });

  it("users: GET /api/users", async () => {
    const users = fake({ list: () => [{ ...user, passwordHash: LEAK }] });
    app = await appWith((a) => a.register(userRoutes, { users, auth: signedIn }));
    const res = await get("/api/users");
    expect(res.body).not.toContain(LEAK);
    expect(res.json()).toEqual({ users: [user] });
  });

  it("departments: GET /api/departments", async () => {
    const departments = fake({
      list: () => [{ ...department, secret: LEAK }],
    });
    app = await appWith((a) => a.register(departmentRoutes, { departments, auth: signedIn }));
    const res = await get("/api/departments");
    expect(res.body).not.toContain(LEAK);
    expect(res.json()).toEqual({ departments: [department] });
  });

  it("events: GET /api/events and /api/events/:id", async () => {
    const events = fake({
      list: () => [{ ...summary, secret: LEAK }],
      findDetailById: () => ({ ...detail, secret: LEAK }),
    });
    app = await appWith((a) =>
      a.register(eventRoutes, {
        events,
        departments: fake({}),
        users: fake({}),
        notifications: fake({}),
        mailer: fake({}),
        auth: signedIn,
      }),
    );
    const list = await get("/api/events");
    expect(list.body).not.toContain(LEAK);
    expect(list.json()).toEqual({ events: [summary] });
    const one = await get(`/api/events/${ID}`);
    expect(one.body).not.toContain(LEAK);
    expect(one.json()).toEqual({ event: detail });
  });

  it("notifications: GET /api/notifications", async () => {
    const note = { id: ID, userId: ID, message: "hi", read: false, createdAt: T };
    const notifications = fake({
      listForUser: () => [{ ...note, secret: LEAK }],
    });
    app = await appWith((a) => a.register(notificationRoutes, { notifications, auth: signedIn }));
    const res = await get("/api/notifications");
    expect(res.body).not.toContain(LEAK);
    expect(res.json()).toEqual({ notifications: [note] });
  });

  it("ratings: GET /api/events/:id/rating", async () => {
    const one = { get: () => ({ ...rating, secret: LEAK }) };
    app = await appWith((a) =>
      a.register(ratingRoutes, {
        ratings: fake({ event: one, host: one }),
        auth: signedIn,
        eventExists: () => true,
        userExists: () => true,
      }),
    );
    const res = await get(`/api/events/${ID}/rating`);
    expect(res.body).not.toContain(LEAK);
    expect(res.json()).toEqual(rating);
  });

  it("integrations: GET /api/weather", async () => {
    const weather = fake({
      get: async () => ({ description: "Sunny", icon: "x", mock: true, secret: LEAK }),
    });
    app = await appWith((a) => a.register(integrationRoutes, { weather, auth: signedIn }));
    const res = await get("/api/weather?lat=1&lng=2");
    expect(res.body).not.toContain(LEAK);
    expect(res.json()).toEqual({ description: "Sunny", icon: "x", mock: true });
  });
});

describe("a reply that fails its response schema", () => {
  it("is a 500 internal_error with no detail", async () => {
    const users = fake({
      findById: () => ({ ...user, id: `not-a-uuid-${LEAK}` }),
    });
    app = await appWith((a) => a.register(authRoutes, { users, mailer: fake({}), auth: signedIn }));
    const res = await get("/api/auth/me");
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ error: "internal_error" });
    expect(res.body).not.toContain(LEAK);
  });
});
