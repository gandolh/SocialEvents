import type { Weather } from "@socialevents/shared";
import type { Config } from "../../config.js";

const TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  data: Weather;
  timestamp: number;
}
function cacheKey(lat: number, lng: number): string {
  // Round to ~1km to share cache between nearby points.
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

function mockWeather(lat: number, lng: number): Weather {
  const conditions = [
    { description: "Sunny", icon: "☀️" },
    { description: "Partly cloudy", icon: "⛅" },
    { description: "Cloudy", icon: "☁️" },
    { description: "Light rain", icon: "🌦️" },
    { description: "Clear", icon: "🌤️" },
  ];
  // Deterministic pick from coordinates so the same place is stable.
  const idx = Math.abs(Math.round(lat + lng)) % conditions.length;
  const pick = conditions[idx];
  if (!pick) throw new Error("no weather conditions");
  return { ...pick, mock: true };
}

async function fetchReal(apiKey: string, lat: number, lng: number): Promise<Weather> {
  const params = new URLSearchParams({
    access_key: apiKey,
    query: `${lat},${lng}`,
  });
  const res = await fetch(`http://api.weatherstack.com/current?${params}`);
  if (!res.ok) throw new Error(`weather HTTP ${res.status}`);
  const data = (await res.json()) as {
    current?: { weather_descriptions?: string[]; weather_icons?: string[] };
  };
  return {
    description: data.current?.weather_descriptions?.[0] ?? "Unknown",
    icon: data.current?.weather_icons?.[0] ?? "",
    mock: false,
  };
}

/** The weather lookup, with a 24-hour cache. Live with an API key, a deterministic mock without. */
export function createWeather(settings: Config["weather"]) {
  const useReal = Boolean(settings.apiKey);
  const cache = new Map<string, CacheEntry>();

  async function get(lat: number, lng: number): Promise<Weather> {
    const key = cacheKey(lat, lng);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < TTL_MS) {
      return cached.data;
    }

    let data: Weather;
    const apiKey = settings.apiKey;
    if (useReal && apiKey) {
      try {
        data = await fetchReal(apiKey, lat, lng);
      } catch {
        data = mockWeather(lat, lng); // graceful fallback on provider error
      }
    } else {
      data = mockWeather(lat, lng);
    }

    cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  return { mode: useReal ? ("live" as const) : ("mock" as const), get };
}

export type WeatherService = ReturnType<typeof createWeather>;
