import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils.js";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "social";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "aero-gloss text-on-primary border border-primary/40 hover:brightness-110",
  secondary:
    "aero-gloss-light text-on-surface border border-white/70 hover:brightness-105",
  ghost: "bg-white/0 text-on-surface-variant hover:bg-white/40",
  danger:
    "text-on-error border border-error/50 hover:brightness-110 " +
    "[background:linear-gradient(to_bottom,#e25555_0%,#c62828_50%,#a81f1f_100%)] " +
    "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.2)]",
  social: "aero-gloss text-on-secondary border border-secondary/40 hover:brightness-110 " +
    "[background:linear-gradient(to_bottom,#9466e6_0%,#6a36d6_50%,#5a2bc0_100%)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150",
        "focus:outline-none focus-visible:aero-glow active:translate-y-px",
        "disabled:opacity-50 disabled:pointer-events-none",
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
