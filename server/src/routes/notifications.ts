import type { FastifyInstance } from "fastify";
import { markNotificationSchema, idSchema } from "@socialevents/shared";
import { z } from "zod";
import { requireAuth, currentUser } from "../auth/guards.js";
import { notificationsRepo } from "../dal/notifications.js";
import { forbidden, notFound } from "../http/errors.js";

const idParamsSchema = z.object({ id: idSchema });

export async function notificationRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireAuth);

  app.get("/", async (request) => {
    const me = currentUser(request);
    return { notifications: notificationsRepo.listForUser(me.sub) };
  });

  app.patch("/:id", async (request, reply) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    const notif = notificationsRepo.findById(id);
    if (!notif) throw notFound("notification not found");
    if (notif.userId !== me.sub) throw forbidden();
    const { read } = markNotificationSchema.parse(request.body);
    notificationsRepo.setRead(id, read);
    return reply.code(204).send();
  });

  app.delete("/:id", async (request, reply) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    const notif = notificationsRepo.findById(id);
    if (!notif) throw notFound("notification not found");
    if (notif.userId !== me.sub) throw forbidden();
    notificationsRepo.remove(id);
    return reply.code(204).send();
  });
}
