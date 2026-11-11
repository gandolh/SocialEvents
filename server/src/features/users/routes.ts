import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import {
  assignDepartmentSchema,
  authResponseSchema,
  changePasswordSchema,
  idParamsSchema,
  idSchema,
  updateProfileSchema,
  userListResponseSchema,
} from "@socialevents/shared";
import { z } from "zod";
import { notFound, unauthorized } from "../../lib/http-error.js";
import { currentUser, hashPassword, verifyPassword, type Auth } from "../../plugins/auth/index.js";
import type { UsersStore } from "./store.js";

/** What this feature takes from the app's context. */
export interface UsersOptions {
  users: UsersStore;
  auth: Auth;
}

const listQuerySchema = z.object({ departmentId: idSchema.optional() });

export const userRoutes: FastifyPluginAsyncZod<UsersOptions> = async (app, { users, auth }) => {
  const { requireAuth, requireAdmin } = auth;

  app.get(
    "/api/users",
    { preValidation: requireAuth, schema: { querystring: listQuerySchema, response: { 200: userListResponseSchema } } },
    (request) => ({ users: users.list(request.query.departmentId) }),
  );

  app.patch(
    "/api/users/me",
    { preValidation: requireAuth, schema: { body: updateProfileSchema, response: { 200: authResponseSchema } } },
    (request) => {
      const me = currentUser(request);
      const input = request.body;
      const user = users.updateProfile(me.sub, {
        name: input.name,
        jobTitle: input.jobTitle,
      });
      if (!user) throw notFound("user not found");
      return { user };
    },
  );

  app.patch(
    "/api/users/me/password",
    { preValidation: requireAuth, schema: { body: changePasswordSchema, response: { 204: z.null() } } },
    async (request, reply) => {
      const me = currentUser(request);
      const input = request.body;
      const hash = users.findPasswordHash(me.sub);
      if (!hash) throw notFound("user not found");
      if (!(await verifyPassword(input.currentPassword, hash))) {
        throw unauthorized();
      }
      users.updatePasswordHash(me.sub, await hashPassword(input.newPassword));
      reply.code(204);
      return null;
    },
  );

  // :id routes after /me to avoid shadowing.
  app.get(
    "/api/users/:id",
    { preValidation: requireAuth, schema: { params: idParamsSchema, response: { 200: authResponseSchema } } },
    (request) => {
      const user = users.findById(request.params.id);
      if (!user) throw notFound("user not found");
      return { user };
    },
  );

  app.patch(
    "/api/users/:id/department",
    {
      preValidation: requireAdmin,
      schema: { params: idParamsSchema, body: assignDepartmentSchema, response: { 200: authResponseSchema } },
    },
    (request) => {
      const user = users.setDepartment(request.params.id, request.body.departmentId);
      if (!user) throw notFound("user not found");
      return { user };
    },
  );
};
