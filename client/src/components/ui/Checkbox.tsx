import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ComponentProps, ReactNode } from "react";
import { IoCheckmark } from "react-icons/io5";
import { cn } from "../../lib/cn.js";

interface CheckboxProps extends Omit<ComponentProps<typeof BaseCheckbox.Root>, "className" | "children"> {
  label: ReactNode;
  className?: string;
}

/** A tick box with its label. A label around it makes the whole row the click target. */
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("flex items-center gap-2 px-1 py-1 text-sm", className)}>
      <BaseCheckbox.Root
        {...props}
        className={cn(
          "flex size-3.5 shrink-0 items-center justify-center rounded-sm border border-outline bg-surface-container-lowest text-on-primary outline-none",
          "focus-visible:aero-glow data-checked:border-primary data-checked:bg-primary",
        )}
      >
        <BaseCheckbox.Indicator className="flex items-center justify-center">
          <IoCheckmark size={10} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label}
    </label>
  );
}
