import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import {
  createDepartmentSchema,
  departmentListResponseSchema,
  departmentResponseSchema,
  idParamsSchema,
} from "@socialevents/shared";
import { z } from "zod";
import { conflict, notFound } from "../../lib/http-error.js";
import type { Auth } from "../../plugins/auth/index.js";
import type { DepartmentsStore } from "./store.js";

/** What this feature takes from the app's context. */
export interface DepartmentsOptions {
  departments: DepartmentsStore;
  auth: Auth;
}

export const departmentRoutes: FastifyPluginAsyncZod<DepartmentsOptions> = async (app, { departments, auth }) => {
  app.get(
    "/api/departments",
    { preValidation: auth.requireAuth, schema: { response: { 200: departmentListResponseSchema } } },
    () => ({ departments: departments.list() }),
  );

  app.post(
    "/api/departments",
    {
      preValidation: auth.requireAdmin,
      schema: { body: createDepartmentSchema, response: { 201: departmentResponseSchema } },
    },
    (request, reply) => {
      const { name } = request.body;
      if (departments.findByName(name)) throw conflict("department exists");
      const department = departments.create(name);
      reply.code(201);
      return { department };
    },
  );

  app.delete(
    "/api/departments/:id",
    { preValidation: auth.requireAdmin, schema: { params: idParamsSchema, response: { 204: z.null() } } },
    (request, reply) => {
      if (!departments.remove(request.params.id)) throw notFound("department not found");
      reply.code(204);
      return null;
    },
  );
};
