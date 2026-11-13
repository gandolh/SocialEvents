const dtFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const shortDateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export function formatDateTime(iso: string): string {
  return dtFormat.format(new Date(iso));
}

/** "8:30 PM". */
export function formatTime(iso: string): string {
  return timeFormat.format(new Date(iso));
}

/** "Nov 19". */
export function formatShortDate(iso: string): string {
  return shortDateFormat.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** Tailwind classes for a category chip: an opaque tint, the category's own text and a 1 px edge in the same colour. */
export function categoryChipClasses(category: string): string {
  switch (category) {
    case "Game night":
      return "border border-cat-game-night bg-chip-game-night text-cat-game-night";
    case "Holiday":
      return "border border-cat-holiday bg-chip-holiday text-cat-holiday";
    case "Team building":
      return "border border-cat-team-building bg-chip-team-building text-cat-team-building";
    default:
      return "border border-chip-neutral-edge bg-chip-neutral text-cat-other";
  }
}
