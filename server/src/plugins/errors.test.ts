import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import { forbidden } from "../lib/http-error.js";
import { freshDb, testConfig } from "../testing/helpers.js";

describe("the error handler", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp(testConfig(), { db: freshDb() });
    app.get("/boom", () => {
      throw new Error("secret detail: /home/someone/.env");
    });
    app.get("/denied", () => {
      throw forbidden();
    });
  });
  afterEach(async () => {
    await app.close();
  });

  it("answers a malformed JSON body with 400 bad_request, not a 500", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      headers: { "content-type": "application/json" },
      payload: "{",
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ error: "bad_request" });
  });

  it("answers an unsupported content type with 415", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      payload: "a=b",
    });
    expect(res.statusCode).toBe(415);
    expect(res.json()).toMatchObject({ error: "unsupported_media_type" });
  });

  it("answers a thrown plain Error with 500 internal_error and no detail", async () => {
    const res = await app.inject({ method: "GET", url: "/boom" });
    expect(res.statusCode).toBe(500);
    expect(res.json()).toEqual({ error: "internal_error" });
    expect(res.body).not.toContain("secret");
  });

  it("answers an HttpError with its status and code", async () => {
    const res = await app.inject({ method: "GET", url: "/denied" });
    expect(res.statusCode).toBe(403);
    expect(res.json()).toEqual({ error: "forbidden", message: "forbidden" });
  });

  it("answers an unknown route with a JSON 404, and a scanner with 429", async () => {
    const res = await app.inject({ method: "GET", url: "/api/nothing" });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: "not_found" });
    for (let i = 1; i < 60; i++) await app.inject({ method: "GET", url: `/api/nothing-${i}` });
    const limited = await app.inject({ method: "GET", url: "/api/nothing-else" });
    expect(limited.statusCode).toBe(429);
    expect(limited.json()).toEqual({ error: "rate_limited" });
  });
});
