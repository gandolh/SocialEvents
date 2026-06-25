import { describe, it, expect, beforeEach } from "vitest";
import { getWeather, weatherMode, _clearWeatherCache } from "./index.js";

beforeEach(() => {
  _clearWeatherCache();
});

describe("weather (mock mode)", () => {
  it("runs in mock mode when no key is configured", () => {
    expect(weatherMode()).toBe("mock");
  });

  it("returns deterministic mock weather for the same coords", async () => {
    const a = await getWeather(45.7, 21.2);
    const b = await getWeather(45.7, 21.2);
    expect(a.mock).toBe(true);
    expect(a.description).toBe(b.description);
    expect(a.icon).toBeTruthy();
  });

  it("caches by rounded coordinates", async () => {
    const a = await getWeather(45.700, 21.200);
    const b = await getWeather(45.701, 21.201); // same 2dp bucket
    expect(a.description).toBe(b.description);
  });
});
