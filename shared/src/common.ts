import { z } from "zod";

/** App-generated UUID identifier. */
export const idSchema = z.string().uuid();

/** ISO-8601 UTC timestamp string. */
export const isoDateTimeSchema = z.string().datetime({ offset: true });

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(254);

export const passwordSchema = z.string().min(8).max(128);

export const ratingValueSchema = z.number().int().min(1).max(5);

export const userRoleSchema = z.enum(["user", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const attendeeStatusSchema = z.enum(["invited", "accepted", "declined"]);
export type AttendeeStatus = z.infer<typeof attendeeStatusSchema>;

/** Standard error response body. */
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
});
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
