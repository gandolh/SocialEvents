import rateLimit from "@fastify/rate-limit";
import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { authResponseSchema, loginSchema, registerSchema } from "@socialevents/shared";
import { z } from "zod";
import { notFound } from "../../lib/http-error.js";
import { currentUser, type Auth } from "../../plugins/auth/index.js";
import type { Mailer } from "../notifications/index.js";
import type { UsersStore } from "../users/index.js";
import { createAuthService } from "./service.js";

/** What this feature takes from the app's context. */
export interface AuthOptions {
  users: UsersStore;
  mailer: Mailer;
  auth: Auth;
}

export const authRoutes: FastifyPluginAsyncZod<AuthOptions> = async (app, { users, mailer, auth }) => {
  const service = createAuthService({ users, mailer });

  // Stricter rate limit on the auth endpoints, inside this feature only.
  await app.register(rateLimit, {
    max: 20,
    timeWindow: "1 minute",
  });

  app.post(
    "/api/auth/register",
    { schema: { body: registerSchema, response: { 201: authResponseSchema } } },
    async (request, reply) => {
      const user = await service.register(request.body);
      auth.startSession(reply, { sub: user.id, role: user.role, name: user.name, email: user.email });
      reply.code(201);
      return { user };
    },
  );

  app.post(
    "/api/auth/login",
    { schema: { body: loginSchema, response: { 200: authResponseSchema } } },
    async (request, reply) => {
      const user = await service.login(request.body);
      auth.startSession(reply, { sub: user.id, role: user.role, name: user.name, email: user.email });
      return { user };
    },
  );

  app.post("/api/auth/logout", { schema: { response: { 204: z.null() } } }, (_request, reply) => {
    auth.endSession(reply);
    reply.code(204);
    return null;
  });

  app.get(
    "/api/auth/me",
    { preValidation: auth.requireAuth, schema: { response: { 200: authResponseSchema } } },
    (request) => {
      const claims = currentUser(request);
      const user = users.findById(claims.sub);
      if (!user) throw notFound("user not found");
      return { user };
    },
  );
};
