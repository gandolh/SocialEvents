import { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { useEvents } from "../api/hooks.js";
import { MapView } from "../components/MapView.js";
import { EventDetailModal } from "../components/EventDetailModal.js";
import { Button, CategoryChip, EmptyState, Skeleton } from "../components/ui/index.js";

export function MapPage() {
  const { data: events = [], isLoading, isError, refetch } = useEvents();
  const [selected, setSelected] = useState<string | null>(null);

  const located = events.filter((e) => e.location.lat !== null && e.location.lng !== null);
  const markers = located.map((e) => ({
    id: e.id,
    lat: e.location.lat as number,
    lng: e.location.lng as number,
    label: e.name,
  }));

  if (isLoading) {
    return (
      <div role="status" aria-label="Loading the map" className="flex flex-col gap-3 md:flex-row">
        <Skeleton className="h-64 rounded-lg md:w-72" />
        <Skeleton className="h-64 flex-1 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-outline-variant bg-surface-bright shadow-panel">
        <EmptyState
          message="Couldn't load events."
          action={
            <Button variant="secondary" onClick={() => void refetch()}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 md:min-h-112 md:flex-row">
      <section
        aria-label="Event Map"
        className="flex shrink-0 flex-col gap-2 rounded-lg border border-outline-variant bg-surface-bright p-4 shadow-panel md:w-80 md:overflow-auto"
      >
        <h1 className="font-display text-dialog font-medium text-on-surface">Event Map</h1>
        {located.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setSelected(e.id)}
            className="block w-full cursor-pointer rounded-md border border-outline-variant bg-surface-bright p-3 text-left outline-none hover:bg-surface-container-high focus-visible:aero-focus"
          >
            <CategoryChip category={e.category} />
            <p className="mt-1.5 text-list font-semibold text-on-surface">{e.name}</p>
            <p className="inline-flex items-center gap-1.5 text-body text-on-surface-variant">
              <IoLocationOutline size={16} aria-hidden="true" />
              {e.location.label}
            </p>
          </button>
        ))}
        {located.length === 0 && (
          <p className="text-body text-on-surface-variant">No events have map coordinates yet.</p>
        )}
      </section>
      <div className="min-h-64 flex-1 rounded-lg border border-outline-variant bg-surface-bright p-2 shadow-panel">
        <MapView markers={markers} />
      </div>

      {selected && <EventDetailModal eventId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
