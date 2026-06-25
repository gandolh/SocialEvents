import type { FastifyInstance } from "fastify";
import {
  updateProfileSchema,
  changePasswordSchema,
  assignDepartmentSchema,
  idSchema,
} from "@socialevents/shared";
import { z } from "zod";
import { requireAuth, requireAdmin, currentUser } from "../auth/guards.js";
import { usersRepo } from "../dal/users.js";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { notFound, unauthorized } from "../http/errors.js";

const listQuerySchema = z.object({ departmentId: idSchema.optional() });
const idParamsSchema = z.object({ id: idSchema });

export async function userRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", { preHandler: requireAuth }, async (request) => {
    const { departmentId } = listQuerySchema.parse(request.query);
    return { users: usersRepo.list(departmentId) };
  });

  app.patch("/me", { preHandler: requireAuth }, async (request) => {
    const me = currentUser(request);
    const input = updateProfileSchema.parse(request.body);
    const user = usersRepo.updateProfile(me.sub, {
      name: input.name,
      jobTitle: input.jobTitle,
    });
    if (!user) throw notFound("user not found");
    return { user };
  });

  app.patch("/me/password", { preHandler: requireAuth }, async (request, reply) => {
    const me = currentUser(request);
    const input = changePasswordSchema.parse(request.body);
    const hash = usersRepo.findPasswordHash(me.sub);
    if (!hash) throw notFound("user not found");
    if (!(await verifyPassword(input.currentPassword, hash))) {
      throw unauthorized();
    }
    usersRepo.updatePasswordHash(me.sub, await hashPassword(input.newPassword));
    return reply.code(204).send();
  });

  // :id routes after /me to avoid shadowing.
  app.get("/:id", { preHandler: requireAuth }, async (request) => {
    const { id } = idParamsSchema.parse(request.params);
    const user = usersRepo.findById(id);
    if (!user) throw notFound("user not found");
    return { user };
  });

  app.patch("/:id/department", { preHandler: requireAdmin }, async (request) => {
    const { id } = idParamsSchema.parse(request.params);
    const { departmentId } = assignDepartmentSchema.parse(request.body);
    const user = usersRepo.setDepartment(id, departmentId);
    if (!user) throw notFound("user not found");
    return { user };
  });
}
