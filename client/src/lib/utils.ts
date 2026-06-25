export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

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

/** Tailwind classes for a category chip (subtle tinted bg + same-hue text). */
export function categoryChipClasses(category: string): string {
  switch (category) {
    case "Game night":
      return "bg-secondary/10 text-secondary border border-secondary/20";
    case "Holiday":
      return "bg-tertiary-container/20 text-tertiary border border-tertiary/20";
    case "Team building":
      return "bg-[#006d3b]/10 text-[#006d3b] border border-[#006d3b]/20";
    default:
      return "bg-outline/10 text-on-surface-variant border border-outline/20";
  }
}
