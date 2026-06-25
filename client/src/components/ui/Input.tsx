import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils.js";

const base =
  "w-full rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-sm text-on-surface " +
  "shadow-[inset_0_1px_2px_rgba(13,45,80,0.12)] placeholder:text-on-surface-variant/60 " +
  "focus:outline-none focus:border-primary focus:bg-white/90 focus-visible:aero-glow";

interface FieldProps {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className,
  ...rest
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-on-surface-variant">
          {label}
        </span>
      )}
      <input className={cn(base, error && "border-error", className)} {...rest} />
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  );
}

export function Textarea({
  label,
  error,
  className,
  ...rest
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-on-surface-variant">
          {label}
        </span>
      )}
      <textarea
        className={cn(base, "min-h-[80px] resize-y", error && "border-error", className)}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  );
}

export function Select({
  label,
  error,
  className,
  children,
  ...rest
}: FieldProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-on-surface-variant">
          {label}
        </span>
      )}
      <select className={cn(base, className)} {...rest}>
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  );
}
