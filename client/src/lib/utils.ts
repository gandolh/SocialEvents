const dtFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export function formatDateTime(iso: string): string {
  return dtFormat.format(new Date(iso));
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
