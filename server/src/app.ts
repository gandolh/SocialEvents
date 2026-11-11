import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { serializerCompiler, validatorCompiler } from "@fastify/type-provider-zod";
import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import type { Config } from "./config.js";
import { openDb, type Db } from "./db/connection.js";
import { runMigrations } from "./db/migrate.js";
import { authRoutes } from "./features/auth/index.js";
import { createDepartmentsStore, departmentRoutes } from "./features/departments/index.js";
import { createEventsStore, eventRoutes } from "./features/events/index.js";
import { healthRoutes } from "./features/health/index.js";
import { createWeather, integrationRoutes } from "./features/integrations/index.js";
import { createMailer, createNotificationsStore, notificationRoutes } from "./features/notifications/index.js";
import { createRatingsStore, ratingRoutes } from "./features/ratings/index.js";
import { createUsersStore, userRoutes } from "./features/users/index.js";
import { createAuth } from "./plugins/auth/index.js";
import { clientStatic } from "./plugins/client-static.js";
import { errors, jsonNotFound, setRateLimitedNotFound } from "./plugins/errors.js";

/** Fastify's options that belong to the process: `server.ts` sets them, a test leaves them out. */
type ServerOptions = Pick<FastifyServerOptions, "logger" | "trustProxy" | "connectionTimeout" | "requestTimeout">;

export interface BuildAppOptions {
  server?: ServerOptions;
  /** The built client's folder: given, the app serves it and answers an unknown non-API path with `index.html`. */
  clientDist?: string;
  /** An open, migrated database to use instead of opening `config.databasePath`. The app closes it. */
  db?: Db;
}

/**
 * The app, ready to listen and not listening. Registration order is the architecture: the error handler, the
 * external plugins, then the features, each handed what it needs as plugin options. Closing the app closes the
 * database.
 */
export async function buildApp(config: Config, options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify(options.server);
  // Zod checks every request and encodes every reply, in every plugin registered below.
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const db = options.db ?? openDb(config.databasePath);
  const applied = runMigrations(db);
  if (applied.length) app.log.info(`[migrate] applied: ${applied.join(", ")}`);
  app.addHook("onClose", async () => {
    db.close();
  });

  // The error handler goes first, so every route and plugin below answers through it.
  await app.register(errors);

  // External plugins.
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cookie);
  if (config.clientOrigin) {
    await app.register(cors, {
      origin: config.clientOrigin,
      credentials: true,
    });
  }
  await app.register(rateLimit, { global: false });

  // What the features are handed, built once. Stores take the database; nothing else reaches for it.
  const users = createUsersStore(db);
  const departments = createDepartmentsStore(db);
  const events = createEventsStore(db);
  const ratings = createRatingsStore(db);
  const notifications = createNotificationsStore(db);
  const mailer = createMailer(config.smtp, app.log);
  const weather = createWeather(config.weather);
  const auth = createAuth(config);
  const context = {
    users,
    departments,
    events,
    ratings,
    notifications,
    mailer,
    weather,
    auth,
    eventExists: (id: string) => events.findSummaryById(id) !== null,
    userExists: (id: string) => users.findById(id) !== null,
  };

  // The features, each encapsulated: its hooks stay inside it.
  await app.register(healthRoutes);
  await app.register(authRoutes, context);
  await app.register(userRoutes, context);
  await app.register(departmentRoutes, context);
  await app.register(eventRoutes, context);
  await app.register(ratingRoutes, context);
  await app.register(notificationRoutes, context);
  await app.register(integrationRoutes, context);

  // Last: the client's files when a build is present, and the one 404 handler either way.
  if (options.clientDist) await app.register(clientStatic, { root: options.clientDist });
  else setRateLimitedNotFound(app, jsonNotFound);

  return app;
}
