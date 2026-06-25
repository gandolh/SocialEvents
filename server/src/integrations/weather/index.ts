import type { Weather } from "@socialevents/shared";
import { config } from "../../config/env.js";

const useReal = Boolean(config.weather.apiKey);
const TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  data: Weather;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();

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
  return { ...conditions[idx]!, mock: true };
}

async function fetchReal(lat: number, lng: number): Promise<Weather> {
  const params = new URLSearchParams({
    access_key: config.weather.apiKey!,
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

export async function getWeather(lat: number, lng: number): Promise<Weather> {
  const key = cacheKey(lat, lng);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < TTL_MS) {
    return cached.data;
  }

  let data: Weather;
  if (useReal) {
    try {
      data = await fetchReal(lat, lng);
    } catch {
      data = mockWeather(lat, lng); // graceful fallback on provider error
    }
  } else {
    data = mockWeather(lat, lng);
  }

  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

export function weatherMode(): "live" | "mock" {
  return useReal ? "live" : "mock";
}

/** Test helper. */
export function _clearWeatherCache(): void {
  cache.clear();
}
