import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { IoChevronDown } from "react-icons/io5";
import { cn } from "../../lib/cn.js";

/** An opaque field: a 1 px `outline` edge, 44 px tall (48 px at 16 px on a phone, so it never zooms). */
const base =
  "h-11 w-full min-w-0 rounded-md border border-outline bg-surface-bright px-3 text-body text-on-surface " +
  "placeholder:text-on-surface-variant outline-none focus-visible:aero-focus max-md:h-12 max-md:text-list";

const label = "mb-1.5 block text-small font-semibold text-on-surface-variant";
const errorText = "mt-1.5 block text-body font-semibold text-error";

interface FieldProps {
  label?: string;
  error?: string;
}

export function Input({ label: text, error, className, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block min-w-0">
      {text && <span className={label}>{text}</span>}
      <input
        className={cn(base, error && "border-error", className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && <span className={errorText}>{error}</span>}
    </label>
  );
}

export function Textarea({
  label: text,
  error,
  className,
  ...rest
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block min-w-0">
      {text && <span className={label}>{text}</span>}
      <textarea
        className={cn(base, "block h-auto min-h-21 resize-y py-2.5 max-md:h-auto", error && "border-error", className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && <span className={errorText}>{error}</span>}
    </label>
  );
}

export function Select({
  label: text,
  error,
  className,
  children,
  ...rest
}: FieldProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block min-w-0">
      {text && <span className={label}>{text}</span>}
      <span className="relative block">
        <select className={cn(base, "appearance-none pr-11", className)} {...rest}>
          {children}
        </select>
        <IoChevronDown
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-on-surface-variant"
        />
      </span>
      {error && <span className={errorText}>{error}</span>}
    </label>
  );
}
