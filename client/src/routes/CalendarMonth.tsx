import { useState } from "react";
import { IoChevronBack, IoChevronForward, IoLocationOutline } from "react-icons/io5";
import { EVENT_CATEGORY_NAMES, type EventSummary } from "@socialevents/shared";
import { useEvents } from "../api/hooks.js";
import { EventDetailModal } from "../components/EventDetailModal.js";
import { DateTile, NextEventTicket } from "../components/NextEventTicket.js";
import { ViewSwitch } from "../components/ViewSwitch.js";
import { Button, CategoryChip, Skeleton } from "../components/ui/index.js";
import {
  monthGrid,
  monthRange,
  localIsoDate,
  MONTH_NAMES,
  WEEKDAYS,
  WEEKDAY_NAMES,
  type DayCell,
} from "../lib/calendar.js";
import { cn } from "../lib/cn.js";
import { categoryChipClasses, formatTime } from "../lib/utils.js";

/** The bar colour of a category: the date bars on a phone's grid and under it. */
function barClass(category: string): string {
  switch (category) {
    case "Game night":
      return "bg-cat-game-night";
    case "Holiday":
      return "bg-cat-holiday";
    case "Team building":
      return "bg-cat-team-building";
    default:
      return "bg-cat-other";
  }
}

function Bar({ category }: { category: string }) {
  return <i aria-hidden="true" className={cn("block h-1 w-4 rounded-[2px]", barClass(category))} />;
}

const NAV_BUTTON =
  "grid size-12 place-items-center rounded-md border border-outline bg-surface-bright text-on-surface outline-none hover:bg-surface-container-high focus-visible:aero-focus md:size-10";

function DateNumber({ cell, today }: { cell: DayCell; today: boolean }) {
  return today ? (
    <span className="-my-0.5 inline-grid size-6.5 place-items-center rounded-full bg-primary text-small font-bold text-on-primary">
      {cell.date.getDate()}
    </span>
  ) : (
    <span className={cn("px-1 text-small/5 font-medium", !cell.inMonth && "text-on-surface-faint")}>
      {cell.date.getDate()}
    </span>
  );
}

function Cell({
  cell,
  index,
  today,
  events,
  loading,
  onOpen,
}: {
  cell: DayCell;
  index: number;
  today: boolean;
  events: EventSummary[];
  loading: boolean;
  onOpen: (id: string) => void;
}) {
  const first = events[0];
  const label = `${WEEKDAY_NAMES[cell.date.getDay()]} ${cell.date.getDate()} ${MONTH_NAMES[cell.date.getMonth()]}`;
  return (
    <div
      className={cn(
        "flex min-h-11 min-w-0 flex-col gap-1 border-r border-b border-outline-variant md:min-h-month-cell md:p-1.5",
        index % 7 === 6 && "border-r-0",
        index >= 35 && "md:border-b-0",
        !cell.inMonth && "bg-surface-container-high",
      )}
    >
      <div className="hidden md:flex">
        <DateNumber cell={cell} today={today} />
      </div>
      {loading && cell.inMonth && index % 5 === 2 && <Skeleton className="hidden h-9 md:block" />}
      {events.map((e) => (
        <button
          key={e.id}
          type="button"
          onClick={() => onOpen(e.id)}
          className={cn(
            "hidden w-full cursor-pointer flex-col rounded-sm px-1.5 py-[3px] text-left outline-none focus-visible:aero-focus md:flex",
            categoryChipClasses(e.category),
          )}
        >
          <span className="text-small font-semibold">{e.name}</span>
          <span className="text-label font-medium">{formatTime(e.startsAt)}</span>
        </button>
      ))}
      {first ? (
        <button
          type="button"
          aria-label={`${label}, ${events.map((e) => e.name).join(", ")}`}
          onClick={() => onOpen(first.id)}
          className="flex h-11 w-full cursor-pointer flex-col items-center gap-0.5 pt-1 outline-none focus-visible:aero-focus md:hidden"
        >
          <span className="flex h-6.5 items-center">
            <DateNumber cell={cell} today={today} />
          </span>
          <span className="flex gap-0.5">
            {events.map((e) => (
              <Bar key={e.id} category={e.category} />
            ))}
          </span>
        </button>
      ) : (
        <div className="grid h-11 w-full place-items-center md:hidden">
          <DateNumber cell={cell} today={today} />
        </div>
      )}
    </div>
  );
}

