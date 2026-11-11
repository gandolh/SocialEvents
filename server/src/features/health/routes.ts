import { healthSchema } from "@socialevents/shared";
import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/api/health", { schema: { response: { 200: healthSchema } } }, () => ({ status: "ok" as const }));
};
