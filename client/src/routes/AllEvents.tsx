import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { EVENT_CATEGORY_NAMES } from "@socialevents/shared";
import { useEvents, useMe } from "../api/hooks.js";
import { EventDetailModal } from "../components/EventDetailModal.js";
import {
  Card,
  CategoryChip,
  Avatar,
  Spinner,
  EmptyState,
  Select,
} from "../components/ui/index.js";
import { formatDateTime, cn } from "../lib/utils.js";

type Sort = "date" | "name";
type Scope = "all" | "mine";

export function AllEvents() {
  const { data: me } = useMe();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<Sort>("date");
  const [scope, setScope] = useState<Scope>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const { data: events = [], isLoading } = useEvents({
    search: search || undefined,
    category: (category || undefined) as never,
  });

  const filtered = events
    .filter((e) =>
      scope === "mine" && me ? e.hostId === me.id : true,
    )
    .sort((a, b) =>
      sort === "date"
        ? a.startsAt.localeCompare(b.startsAt)
        : a.name.localeCompare(b.name),
    );

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Event Directory</h2>
        <p className="text-sm text-on-surface-variant">
          Browse, filter, and manage all company activities.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, hosts, or locations…"
            className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex rounded-lg border border-outline-variant/60 p-0.5 text-sm">
          {(["all", "mine"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={cn(
                "rounded-md px-3 py-1 capitalize",
                scope === s ? "bg-primary/10 text-primary" : "text-on-surface-variant",
              )}
            >
              {s === "all" ? "All Events" : "Hosted by me"}
            </button>
          ))}
        </div>
        <div className="w-40">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {EVENT_CATEGORY_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-32">
          <Select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="date">Sort: Date</option>
            <option value="name">Sort: Name</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState message="No events match your filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e) => (
            <Card
              key={e.id}
              className="cursor-pointer overflow-hidden p-0 transition-shadow hover:shadow-md"
              onClick={() => setSelected(e.id)}
            >
              <div className="border-t-4 border-primary/0 p-4">
                <CategoryChip category={e.category} />
                <h3 className="mt-2 line-clamp-2 text-base font-semibold">{e.name}</h3>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {formatDateTime(e.startsAt)}
                </p>
                <p className="text-sm text-on-surface-variant">📍 {e.location.label}</p>
                <div className="mt-3 flex items-center gap-2 border-t border-outline-variant/40 pt-3">
                  <Avatar name={e.hostName} size={28} />
                  <span className="text-sm">{e.hostName}</span>
                  <span className="ml-auto text-xs text-on-surface-variant">
                    {e.attendeeCount} attending
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <EventDetailModal eventId={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
