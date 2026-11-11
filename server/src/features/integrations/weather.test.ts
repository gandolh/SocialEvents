import { describe, it, expect, beforeEach } from "vitest";
import { createWeather } from "./weather.js";

let weather = createWeather({ apiKey: null });

beforeEach(() => {
  weather = createWeather({ apiKey: null });
});

describe("weather (mock mode)", () => {
  it("runs in mock mode when no key is configured", () => {
    expect(weather.mode).toBe("mock");
  });

  it("returns deterministic mock weather for the same coords", async () => {
    const a = await weather.get(45.7, 21.2);
    const b = await weather.get(45.7, 21.2);
    expect(a.mock).toBe(true);
    expect(a.description).toBe(b.description);
    expect(a.icon).toBeTruthy();
  });

  it("caches by rounded coordinates", async () => {
    const a = await weather.get(45.7, 21.2);
    const b = await weather.get(45.701, 21.201); // same 2dp bucket
    expect(a.description).toBe(b.description);
  });
});
