import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config.js";
import { clientStatic } from "./plugins/client-static.js";
import { errors, jsonNotFound, setRateLimitedNotFound } from "./plugins/errors.js";
import { authRoutes } from "./routes/auth.js";
import { userRoutes } from "./routes/users.js";
import { hostRatingRoutes } from "./routes/ratings.js";
import { departmentRoutes } from "./routes/departments.js";
import { eventRoutes } from "./routes/events.js";
import { notificationRoutes } from "./routes/notifications.js";
import { integrationRoutes } from "./routes/integrations.js";

/** Fastify's options that belong to the process: `server.ts` sets them, a test leaves them out. */
export type ServerOptions = Pick<FastifyServerOptions, "logger" | "trustProxy" | "connectionTimeout" | "requestTimeout">;

export interface BuildAppOptions {
  server?: ServerOptions;
  /** The built client's folder: given, the app serves it and answers an unknown non-API path with `index.html`. */
  clientDist?: string;
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify(options.server);

  // The error handler goes first, so every route and plugin below answers through it.
  await app.register(errors);
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cookie);
  if (config.clientOrigin) {
    await app.register(cors, {
      origin: config.clientOrigin,
      credentials: true,
    });
  }
  await app.register(rateLimit, { global: false });

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

  if (options.clientDist) await app.register(clientStatic, { root: options.clientDist });
  else setRateLimitedNotFound(app, jsonNotFound);

  return app;
}
