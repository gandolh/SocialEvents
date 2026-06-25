import { useState } from "react";
import {
  useEvent,
  useMe,
  useSetEventRating,
  useSetHostRating,
  useWeather,
  useRsvp,
  useDeleteEvent,
} from "../api/hooks.js";
import { Modal, Button, CategoryChip, StarRating, Spinner } from "./ui/index.js";
import { MapView } from "./MapView.js";
import { formatDateTime } from "../lib/utils.js";

export function EventDetailModal({
  eventId,
  onClose,
}: {
  eventId: string;
  onClose: () => void;
}) {
  const { data: event, isLoading } = useEvent(eventId);
  const { data: me } = useMe();
  const setEventRating = useSetEventRating();
  const setHostRating = useSetHostRating();
  const rsvp = useRsvp();
  const deleteEvent = useDeleteEvent();
  const [showMap, setShowMap] = useState(false);

  const weather = useWeather(event?.location.lat ?? null, event?.location.lng ?? null);

  const canManage = !!event && (me?.id === event.hostId || me?.role === "admin");
  const myAttendance = event?.attendees.find((a) => a.userId === me?.id);

  return (
    <Modal
      open
      onClose={onClose}
      title={event?.name ?? "Event"}
      size="lg"
      footer={
        canManage ? (
          <Button
            variant="danger"
            onClick={async () => {
              await deleteEvent.mutateAsync(eventId);
              onClose();
            }}
          >
            Delete event
          </Button>
        ) : myAttendance ? (
          <div className="flex gap-2">
            <Button
              variant={myAttendance.status === "accepted" ? "social" : "secondary"}
              onClick={() => rsvp.mutate({ id: eventId, status: "accepted" })}
            >
              {myAttendance.status === "accepted" ? "Attending ✓" : "Join"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => rsvp.mutate({ id: eventId, status: "declined" })}
            >
              Can't make it
            </Button>
          </div>
        ) : null
      }
    >
      {isLoading || !event ? (
        <Spinner />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CategoryChip category={event.category} />
            <StarRating
              value={event.rating.average}
              count={event.rating.count}
              onRate={(rating) => setEventRating.mutate({ id: eventId, rating })}
            />
          </div>

          <dl className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
            <dt className="text-on-surface-variant">When</dt>
            <dd>{formatDateTime(event.startsAt)}</dd>

            <dt className="text-on-surface-variant">Weather</dt>
            <dd>
              {event.location.lat === null
                ? "—"
                : weather.data
                  ? `${weather.data.icon} ${weather.data.description}${weather.data.mock ? " (mock)" : ""}`
                  : "…"}
            </dd>

            <dt className="text-on-surface-variant">Host</dt>
            <dd className="flex items-center gap-2">
              {event.hostName}
              <StarRating
                value={0}
                size={14}
                onRate={(rating) =>
                  setHostRating.mutate({ hostId: event.hostId, rating })
                }
              />
            </dd>

            <dt className="text-on-surface-variant">Location</dt>
            <dd className="flex items-center gap-2">
              {event.location.label}
              {event.location.lat !== null && (
                <button
                  className="text-primary underline"
                  onClick={() => setShowMap((s) => !s)}
                >
                  {showMap ? "Hide map" : "View map"}
                </button>
              )}
            </dd>

            {event.description && (
              <>
                <dt className="text-on-surface-variant">Details</dt>
                <dd>{event.description}</dd>
              </>
            )}
          </dl>

          {showMap && event.location.lat !== null && event.location.lng !== null && (
            <MapView
              height="240px"
              markers={[
                {
                  id: event.id,
                  lat: event.location.lat,
                  lng: event.location.lng,
                  label: event.location.label,
                },
              ]}
            />
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-on-surface-variant">
              Attendees ({event.attendees.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {event.attendees.length === 0 && (
                <span className="text-sm text-on-surface-variant">No attendees yet.</span>
              )}
              {event.attendees.map((a) => (
                <span
                  key={a.userId}
                  className="rounded-full bg-surface-container px-2.5 py-1 text-xs"
                  title={a.status}
                >
                  {a.name}
                  {a.status === "accepted" && " ✓"}
                  {a.status === "declined" && " ✗"}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
