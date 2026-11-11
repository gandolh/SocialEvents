import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  const env = { JWT_SECRET: "test-secret-test-secret-0123456789" };

  it("fills the defaults, and an empty TRUST_PROXY counts as unset", () => {
    const config = loadConfig({ ...env, TRUST_PROXY: "" });
    expect(config).toMatchObject({ port: 3001, trustProxy: false, isProd: false, weather: { apiKey: null } });
  });

  it("reads TRUST_PROXY=true", () => {
    expect(loadConfig({ ...env, TRUST_PROXY: "true" }).trustProxy).toBe(true);
  });

  it("throws on a setting that is not valid", () => {
    expect(() => loadConfig({ ...env, PORT: "abc" })).toThrow();
    expect(() => loadConfig({ ...env, TRUST_PROXY: "yes" })).toThrow();
  });

  it("requires a long enough JWT_SECRET in production", () => {
    expect(() => loadConfig({ NODE_ENV: "production", JWT_SECRET: "short" })).toThrow(/JWT_SECRET/);
  });
});
