import { z } from "zod";
import { idSchema, isoDateTimeSchema } from "./common.js";

export const departmentSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(80),
  createdAt: isoDateTimeSchema,
});
export type Department = z.infer<typeof departmentSchema>;

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(1).max(80),
});
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
