import type { FastifyInstance } from "fastify";
import {
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
  setRatingSchema,
  rsvpSchema,
  idSchema,
} from "@socialevents/shared";
import { z } from "zod";
import { requireAuth, currentUser } from "../auth/guards.js";
import { eventsRepo } from "../dal/events.js";
import { eventRatingsRepo } from "../dal/ratings.js";
import { createEvent, updateEvent, deleteEvent } from "../services/eventService.js";
import { notFound } from "../http/errors.js";

const idParamsSchema = z.object({ id: idSchema });

export async function eventRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireAuth);

  app.get("/", async (request) => {
    const q = eventQuerySchema.parse(request.query);
    return { events: eventsRepo.list(q) };
  });

  app.get("/:id", async (request) => {
    const { id } = idParamsSchema.parse(request.params);
    const event = eventsRepo.findDetailById(id);
    if (!event) throw notFound("event not found");
    return { event };
  });

  app.post("/", async (request, reply) => {
    const me = currentUser(request);
    const input = createEventSchema.parse(request.body);
    const event = await createEvent({ id: me.sub, role: me.role }, input);
    return reply.code(201).send({ event });
  });

  app.patch("/:id", async (request) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    const input = updateEventSchema.parse(request.body);
    const event = updateEvent({ id: me.sub, role: me.role }, id, input);
    return { event };
  });

  app.delete("/:id", async (request, reply) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    deleteEvent({ id: me.sub, role: me.role }, id);
    return reply.code(204).send();
  });

  // --- RSVP ---
  app.put("/:id/rsvp", async (request) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    const { status } = rsvpSchema.parse(request.body);
    if (!eventsRepo.setRsvp(id, me.sub, status)) {
      throw notFound("you are not an attendee of this event");
    }
    return { status };
  });

  // --- Event ratings ---
  app.get("/:id/rating", async (request) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    return eventRatingsRepo.get(id, me.sub);
  });

  app.put("/:id/rating", async (request) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    if (!eventsRepo.findSummaryById(id)) throw notFound("event not found");
    const { rating } = setRatingSchema.parse(request.body);
    return eventRatingsRepo.set(id, me.sub, rating);
  });

  app.delete("/:id/rating", async (request) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    return eventRatingsRepo.remove(id, me.sub);
  });
}
