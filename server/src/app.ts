import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import { config } from "./config/env.js";
import { HttpError } from "./http/errors.js";
import { authRoutes } from "./routes/auth.js";
import { userRoutes } from "./routes/users.js";
import { hostRatingRoutes } from "./routes/ratings.js";
import { departmentRoutes } from "./routes/departments.js";
import { eventRoutes } from "./routes/events.js";
import { notificationRoutes } from "./routes/notifications.js";
import { integrationRoutes } from "./routes/integrations.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.isTest
      ? false
      : { transport: undefined, level: config.isProd ? "info" : "debug" },
  });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cookie);
  if (config.clientOrigin) {
    await app.register(cors, {
      origin: config.clientOrigin,
      credentials: true,
    });
  }
  await app.register(rateLimit, { global: false });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply
        .code(400)
        .send({ error: "validation_error", message: error.issues[0]?.message });
    }
    if (error instanceof HttpError) {
      return reply
        .code(error.statusCode)
        .send({ error: error.errorCode, message: error.message });
    }
    if ((error as { statusCode?: number }).statusCode === 429) {
      return reply.code(429).send({ error: "rate_limited" });
    }
    app.log.error(error);
    return reply.code(500).send({ error: "internal_error" });
  });

  // Stricter rate limit on auth endpoints.
  await app.register(
    async (authApp) => {
      await authApp.register(rateLimit, {
        max: 20,
        timeWindow: "1 minute",
      });
      await authApp.register(authRoutes);
    },
    { prefix: "/api/auth" },
  );

  await app.register(userRoutes, { prefix: "/api/users" });
  await app.register(hostRatingRoutes, { prefix: "/api/users" });
  await app.register(departmentRoutes, { prefix: "/api/departments" });
  await app.register(eventRoutes, { prefix: "/api/events" });
  await app.register(notificationRoutes, { prefix: "/api/notifications" });
  await app.register(integrationRoutes, { prefix: "/api" });

  app.get("/api/health", async () => ({ status: "ok" }));

  return app;
}
