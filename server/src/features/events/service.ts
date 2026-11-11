import type { CreateEventInput, UpdateEventInput, EventDetail } from "@socialevents/shared";
import { conflict, forbidden, notFound } from "../../lib/http-error.js";
import type { DepartmentsStore } from "../departments/index.js";
import type { Mailer, NotificationsStore } from "../notifications/index.js";
import type { UsersStore } from "../users/index.js";
import type { EventsStore } from "./store.js";

interface Actor {
  id: string;
  role: "user" | "admin";
}

export interface EventServiceDeps {
  events: EventsStore;
  departments: DepartmentsStore;
  users: UsersStore;
  notifications: NotificationsStore;
  mailer: Mailer;
}

function assertCanMutate(actor: Actor, hostId: string): void {
  if (actor.role !== "admin" && actor.id !== hostId) throw forbidden();
}

/** Creating, changing and deleting events, with the invites that go with them. */
export function createEventService({ events, departments, users, notifications, mailer }: EventServiceDeps) {
  /** Expand explicit user ids + department member ids into a unique set. */
  function resolveAttendees(userIds: string[], departmentIds: string[]): string[] {
    const fromDepts = departments.memberIds(departmentIds);
    return [...new Set([...userIds, ...fromDepts])];
  }

  return {
    async createEvent(actor: Actor, input: CreateEventInput): Promise<EventDetail> {
      const dup = events.findDuplicate(actor.id, input.name, input.startsAt, input.location.label);
      if (dup) throw conflict("an identical event already exists");

      const attendeeIds = resolveAttendees(input.attendeeUserIds, input.attendeeDepartmentIds).filter(
        (id) => id !== actor.id,
      ); // host isn't an attendee of their own event

      const event = events.create({
        name: input.name,
        hostId: actor.id,
        startsAt: input.startsAt,
        description: input.description,
        category: input.category,
        location: input.location,
        attendeeUserIds: attendeeIds,
      });

      // In-app notifications + email invites (fire-and-forget for email).
      if (attendeeIds.length > 0) {
        notifications.createMany(attendeeIds, `You were invited to "${event.name}"`);
        for (const uid of attendeeIds) {
          const u = users.findById(uid);
          if (!u) continue;
          void mailer.send({
            to: u.email,
            subject: `SocialEvents — invite: ${event.name}`,
            html:
              `<p>Hi ${u.name},</p>` +
              `<p>You've been invited to <strong>${event.name}</strong>.</p>` +
              `<ul>` +
              `<li>When: ${event.startsAt}</li>` +
              `<li>Where: ${event.location.label}</li>` +
              `<li>Host: ${event.hostName}</li>` +
              (event.description ? `<li>Details: ${event.description}</li>` : "") +
              `</ul>` +
              `<p>Hope to see you there,<br/>The SocialEvents team</p>`,
          });
        }
      }

      return event;
    },

    updateEvent(actor: Actor, eventId: string, input: UpdateEventInput): EventDetail {
      const existing = events.findSummaryById(eventId);
      if (!existing) throw notFound("event not found");
      assertCanMutate(actor, existing.hostId);

      const updated = events.update(eventId, {
        name: input.name,
        startsAt: input.startsAt,
        description: input.description,
        category: input.category,
        location: input.location,
      });
      if (!updated) throw notFound("event not found");

      if (input.attendeeUserIds !== undefined || input.attendeeDepartmentIds !== undefined) {
        const ids = resolveAttendees(input.attendeeUserIds ?? [], input.attendeeDepartmentIds ?? []).filter(
          (id) => id !== existing.hostId,
        );
        events.setAttendees(eventId, ids);
      }

      const detail = events.findDetailById(eventId);
      if (!detail) throw notFound("event not found");
      return detail;
    },

    deleteEvent(actor: Actor, eventId: string): void {
      const existing = events.findSummaryById(eventId);
      if (!existing) throw notFound("event not found");
      assertCanMutate(actor, existing.hostId);
      events.remove(eventId);
    },
  };
}
