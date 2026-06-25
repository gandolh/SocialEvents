import { useState } from "react";
import { useEvents } from "../api/hooks.js";
import { MapView } from "../components/MapView.js";
import { EventDetailModal } from "../components/EventDetailModal.js";
import { Spinner, CategoryChip } from "../components/ui/index.js";

export function MapPage() {
  const { data: events = [], isLoading } = useEvents();
  const [selected, setSelected] = useState<string | null>(null);

  const located = events.filter(
    (e) => e.location.lat !== null && e.location.lng !== null,
  );
  const markers = located.map((e) => ({
    id: e.id,
    lat: e.location.lat as number,
    lng: e.location.lng as number,
    label: e.name,
  }));

  if (isLoading) return <Spinner />;

  return (
    <div className="flex h-full gap-4">
      <div className="w-72 shrink-0 space-y-2 overflow-auto">
        <h2 className="text-lg font-bold">Event Map</h2>
        {located.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelected(e.id)}
            className="block w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-3 text-left hover:bg-surface-container"
          >
            <CategoryChip category={e.category} />
            <p className="mt-1 font-medium">{e.name}</p>
            <p className="text-sm text-on-surface-variant">📍 {e.location.label}</p>
          </button>
        ))}
        {located.length === 0 && (
          <p className="text-sm text-on-surface-variant">
            No events have map coordinates yet.
          </p>
        )}
      </div>
      <div className="flex-1">
        <MapView markers={markers} />
      </div>

      {selected && (
        <EventDetailModal eventId={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
