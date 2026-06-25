import type { FastifyInstance } from "fastify";
import { weatherQuerySchema } from "@socialevents/shared";
import { requireAuth } from "../auth/guards.js";
import { getWeather } from "../integrations/weather/index.js";
import { getMapsConfig } from "../integrations/maps/index.js";

export async function integrationRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireAuth);

  app.get("/weather", async (request) => {
    const { lat, lng } = weatherQuerySchema.parse(request.query);
    return getWeather(lat, lng);
  });

  app.get("/maps/config", async () => {
    return getMapsConfig();
  });
}
