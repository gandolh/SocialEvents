import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn.js";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "social";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "aero-gloss text-on-primary border border-primary/40 hover:brightness-110",
  secondary: "aero-gloss-light text-on-surface border border-glass-edge hover:brightness-105",
  ghost: "bg-transparent text-on-surface-variant hover:bg-glass-hover",
  danger: "aero-gloss-danger text-on-error border border-error/50 hover:brightness-110",
  social: "aero-gloss-social text-on-secondary border border-secondary/40 hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150",
        "focus:outline-none focus-visible:aero-glow active:translate-y-px",
        "disabled:pointer-events-none disabled:opacity-50",
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
