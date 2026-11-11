import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import {
  createEventSchema,
  eventListResponseSchema,
  eventQuerySchema,
  eventResponseSchema,
  idParamsSchema,
  rsvpSchema,
  updateEventSchema,
} from "@socialevents/shared";
import { z } from "zod";
import { notFound } from "../../lib/http-error.js";
import { currentUser, type Auth } from "../../plugins/auth/index.js";
import type { DepartmentsStore } from "../departments/index.js";
import type { Mailer, NotificationsStore } from "../notifications/index.js";
import type { UsersStore } from "../users/index.js";
import { createEventService } from "./service.js";
import type { EventsStore } from "./store.js";

/** What this feature takes from the app's context. */
export interface EventsOptions {
  events: EventsStore;
  departments: DepartmentsStore;
  users: UsersStore;
  notifications: NotificationsStore;
  mailer: Mailer;
  auth: Auth;
}

export const eventRoutes: FastifyPluginAsyncZod<EventsOptions> = async (app, options) => {
  const { events, auth } = options;
  const service = createEventService(options);

  // Every route here needs a session, checked before the request is validated.
  app.addHook("preValidation", auth.requireAuth);

  app.get(
    "/api/events",
    { schema: { querystring: eventQuerySchema, response: { 200: eventListResponseSchema } } },
    (request) => ({ events: events.list(request.query) }),
  );

  app.get(
    "/api/events/:id",
    { schema: { params: idParamsSchema, response: { 200: eventResponseSchema } } },
    (request) => {
      const event = events.findDetailById(request.params.id);
      if (!event) throw notFound("event not found");
      return { event };
    },
  );

  app.post(
    "/api/events",
    { schema: { body: createEventSchema, response: { 201: eventResponseSchema } } },
    async (request, reply) => {
      const me = currentUser(request);
      const event = await service.createEvent({ id: me.sub, role: me.role }, request.body);
      reply.code(201);
      return { event };
    },
  );

  app.patch(
    "/api/events/:id",
    { schema: { params: idParamsSchema, body: updateEventSchema, response: { 200: eventResponseSchema } } },
    (request) => {
      const me = currentUser(request);
      const event = service.updateEvent({ id: me.sub, role: me.role }, request.params.id, request.body);
      return { event };
    },
  );

  app.delete(
    "/api/events/:id",
    { schema: { params: idParamsSchema, response: { 204: z.null() } } },
    (request, reply) => {
      const me = currentUser(request);
      service.deleteEvent({ id: me.sub, role: me.role }, request.params.id);
      reply.code(204);
      return null;
    },
  );

  // --- RSVP ---
  app.put(
    "/api/events/:id/rsvp",
    { schema: { params: idParamsSchema, body: rsvpSchema, response: { 200: rsvpSchema } } },
    (request) => {
      const me = currentUser(request);
      const { status } = request.body;
      if (!events.setRsvp(request.params.id, me.sub, status)) {
        throw notFound("you are not an attendee of this event");
      }
      return { status };
    },
  );
};
