import type { FastifyInstance } from "fastify";
import { createDepartmentSchema, idSchema } from "@socialevents/shared";
import { z } from "zod";
import { requireAuth, requireAdmin } from "../auth/guards.js";
import { departmentsRepo } from "../dal/departments.js";
import { conflict, notFound } from "../http/errors.js";

const idParamsSchema = z.object({ id: idSchema });

export async function departmentRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", { preHandler: requireAuth }, async () => {
    return { departments: departmentsRepo.list() };
  });

  app.post("/", { preHandler: requireAdmin }, async (request, reply) => {
    const { name } = createDepartmentSchema.parse(request.body);
    if (departmentsRepo.findByName(name)) throw conflict("department exists");
    const department = departmentsRepo.create(name);
    return reply.code(201).send({ department });
  });

  app.delete("/:id", { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = idParamsSchema.parse(request.params);
    if (!departmentsRepo.remove(id)) throw notFound("department not found");
    return reply.code(204).send();
  });
}
