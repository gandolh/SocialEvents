import { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { useEvent, useEvents, useMe, useRsvp } from "../api/hooks.js";
import { localIsoDate, WEEKDAYS } from "../lib/calendar.js";
import { cn } from "../lib/cn.js";
import { formatShortDate, formatTime } from "../lib/utils.js";
import { Button, CategoryChip, Skeleton } from "./ui/index.js";

/** The date tile: the weekday over the day of the month. */
export function DateTile({ iso, className }: { iso: string; className?: string }) {
  const date = new Date(iso);
  return (
    <span
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-tile border border-outline-variant bg-surface-container-high",
        className,
      )}
    >
      <span className="text-label/3.5 font-semibold text-on-surface-variant">{WEEKDAYS[date.getDay()]}</span>
      <span className="font-display text-title/5.5 font-medium text-on-surface">{date.getDate()}</span>
    </span>
  );
}

/**
 * The ticket: tonight's event, or the next one with its date, as one row over the month: the date tile, the
 * title and when, the category, the place, the host and who is coming, then Join and Can't make it. The
 * answers go through the dialog's own calls, only for an invited person who isn't the host or an admin.
 * With no upcoming event there is no ticket.
 */
export function NextEventTicket({ onOpen }: { onOpen: (id: string) => void }) {
  const [now] = useState(() => new Date().toISOString());
  const { data: me } = useMe();
  const upcoming = useEvents({ from: now });
  const next = upcoming.data?.[0];
  const { data: detail } = useEvent(next?.id ?? null);
  const rsvp = useRsvp();

  if (upcoming.isLoading) return <Skeleton className="h-17 rounded-lg" />;
  if (!next) return null;

  const mine = detail?.attendees.find((a) => a.userId === me?.id);
  const canManage = me?.id === next.hostId || me?.role === "admin";
  const answerable = !!mine && !canManage;
  const today = localIsoDate(next.startsAt) === localIsoDate(now);
  const when = `${today ? "Today" : formatShortDate(next.startsAt)}, ${formatTime(next.startsAt)}`;
  const answer = (status: "accepted" | "declined") => rsvp.mutate({ id: next.id, status });

  return (
    <section
      aria-label={today ? "Tonight" : "Next event"}
      className="flex items-center gap-5 rounded-lg border border-outline-variant bg-surface-bright py-2.5 pr-5 pl-3 shadow-panel max-md:flex-col max-md:items-stretch max-md:gap-2.5 max-md:pr-3 md:min-h-17"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4 max-md:gap-3">
        <DateTile iso={next.startsAt} className="h-12 w-13" />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4.5 gap-y-1.5 text-body text-on-surface-variant max-[379px]:grid-cols-[auto_minmax(0,1fr)] max-md:grid max-md:grid-cols-[minmax(0,auto)_auto] max-md:justify-start max-md:gap-x-3 max-md:gap-y-0">
          <button
            type="button"
            onClick={() => onOpen(next.id)}
            className="cursor-pointer rounded-sm text-left font-display text-title font-medium text-on-surface outline-none focus-visible:aero-focus max-[379px]:col-span-2 max-md:col-start-1 max-md:row-start-2 max-md:-my-2 max-md:py-2"
          >
            {next.name}
          </button>
          <span className="text-small font-medium whitespace-nowrap max-[379px]:col-span-2 max-md:col-start-1 max-md:row-start-1">
            {when}
          </span>
          <CategoryChip
            category={next.category}
            className="max-[379px]:col-start-1 max-[379px]:row-start-3 max-md:col-start-2 max-md:row-start-2 max-md:justify-self-start"
          />
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap max-[379px]:row-start-3 max-md:col-start-2 max-md:row-start-1 max-md:text-small">
            <IoLocationOutline size={16} aria-hidden="true" />
            {next.location.label}
          </span>
          <span className="whitespace-nowrap max-md:hidden">
            Host <b className="font-semibold text-on-surface">{next.hostName}</b>
          </span>
          <span className="whitespace-nowrap max-md:hidden">{next.attendeeCount} attending</span>
        </div>
      </div>
      {answerable && (
        <div className="flex shrink-0 gap-3 max-md:gap-2">
          <Button
            variant={mine.status === "accepted" ? "secondary" : "primary"}
            aria-pressed={mine.status === "accepted"}
            disabled={rsvp.isPending}
            className={cn("max-md:h-12 max-md:flex-1 max-md:px-2", mine.status === "accepted" && "text-primary")}
            onClick={() => answer("accepted")}
          >
            {mine.status === "accepted" ? "Attending ✓" : "Join"}
          </Button>
          <Button
            variant="secondary"
            aria-pressed={mine.status === "declined"}
            disabled={rsvp.isPending}
            className={cn(
              "max-md:h-12 max-md:flex-1 max-md:px-2",
              mine.status === "declined" && "border-primary text-primary",
            )}
            onClick={() => answer("declined")}
          >
            Can't make it
          </Button>
        </div>
      )}
    </section>
  );
}
