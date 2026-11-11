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

/** Tailwind classes for a category chip. Solid light tint so chips stay legible
 *  over the translucent Aero surfaces (avoid near-transparent backgrounds). */
export function categoryChipClasses(category: string): string {
  switch (category) {
    case "Game night":
      return "bg-chip-game-night text-secondary border border-secondary/30";
    case "Holiday":
      return "bg-chip-holiday text-tertiary border border-tertiary/30";
    case "Team building":
      return "bg-chip-team-building text-cat-team-building border border-cat-team-building/30";
    default:
      return "bg-chip-neutral text-on-surface-variant border border-outline/40";
  }
}
