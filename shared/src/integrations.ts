import { z } from "zod";

export const weatherSchema = z.object({
  description: z.string(),
  icon: z.string(),
  /** True when served by the mock implementation (no API key configured). */
  mock: z.boolean(),
});
export type Weather = z.infer<typeof weatherSchema>;

export const weatherQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});
export type WeatherQuery = z.infer<typeof weatherQuerySchema>;

export const mapsConfigSchema = z.object({
  enabled: z.boolean(),
});
export type MapsConfig = z.infer<typeof mapsConfigSchema>;