export function CalendarMonth() {
  const [ref, setRef] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const range = monthRange(ref);
  const { data: events = [], isLoading, isError, refetch } = useEvents(range);
  const cells = monthGrid(ref);
  const todayIso = localIsoDate(new Date().toISOString());
  const monthName = MONTH_NAMES[ref.getMonth()];

  const byDay = new Map<string, EventSummary[]>();
  for (const e of events) {
    const key = localIsoDate(e.startsAt);
    const list = byDay.get(key) ?? [];
    list.push(e);
    byDay.set(key, list);
  }

  const shift = (delta: number) => setRef(new Date(ref.getFullYear(), ref.getMonth() + delta, 1));
  const empty = !isLoading && !isError && events.length === 0;

  return (
    <>
      <NextEventTicket onOpen={setSelected} />

      <section
        aria-label={`${monthName} ${ref.getFullYear()}`}
        className="rounded-lg border border-outline-variant bg-surface-bright shadow-panel"
      >
        <div className="flex min-h-14 flex-wrap items-center gap-x-2 gap-y-1 py-1 pr-3 pl-4 md:min-h-15 md:gap-x-4 md:px-5 md:py-2">
          <h1 className="mr-auto font-display text-dialog font-medium text-on-surface md:mr-0 md:text-month lg:whitespace-nowrap">
            {monthName} {ref.getFullYear()}
          </h1>
          <ul
            aria-label="Categories"
            className="mr-auto ml-2 hidden gap-2 max-lg:order-last max-lg:mr-0 max-lg:mb-1 max-lg:ml-0 max-lg:basis-full md:flex"
          >
            {EVENT_CATEGORY_NAMES.map((name) => (
              <li key={name}>
                <CategoryChip category={name} />
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button type="button" onClick={() => shift(-1)} className={NAV_BUTTON} aria-label="Previous month">
              <IoChevronBack size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => shift(1)} className={NAV_BUTTON} aria-label="Next month">
              <IoChevronForward size={20} aria-hidden="true" />
            </button>
          </div>
          <ViewSwitch day={false} className="hidden md:flex" />
        </div>

        {isError ? (
          <div className="flex flex-col items-center gap-3 border-t border-outline-variant px-4 py-14 text-center text-body text-on-surface-variant">
            <p>Couldn't load events.</p>
            <Button variant="secondary" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="grid h-7 grid-cols-7 items-center border-y border-outline-variant bg-surface-container-high text-center text-label font-semibold text-on-surface-variant md:h-8 md:text-left md:text-small">
              {WEEKDAYS.map((d) => (
                <div key={d} className="md:px-2.5">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 overflow-hidden md:rounded-b-lg">
              {cells.map((cell, i) => (
                <Cell
                  key={cell.iso}
                  cell={cell}
                  index={i}
                  today={cell.iso === todayIso}
                  events={byDay.get(cell.iso) ?? []}
                  loading={isLoading}
                  onOpen={setSelected}
                />
              ))}
            </div>
            {empty && (
              <p className="hidden px-4 py-3 text-center text-body text-on-surface-variant md:block">
                No events in {monthName}.
              </p>
            )}
            <ul
              aria-label="Categories"
              className="flex flex-wrap justify-center gap-x-3 gap-y-1 px-3 pt-1.5 pb-2 text-label text-on-surface-variant max-[379px]:flex-nowrap max-[379px]:gap-x-2.5 max-[379px]:px-2 md:hidden"
            >
              {EVENT_CATEGORY_NAMES.map((name) => (
                <li key={name} className="inline-flex items-center gap-1.5 max-[379px]:gap-1">
                  <i aria-hidden="true" className={cn("block h-1 w-4 rounded-[2px] max-[379px]:w-3", barClass(name))} />
                  {name}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {!isError && events.length > 0 && (
        <section
          aria-label={`In ${monthName}`}
          className="rounded-lg border border-outline-variant bg-surface-bright shadow-panel md:hidden"
        >
          <h2 className="px-4 pt-1.5 pb-0.5 font-display text-title font-medium max-[379px]:text-[17px]/6">
            In {monthName}
          </h2>
          <ul className="px-2 pb-1.5">
            {events.map((e) => (
              <li key={e.id} className="border-outline-variant not-first:border-t">
                <button
                  type="button"
                  onClick={() => setSelected(e.id)}
                  className="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-left outline-none focus-visible:aero-focus max-[379px]:grid max-[379px]:grid-cols-[48px_minmax(0,1fr)_auto] max-[379px]:gap-y-0 max-[379px]:py-1"
                >
                  <DateTile
                    iso={e.startsAt}
                    className="h-11 w-12 rounded-md max-[379px]:col-start-1 max-[379px]:row-span-2 max-[379px]:row-start-1"
                  />
                  <span className="flex min-w-0 flex-1 flex-col max-[379px]:contents">
                    <span className="text-list font-semibold text-on-surface max-[379px]:col-start-2 max-[379px]:row-start-1 max-[379px]:self-end">
                      {e.name}
                    </span>
                    <span className="flex flex-wrap gap-x-2.5 text-small text-on-surface-variant max-[379px]:col-span-2 max-[379px]:col-start-2 max-[379px]:row-start-2 max-[379px]:self-start">
                      {formatTime(e.startsAt)}
                      <span className="inline-flex items-center gap-1.5">
                        <IoLocationOutline size={16} aria-hidden="true" />
                        {e.location.label}
                      </span>
                    </span>
                  </span>
                  <CategoryChip
                    category={e.category}
                    className="max-[379px]:col-start-3 max-[379px]:row-start-1 max-[379px]:self-end"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {empty && (
        <section
          aria-label={`In ${monthName}`}
          className="rounded-lg border border-outline-variant bg-surface-bright px-4 py-5 text-center text-body text-on-surface-variant shadow-panel md:hidden"
        >
          No events in {monthName}.
        </section>
      )}

      {selected && <EventDetailModal eventId={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
