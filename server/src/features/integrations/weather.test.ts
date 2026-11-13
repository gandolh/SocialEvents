import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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

describe("weather (live mode, provider hangs)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("aborts a hung call and falls back to the mock, fast", async () => {
    let seen: AbortSignal | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init?: RequestInit) => {
        seen = init?.signal ?? undefined;
        return new Promise((_resolve, reject) => {
          seen?.addEventListener("abort", () => reject(seen?.reason));
        });
      }),
    );
    const live = createWeather({ apiKey: "test-key" }, { timeoutMs: 50 });
    const started = Date.now();
    const result = await live.get(45.7, 21.2);
    expect(Date.now() - started).toBeLessThan(1000);
    expect(seen).toBeInstanceOf(AbortSignal);
    expect(result.mock).toBe(true);
    expect(result.description).toBeTruthy();
  });
});
