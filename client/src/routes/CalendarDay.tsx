import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useEvents } from "../api/hooks.js";
import { EventDetailModal } from "../components/EventDetailModal.js";
import { Spinner, CategoryChip, EmptyState } from "../components/ui/index.js";
import { dayRange } from "../lib/calendar.js";
import { formatDate } from "../lib/utils.js";

export function CalendarDay() {
  const [ref, setRef] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const range = dayRange(ref);
  const { data: events = [], isLoading } = useEvents(range);

  const shift = (d: number) =>
    setRef(new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + d));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{formatDate(ref.toISOString())}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => shift(-1)}
            className="rounded-lg border border-outline-variant/60 p-2 hover:bg-surface-container"
          >
            <IoChevronBack />
          </button>
          <button
            onClick={() => shift(1)}
            className="rounded-lg border border-outline-variant/60 p-2 hover:bg-surface-container"
          >
            <IoChevronForward />
          </button>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : events.length === 0 ? (
        <EmptyState message="No events scheduled for this day." />
      ) : (
        <div className="space-y-2">
          {events
            .slice()
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
            .map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e.id)}
                className="flex w-full items-center gap-4 rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4 text-left hover:bg-surface-container"
              >
                <div className="w-16 shrink-0 text-sm font-semibold text-primary">
                  {new Date(e.startsAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{e.name}</p>
                  <p className="text-sm text-on-surface-variant">{e.location.label}</p>
                </div>
                <CategoryChip category={e.category} />
              </button>
            ))}
        </div>
      )}

      {selected && (
        <EventDetailModal eventId={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
