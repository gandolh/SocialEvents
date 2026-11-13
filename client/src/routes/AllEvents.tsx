import { useState } from "react";
import { IoLocationOutline, IoSearch } from "react-icons/io5";
import { EVENT_CATEGORY_NAMES } from "@socialevents/shared";
import { useEvents, useMe } from "../api/hooks.js";
import { EventDetailModal } from "../components/EventDetailModal.js";
import { Avatar, Button, CategoryChip, EmptyState, Select, Skeleton } from "../components/ui/index.js";
import { RadioGroup } from "../components/ui/RadioGroup.js";
import { formatDateTime } from "../lib/utils.js";

type Sort = "date" | "name";
type Scope = "all" | "mine";

const SCOPES = [
  { value: "all", label: "All Events" },
  { value: "mine", label: "Hosted by me" },
] as const;

const ISLAND = "rounded-lg border border-outline-variant bg-surface-bright shadow-panel";

export function AllEvents() {
  const { data: me } = useMe();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<Sort>("date");
  const [scope, setScope] = useState<Scope>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const {
    data: events = [],
    isLoading,
    isError,
    refetch,
  } = useEvents({
    search: search || undefined,
    category: (category || undefined) as never,
  });

  const filtered = events
    .filter((e) => (scope === "mine" && me ? e.hostId === me.id : true))
    .sort((a, b) => (sort === "date" ? a.startsAt.localeCompare(b.startsAt) : a.name.localeCompare(b.name)));

  return (
    <>
      <section aria-label="Filters" className={`${ISLAND} px-4 py-4 md:px-5`}>
        <h1 className="font-display text-dialog font-medium text-on-surface md:text-month">Event Directory</h1>
        <p className="mt-0.5 text-body text-on-surface-variant">Browse, filter, and manage all company activities.</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-55 flex-1 max-md:basis-full">
            <IoSearch
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search events"
              placeholder="Search events, hosts, or locations…"
              className="h-11 w-full rounded-md border border-outline bg-surface-bright pr-3 pl-9 text-body text-on-surface outline-none placeholder:text-on-surface-variant focus-visible:aero-focus max-md:h-12 max-md:text-list"
            />
          </div>
          <RadioGroup label="Show" options={SCOPES} value={scope} onValueChange={setScope} />
          <div className="w-44 max-md:flex-1">
            <Select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {EVENT_CATEGORY_NAMES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-36 max-md:flex-1">
            <Select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="date">Sort: Date</option>
              <option value="name">Sort: Name</option>
            </Select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div role="status" aria-label="Loading events" className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg max-md:hidden" />
          <Skeleton className="h-40 rounded-lg max-xl:hidden" />
        </div>
      ) : isError ? (
        <div className={ISLAND}>
          <EmptyState
            message="Couldn't load events."
            action={
              <Button variant="secondary" onClick={() => void refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className={ISLAND}>
          <EmptyState message="No events match your filters." />
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => setSelected(e.id)}
                className={`${ISLAND} block h-full w-full cursor-pointer p-4 text-left outline-none hover:bg-surface-container-high focus-visible:aero-focus`}
              >
                <CategoryChip category={e.category} />
                <h2 className="mt-2 line-clamp-2 text-list font-semibold text-on-surface">{e.name}</h2>
                <p className="mt-1 text-body text-on-surface-variant">{formatDateTime(e.startsAt)}</p>
                <p className="inline-flex items-center gap-1.5 text-body text-on-surface-variant">
                  <IoLocationOutline size={16} aria-hidden="true" />
                  {e.location.label}
                </p>
                <div className="mt-3 flex items-center gap-2 border-t border-outline-variant pt-3">
                  <span className="size-7 shrink-0">
                    <Avatar name={e.hostName} size={28} />
                  </span>
                  <span className="text-body text-on-surface">{e.hostName}</span>
                  <span className="ml-auto text-small text-on-surface-variant">{e.attendeeCount} attending</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && <EventDetailModal eventId={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
