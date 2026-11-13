import { Link } from "@tanstack/react-router";
import { cn } from "../lib/cn.js";

const views = [
  { to: "/calendar", label: "Month" },
  { to: "/calendar/day", label: "Day" },
] as const;

/** Month | Day: a segmented pair of router links. The chosen one is a surface pill, never the solid fill. */
export function ViewSwitch({ day, className }: { day: boolean; className?: string }) {
  return (
    <nav
      aria-label="Calendar view"
      className={cn("flex gap-0.5 rounded-md border border-outline bg-surface-container-high p-[3px]", className)}
    >
      {views.map((v) => {
        const active = (v.label === "Day") === day;
        return (
          <Link
            key={v.label}
            to={v.to}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-[46px] min-w-14 items-center justify-center rounded-sm border px-2.5 text-body font-semibold outline-none focus-visible:aero-focus max-narrow:min-w-12 max-narrow:px-2 md:h-9 md:min-w-18 md:px-4",
              active
                ? "border-outline bg-surface-bright text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface",
            )}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
