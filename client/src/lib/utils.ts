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

/** Tailwind classes for a category chip. Solid light tint so chips stay legible
 *  over the translucent Aero surfaces (avoid near-transparent backgrounds). */
export function categoryChipClasses(category: string): string {
  switch (category) {
    case "Game night":
      return "bg-[#ece1ff] text-secondary border border-secondary/30";
    case "Holiday":
      return "bg-[#ffe2d6] text-tertiary border border-tertiary/30";
    case "Team building":
      return "bg-[#d7f0e2] text-[#1c7a4a] border border-[#1c7a4a]/30";
    default:
      return "bg-white/90 text-on-surface-variant border border-outline/40";
  }
}
