import { z } from "zod";

/** Event categories. Canonical list — colors map to the design palette
 *  (see corpus/wiki/design-system.md). `key` is the design-token color slug. */
export const EVENT_CATEGORIES = [
  { name: "Game night", colorKey: "game-night" },
  { name: "Holiday", colorKey: "holiday" },
  { name: "Team building", colorKey: "team-building" },
  { name: "Other", colorKey: "other" },
] as const;

export const EVENT_CATEGORY_NAMES = EVENT_CATEGORIES.map((c) => c.name) as [
  string,
  ...string[],
];

export const eventCategorySchema = z.enum(EVENT_CATEGORY_NAMES);
export type EventCategory = z.infer<typeof eventCategorySchema>;

export const DEFAULT_CATEGORY: EventCategory = "Other";

/** Map a category name to its design-token color slug (cat-<slug>). */
export function categoryColorKey(name: string): string {
  return EVENT_CATEGORIES.find((c) => c.name === name)?.colorKey ?? "other";
}
