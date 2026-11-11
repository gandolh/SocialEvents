import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import { freshDb, testConfig } from "../testing/helpers.js";

describe("the client static plugin", () => {
  let app: FastifyInstance;
  let root: string;

  beforeEach(async () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "se-client-"));
    fs.writeFileSync(path.join(root, "index.html"), "<!doctype html><title>client</title>");
    app = await buildApp(testConfig(), { db: freshDb(), clientDist: root });
  });
  afterEach(async () => {
    await app.close();
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("answers an unknown path under /api with a JSON 404", async () => {
    const res = await app.inject({ method: "GET", url: "/api/nothing" });
    expect(res.statusCode).toBe(404);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.json()).toEqual({ error: "not_found" });
  });

  it("serves index.html for any other unknown path, so the client's router can take it", async () => {
    const res = await app.inject({ method: "GET", url: "/events/42" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("<title>client</title>");
  });
});
