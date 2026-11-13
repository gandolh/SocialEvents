import type { ReactNode } from "react";
import { useState } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { cn } from "../../lib/cn.js";
import { categoryChipClasses } from "../../lib/utils.js";

/** An island: an opaque raised surface with a 1 px edge, over the flat desktop. */
export function Card({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-lg border border-outline-variant bg-surface-bright shadow-panel", className)} {...rest}>
      {children}
    </div>
  );
}

export function CategoryChip({ category, className }: { category: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-label font-semibold whitespace-nowrap",
        categoryChipClasses(category),
        className,
      )}
    >
      {category}
    </span>
  );
}

/** The person's initials on the gloss. Fills its parent unless a `size` in px is given. */
export function Avatar({ name, size }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="inline-grid size-full place-items-center rounded-full font-bold text-on-primary aero-gloss"
      style={size ? { width: size, height: size, fontSize: size < 36 ? 12 : 14 } : { fontSize: 14 }}
    >
      {initials}
    </span>
  );
}

/** A still block where content is loading: no spinner and no shimmer. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rounded-md bg-surface-container-high", className)} />;
}

export function StarRating({
  value,
  count,
  onRate,
  readOnly,
  size = 22,
  label = "Rating",
}: {
  value: number;
  count?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  /** Names the row of stars for a screen reader. */
  label?: string;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <span className="inline-flex items-center gap-2">
      <span role="group" aria-label={label} className="inline-flex">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= Math.round(display);
          const Icon = filled ? IoStar : IoStarOutline;
          return (
            <button
              key={n}
              type="button"
              disabled={readOnly}
              onMouseEnter={() => !readOnly && setHover(n)}
              onMouseLeave={() => !readOnly && setHover(0)}
              onClick={() => onRate?.(n)}
              className={cn(
                "grid size-12 place-items-center rounded-md text-cat-game-night outline-none focus-visible:aero-focus md:size-11",
                !readOnly && "cursor-pointer",
                readOnly && "cursor-default",
              )}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <Icon size={size} />
            </button>
          );
        })}
      </span>
      {count !== undefined && (
        <span className="text-small whitespace-nowrap text-on-surface-variant">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-10 text-center text-on-surface-variant">
      <p className="text-body">{message}</p>
      {action}
    </div>
  );
}
