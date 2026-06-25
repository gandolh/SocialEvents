import type { ReactNode } from "react";
import { useState } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { cn, categoryChipClasses } from "../../lib/utils.js";

export function Card({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "aero-glass rounded-lg",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CategoryChip({ category }: { category: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        categoryChipClasses(category),
      )}
    >
      {category}
    </span>
  );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-primary-container font-semibold text-on-primary"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center p-8 text-on-surface-variant">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
    </div>
  );
}

export function StarRating({
  value,
  count,
  onRate,
  readOnly,
  size = 18,
}: {
  value: number;
  count?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex">
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
                "text-secondary",
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
        <span className="text-xs text-on-surface-variant">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-12 text-center text-on-surface-variant">
      <p className="text-sm">{message}</p>
    </div>
  );
}
