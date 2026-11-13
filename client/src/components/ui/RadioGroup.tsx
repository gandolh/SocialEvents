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
      className={cn("flex w-fit gap-0.5 rounded-md border border-outline bg-surface-container-high p-[3px]", className)}
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          className={cn(
            "flex h-11 cursor-pointer items-center justify-center rounded-sm border border-transparent px-4 text-body font-semibold text-on-surface-variant outline-none select-none md:h-9",
            "hover:text-on-surface focus-visible:aero-focus data-checked:border-outline data-checked:bg-surface-bright data-checked:text-primary",
          )}
        >
          {option.label}
        </Radio.Root>
      ))}
    </BaseRadioGroup>
  );
}
