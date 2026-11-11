import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn.js";

interface RadioOption<Value extends string> {
  value: Value;
  label: ReactNode;
}

interface RadioGroupProps<Value extends string> {
  /** Names the group for a screen reader. */
  label: string;
  options: readonly RadioOption<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  className?: string;
}

/**
 * One choice from a few, drawn as a row of segmented buttons. Tab enters the group, and arrow keys
 * move and choose (base-ui rule 16): for a list filter and for a setting kept only on this device,
 * where trying each option with the arrows saves nothing.
 */
export function RadioGroup<Value extends string>({
  label,
  options,
  value,
  onValueChange,
  className,
}: RadioGroupProps<Value>) {
  return (
    <BaseRadioGroup<Value>
      aria-label={label}
      value={value}
      onValueChange={onValueChange}
      className={cn("flex w-fit rounded-lg border border-outline-variant/60 p-0.5 text-sm", className)}
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          className={cn(
            "cursor-pointer rounded-md px-3 py-1 text-on-surface-variant capitalize outline-none select-none",
            "focus-visible:aero-glow data-checked:bg-primary/10 data-checked:text-primary",
          )}
        >
          {option.label}
        </Radio.Root>
      ))}
    </BaseRadioGroup>
  );
}
