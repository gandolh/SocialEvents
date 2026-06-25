import { z } from "zod";
import { idSchema, isoDateTimeSchema, attendeeStatusSchema } from "./common.js";
import { eventCategorySchema } from "./categories.js";

export const locationSchema = z.object({
  label: z.string().min(1).max(200),
  lat: z.number().min(-90).max(90).nullable(),
  lng: z.number().min(-180).max(180).nullable(),
});
export type EventLocation = z.infer<typeof locationSchema>;

/** An attendee as returned within an event (joined with user basics). */
export const attendeeSchema = z.object({
  userId: idSchema,
  name: z.string(),
  email: z.string(),
  status: attendeeStatusSchema,
});
export type Attendee = z.infer<typeof attendeeSchema>;

/** Aggregate rating (avg + count), computed on read. */
export const ratingAggregateSchema = z.object({
  average: z.number(),
  count: z.number().int(),
});
export type RatingAggregate = z.infer<typeof ratingAggregateSchema>;

/** Event as returned in list views (no attendee detail). */
export const eventSummarySchema = z.object({
  id: idSchema,
  name: z.string(),
  hostId: idSchema,
  hostName: z.string(),
  startsAt: isoDateTimeSchema,
  category: eventCategorySchema,
  description: z.string(),
  location: locationSchema,
  attendeeCount: z.number().int(),
  createdAt: isoDateTimeSchema,
});
export type EventSummary = z.infer<typeof eventSummarySchema>;

/** Full event detail. */
export const eventDetailSchema = eventSummarySchema.extend({
  attendees: z.array(attendeeSchema),
  rating: ratingAggregateSchema,
});
export type EventDetail = z.infer<typeof eventDetailSchema>;

export const createEventSchema = z.object({
  name: z.string().trim().min(1).max(160),
  startsAt: isoDateTimeSchema,
  description: z.string().max(2000).default(""),
  category: eventCategorySchema,
  location: locationSchema,
  attendeeUserIds: z.array(idSchema).default([]),
  attendeeDepartmentIds: z.array(idSchema).default([]),
});
export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  startsAt: isoDateTimeSchema.optional(),
  description: z.string().max(2000).optional(),
  category: eventCategorySchema.optional(),
  location: locationSchema.optional(),
  attendeeUserIds: z.array(idSchema).optional(),
  attendeeDepartmentIds: z.array(idSchema).optional(),
});
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

/** Query filters for GET /events. */
export const eventQuerySchema = z.object({
  from: isoDateTimeSchema.optional(),
  to: isoDateTimeSchema.optional(),
  category: eventCategorySchema.optional(),
  hostId: idSchema.optional(),
  attendeeId: idSchema.optional(),
  search: z.string().max(160).optional(),
});
export type EventQuery = z.infer<typeof eventQuerySchema>;

export const rsvpSchema = z.object({
  status: attendeeStatusSchema,
});
export type RsvpInput = z.infer<typeof rsvpSchema>;
