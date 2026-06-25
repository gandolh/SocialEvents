import { z } from "zod";
import { idSchema, isoDateTimeSchema } from "./common.js";

export const notificationSchema = z.object({
  id: idSchema,
  userId: idSchema,
  message: z.string(),
  read: z.boolean(),
  createdAt: isoDateTimeSchema,
});
export type Notification = z.infer<typeof notificationSchema>;

export const markNotificationSchema = z.object({
  read: z.boolean(),
});
export type MarkNotificationInput = z.infer<typeof markNotificationSchema>;
