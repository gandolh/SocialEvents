import { useState } from "react";
import {
  useEvent,
  useMe,
  useSetEventRating,
  useSetHostRating,
  useHostRating,
  useWeather,
  useDeleteEvent,
} from "../api/hooks.js";
import { InlineConfirm } from "./ui/InlineConfirm.js";
import { SheetDrawer } from "./ui/Drawer.js";
import { useIsPhone } from "../lib/useIsPhone.js";
import { Dialog, Button, CategoryChip, StarRating, Skeleton } from "./ui/index.js";
import { MapView } from "./MapView.js";
import { RsvpButtons } from "./RsvpButtons.js";
import { formatDateTime } from "../lib/utils.js";

/** The event's detail: a dialog on a desktop, a bottom sheet on a phone. */
export function EventDetailModal({ eventId, onClose }: { eventId: string; onClose: () => void }) {
  const { data: event, isLoading, isError, refetch } = useEvent(eventId);
  const { data: me } = useMe();
  const setEventRating = useSetEventRating();
  const setHostRating = useSetHostRating();
  const deleteEvent = useDeleteEvent();
  const [showMap, setShowMap] = useState(false);
  const phone = useIsPhone();

  const weather = useWeather(event?.location.lat ?? null, event?.location.lng ?? null);
  const hostRating = useHostRating(event?.hostId ?? null);

  const canManage = !!event && (me?.id === event.hostId || me?.role === "admin");
  const myAttendance = event?.attendees.find((a) => a.userId === me?.id);

  const Frame = phone ? SheetDrawer : Dialog;
  return (
    <Frame
      open
      onClose={onClose}
      title={event?.name ?? "Event"}
      {...(phone ? {} : { size: "lg" as const })}
      footer={
        canManage ? (
          <InlineConfirm
            question="Delete event?"
            yesLabel={`Yes, delete "${event?.name}" and its attendee list`}
            onConfirm={() => deleteEvent.mutateAsync(eventId).then(() => onClose())}
            trigger={(ask) => (
              <Button variant="danger" className="max-md:h-12 max-md:flex-1" onClick={ask}>
                Delete event
              </Button>
            )}
          />
        ) : myAttendance ? (
          <RsvpButtons eventId={eventId} status={myAttendance.status} className="max-md:flex-1" />
        ) : null
      }
    >
      {isError ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center text-body text-on-surface-variant">
          <p>Couldn't load this event.</p>
          <Button variant="secondary" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      ) : isLoading || !event ? (
        <div role="status" aria-label="Loading the event" className="flex flex-col gap-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-24" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      ) : (
        <div tabIndex={-1} data-autofocus className="flex flex-col gap-4 text-body outline-none">
          <div className="flex items-center justify-between gap-3 max-md:flex-wrap">
            <CategoryChip category={event.category} />
            <StarRating
              label="Event rating"
              value={event.rating.average}
              count={event.rating.count}
              onRate={(rating) => setEventRating.mutate({ id: eventId, rating })}
            />
          </div>

          <dl className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2.5 max-md:grid-cols-[80px_minmax(0,1fr)] max-md:gap-x-3 max-md:gap-y-2">
            <dt className="font-medium text-on-surface-variant">When</dt>
            <dd>{formatDateTime(event.startsAt)}</dd>

            <dt className="font-medium text-on-surface-variant">Weather</dt>
            <dd>
              {event.location.lat === null
                ? "—"
                : weather.data
                  ? `${weather.data.icon} ${weather.data.description}${weather.data.mock ? " (mock)" : ""}`
                  : "…"}
            </dd>

            <dt className="font-medium text-on-surface-variant">Host</dt>
            <dd className="flex flex-wrap items-center gap-x-3 max-md:contents">
              <span className="max-md:col-start-2">{event.hostName}</span>
              <span className="max-md:col-span-full">
                <StarRating
                  label="Host rating"
                  value={hostRating.data?.aggregate.average ?? 0}
                  count={hostRating.data?.aggregate.count}
                  onRate={(rating) => setHostRating.mutate({ hostId: event.hostId, rating })}
                />
              </span>
            </dd>

            <dt className="font-medium text-on-surface-variant">Location</dt>
            <dd className="flex flex-wrap items-center gap-x-3">
              {event.location.label}
              {event.location.lat !== null && (
                <button
                  type="button"
                  className="min-h-11 cursor-pointer rounded-sm font-semibold text-primary underline outline-none focus-visible:aero-focus"
                  onClick={() => setShowMap((s) => !s)}
                >
                  {showMap ? "Hide map" : "View map"}
                </button>
              )}
            </dd>

            {event.description && (
              <>
                <dt className="font-medium text-on-surface-variant">Details</dt>
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

          <div className="flex flex-col gap-2">
            <h3 className="text-body font-semibold text-on-surface-variant">Attendees ({event.attendees.length})</h3>
            <ul className="flex flex-wrap gap-2">
              {event.attendees.length === 0 && <li className="text-on-surface-variant">No attendees yet.</li>}
              {event.attendees.map((a) => (
                <li
                  key={a.userId}
                  className="inline-flex h-8 items-center rounded-full border border-outline-variant bg-surface-container-high px-3 font-medium"
                  title={a.status}
                >
                  {a.name}
                  {a.status === "accepted" && " ✓"}
                  {a.status === "declined" && " ✗"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Frame>
  );
}
