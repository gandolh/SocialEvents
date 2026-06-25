import { z } from "zod";
import { idSchema, emailSchema, userRoleSchema, isoDateTimeSchema } from "./common.js";

/** Public user shape (never includes password hash). */
export const userSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(120),
  email: emailSchema,
  role: userRoleSchema,
  departmentId: idSchema.nullable(),
  jobTitle: z.string().max(120).nullable(),
  createdAt: isoDateTimeSchema,
});
export type User = z.infer<typeof userSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  jobTitle: z.string().max(120).nullable().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const assignDepartmentSchema = z.object({
  departmentId: idSchema.nullable(),
});
export type AssignDepartmentInput = z.infer<typeof assignDepartmentSchema>;
