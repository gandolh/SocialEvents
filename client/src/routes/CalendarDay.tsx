import { useState } from "react";
import { IoChevronBack, IoChevronForward, IoLocationOutline } from "react-icons/io5";
import { useEvents } from "../api/hooks.js";
import { EventDetailModal } from "../components/EventDetailModal.js";
import { ViewSwitch } from "../components/ViewSwitch.js";
import { Button, CategoryChip, EmptyState, Skeleton } from "../components/ui/index.js";
import { dayRange } from "../lib/calendar.js";
import { formatDate, formatTime } from "../lib/utils.js";

const NAV_BUTTON =
  "grid size-12 place-items-center rounded-md border border-outline bg-surface-bright text-on-surface outline-none hover:bg-surface-container-high focus-visible:aero-focus md:size-10";

export function CalendarDay() {
  const [ref, setRef] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const range = dayRange(ref);
  const { data: events = [], isLoading, isError, refetch } = useEvents(range);

  const shift = (d: number) => setRef(new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + d));

  return (
    <section aria-label="Day" className="rounded-lg border border-outline-variant bg-surface-bright shadow-panel">
      <div className="flex min-h-14 items-center gap-2 py-1 pr-3 pl-4 md:min-h-15 md:gap-4 md:px-5 md:py-2">
        <h1 className="mr-auto font-display text-dialog font-medium text-on-surface md:text-month">
          {formatDate(ref.toISOString())}
        </h1>
        <div className="flex gap-2">
          <button type="button" onClick={() => shift(-1)} className={NAV_BUTTON} aria-label="Previous day">
            <IoChevronBack size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => shift(1)} className={NAV_BUTTON} aria-label="Next day">
            <IoChevronForward size={20} aria-hidden="true" />
          </button>
        </div>
        <ViewSwitch day className="hidden md:flex" />
      </div>

      <div className="border-t border-outline-variant">
        {isLoading ? (
          <div role="status" aria-label="Loading the day" className="flex flex-col gap-3 p-4">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : isError ? (
          <EmptyState
            message="Couldn't load events."
            action={
              <Button variant="secondary" onClick={() => void refetch()}>
                Try again
              </Button>
            }
          />
        ) : events.length === 0 ? (
          <EmptyState message="No events scheduled for this day." />
        ) : (
          <ul>
            {events
              .slice()
              .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
              .map((e) => (
                <li key={e.id} className="border-outline-variant not-first:border-t">
                  <button
                    type="button"
                    onClick={() => setSelected(e.id)}
                    className="flex min-h-14 w-full cursor-pointer items-center gap-4 px-4 py-2.5 text-left outline-none hover:bg-surface-container-high focus-visible:aero-focus md:px-5"
                  >
                    <span className="w-20 shrink-0 text-body font-semibold text-primary">{formatTime(e.startsAt)}</span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-list font-semibold text-on-surface">{e.name}</span>
                      <span className="inline-flex items-center gap-1.5 text-small text-on-surface-variant">
                        <IoLocationOutline size={16} aria-hidden="true" />
                        {e.location.label}
                      </span>
                    </span>
                    <CategoryChip category={e.category} />
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {selected && <EventDetailModal eventId={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
