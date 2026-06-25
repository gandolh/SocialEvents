import type {
  CreateEventInput,
  UpdateEventInput,
  EventDetail,
} from "@socialevents/shared";
import { eventsRepo } from "../dal/events.js";
import { departmentsRepo } from "../dal/departments.js";
import { usersRepo } from "../dal/users.js";
import { notificationsRepo } from "../dal/notifications.js";
import { sendMail } from "../integrations/email/index.js";
import { conflict, forbidden, notFound } from "../http/errors.js";

interface Actor {
  id: string;
  role: "user" | "admin";
}

/** Expand explicit user ids + department member ids into a unique set. */
function resolveAttendees(
  userIds: string[],
  departmentIds: string[],
): string[] {
  const fromDepts = departmentsRepo.memberIds(departmentIds);
  return [...new Set([...userIds, ...fromDepts])];
}

export async function createEvent(
  actor: Actor,
  input: CreateEventInput,
): Promise<EventDetail> {
  const dup = eventsRepo.findDuplicate(
    actor.id,
    input.name,
    input.startsAt,
    input.location.label,
  );
  if (dup) throw conflict("an identical event already exists");

  const attendeeIds = resolveAttendees(
    input.attendeeUserIds,
    input.attendeeDepartmentIds,
  ).filter((id) => id !== actor.id); // host isn't an attendee of their own event

  const event = eventsRepo.create({
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
    notificationsRepo.createMany(
      attendeeIds,
      `You were invited to "${event.name}"`,
    );
    for (const uid of attendeeIds) {
      const u = usersRepo.findById(uid);
      if (!u) continue;
      void sendMail({
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
}

function assertCanMutate(actor: Actor, hostId: string): void {
  if (actor.role !== "admin" && actor.id !== hostId) throw forbidden();
}

export function updateEvent(
  actor: Actor,
  eventId: string,
  input: UpdateEventInput,
): EventDetail {
  const existing = eventsRepo.findSummaryById(eventId);
  if (!existing) throw notFound("event not found");
  assertCanMutate(actor, existing.hostId);

  const updated = eventsRepo.update(eventId, {
    name: input.name,
    startsAt: input.startsAt,
    description: input.description,
    category: input.category,
    location: input.location,
  });
  if (!updated) throw notFound("event not found");

  if (input.attendeeUserIds !== undefined || input.attendeeDepartmentIds !== undefined) {
    const ids = resolveAttendees(
      input.attendeeUserIds ?? [],
      input.attendeeDepartmentIds ?? [],
    ).filter((id) => id !== existing.hostId);
    eventsRepo.setAttendees(eventId, ids);
  }

  return eventsRepo.findDetailById(eventId)!;
}

export function deleteEvent(actor: Actor, eventId: string): void {
  const existing = eventsRepo.findSummaryById(eventId);
  if (!existing) throw notFound("event not found");
  assertCanMutate(actor, existing.hostId);
  eventsRepo.remove(eventId);
}
