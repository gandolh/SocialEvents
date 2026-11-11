import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { mapsConfigSchema, weatherQuerySchema, weatherSchema } from "@socialevents/shared";
import type { Auth } from "../../plugins/auth/index.js";
import { getMapsConfig } from "./maps.js";
import type { WeatherService } from "./weather.js";

/** What this feature takes from the app's context. */
export interface IntegrationsOptions {
  weather: WeatherService;
  auth: Auth;
}

export const integrationRoutes: FastifyPluginAsyncZod<IntegrationsOptions> = async (app, { weather, auth }) => {
  // Every route here needs a session, checked before the request is validated.
  app.addHook("preValidation", auth.requireAuth);

  app.get(
    "/api/weather",
    { schema: { querystring: weatherQuerySchema, response: { 200: weatherSchema } } },
    (request) => weather.get(request.query.lat, request.query.lng),
  );

  app.get("/api/maps/config", { schema: { response: { 200: mapsConfigSchema } } }, () => getMapsConfig());
};
