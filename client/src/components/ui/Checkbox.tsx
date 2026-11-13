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
    <label className={cn("flex min-h-10 cursor-pointer items-center gap-3 text-body max-md:min-h-12", className)}>
      <BaseCheckbox.Root
        {...props}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-sm border-[1.5px] border-outline bg-surface-bright text-on-primary outline-none",
          "focus-visible:aero-focus data-checked:border-primary data-checked:bg-primary",
        )}
      >
        <BaseCheckbox.Indicator className="flex items-center justify-center">
          <IoCheckmark size={14} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label}
    </label>
  );
}
