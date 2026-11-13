import type { AttendeeStatus } from "@socialevents/shared";
import { useRsvp } from "../api/hooks.js";
import { cn } from "../lib/cn.js";
import { Button } from "./ui/index.js";

/**
 * Join and Can't make it, for an invited person: the ticket's answers and the dialog's footer. They go through
 * the existing RSVP call and stay disabled while it runs. Join is the one gloss button; once accepted it reads
 * "Attending ✓" on an outlined surface, and a declined answer outlines Can't make it in the accent.
 */
export function RsvpButtons({
  eventId,
  status,
  className,
}: {
  eventId: string;
  status: AttendeeStatus;
  className?: string;
}) {
  const rsvp = useRsvp();
  const answer = (next: "accepted" | "declined") => rsvp.mutate({ id: eventId, status: next });
  const phone = "max-md:h-12 max-md:flex-1 max-md:px-2";
  return (
    <div className={cn("flex shrink-0 gap-3 max-md:gap-2", className)}>
      <Button
        variant={status === "accepted" ? "secondary" : "primary"}
        aria-pressed={status === "accepted"}
        disabled={rsvp.isPending}
        className={cn(phone, status === "accepted" && "text-primary")}
        onClick={() => answer("accepted")}
      >
        {status === "accepted" ? "Attending ✓" : "Join"}
      </Button>
      <Button
        variant="secondary"
        aria-pressed={status === "declined"}
        disabled={rsvp.isPending}
        className={cn(phone, status === "declined" && "border-primary text-primary")}
        onClick={() => answer("declined")}
      >
        Can't make it
      </Button>
    </div>
  );
}
