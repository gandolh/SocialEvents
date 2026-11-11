import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { idParamsSchema, markNotificationSchema, notificationListResponseSchema } from "@socialevents/shared";
import { z } from "zod";
import { forbidden, notFound } from "../../lib/http-error.js";
import { currentUser, type Auth } from "../../plugins/auth/index.js";
import type { NotificationsStore } from "./store.js";

/** What this feature takes from the app's context. */
export interface NotificationsOptions {
  notifications: NotificationsStore;
  auth: Auth;
}

export const notificationRoutes: FastifyPluginAsyncZod<NotificationsOptions> = async (app, { notifications, auth }) => {
  // Every route here needs a session, checked before the request is validated.
  app.addHook("preValidation", auth.requireAuth);

  app.get("/api/notifications", { schema: { response: { 200: notificationListResponseSchema } } }, (request) => {
    const me = currentUser(request);
    return { notifications: notifications.listForUser(me.sub) };
  });

  app.patch(
    "/api/notifications/:id",
    { schema: { params: idParamsSchema, body: markNotificationSchema, response: { 204: z.null() } } },
    (request, reply) => {
      const me = currentUser(request);
      const { id } = request.params;
      const notif = notifications.findById(id);
      if (!notif) throw notFound("notification not found");
      if (notif.userId !== me.sub) throw forbidden();
      notifications.setRead(id, request.body.read);
      reply.code(204);
      return null;
    },
  );

  app.delete(
    "/api/notifications/:id",
    { schema: { params: idParamsSchema, response: { 204: z.null() } } },
    (request, reply) => {
      const me = currentUser(request);
      const { id } = request.params;
      const notif = notifications.findById(id);
      if (!notif) throw notFound("notification not found");
      if (notif.userId !== me.sub) throw forbidden();
      notifications.remove(id);
      reply.code(204);
      return null;
    },
  );
};
