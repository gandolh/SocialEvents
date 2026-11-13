import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn.js";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "bar";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

/** The solid gloss is for the one action per screen; every other button is an outlined surface. */
const variants: Record<Variant, string> = {
  primary: "aero-gloss text-on-primary hover:brightness-110",
  secondary: "border border-outline bg-surface-bright text-on-surface hover:bg-surface-container-high",
  ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container-high",
  danger: "border border-error bg-surface-bright text-error hover:bg-surface-container-high",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-body",
  md: "h-11 px-5 text-body",
  bar: "h-10 px-4 text-body",
};

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap motion-safe:transition-colors motion-safe:duration-150",
        "outline-none focus-visible:aero-focus",
        "disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
