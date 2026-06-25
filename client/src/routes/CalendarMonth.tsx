import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useEvents } from "../api/hooks.js";
import { EventDetailModal } from "../components/EventDetailModal.js";
import { Spinner } from "../components/ui/index.js";
import {
  monthGrid,
  monthRange,
  localIsoDate,
  MONTH_NAMES,
  WEEKDAYS,
} from "../lib/calendar.js";
import { categoryChipClasses, cn } from "../lib/utils.js";

export function CalendarMonth() {
  const [ref, setRef] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const range = monthRange(ref);
  const { data: events = [], isLoading } = useEvents(range);
  const cells = monthGrid(ref);
  const todayIso = localIsoDate(new Date().toISOString());

  const byDay = new Map<string, typeof events>();
  for (const e of events) {
    const key = localIsoDate(e.startsAt);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(e);
  }

  const shift = (delta: number) =>
    setRef(new Date(ref.getFullYear(), ref.getMonth() + delta, 1));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          {MONTH_NAMES[ref.getMonth()]} {ref.getFullYear()}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => shift(-1)}
            className="rounded-lg border border-outline-variant/60 p-2 hover:bg-surface-container"
            aria-label="Previous month"
          >
            <IoChevronBack />
          </button>
          <button
            onClick={() => shift(1)}
            className="rounded-lg border border-outline-variant/60 p-2 hover:bg-surface-container"
            aria-label="Next month"
          >
            <IoChevronForward />
          </button>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="overflow-hidden rounded-lg border border-outline-variant/60">
          <div className="grid grid-cols-7 bg-surface-container-high text-xs font-semibold text-on-surface-variant">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-2 py-2 text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((cell) => {
              const dayEvents = byDay.get(cell.iso) ?? [];
              const isToday = cell.iso === todayIso;
              return (
                <div
                  key={cell.iso}
                  className={cn(
                    "min-h-[110px] border-b border-r border-outline-variant/40 p-1.5",
                    !cell.inMonth && "bg-surface-container-low/40 text-on-surface-variant/50",
                  )}
                >
                  <div className="mb-1 flex justify-end">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        isToday && "bg-primary font-semibold text-on-primary",
                      )}
                    >
                      {cell.date.getDate()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setSelected(e.id)}
                        className={cn(
                          "block w-full truncate rounded-full px-2 py-0.5 text-left text-xs font-medium",
                          categoryChipClasses(e.category),
                        )}
                      >
                        {e.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selected && (
        <EventDetailModal eventId={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
