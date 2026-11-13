import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn.js";

type WithClass<P> = Omit<P, "className"> & { className?: string };

/** Switches between panels of content. The root draws nothing of its own. */
export const Tabs = BaseTabs.Root;

/** The row of tabs. Arrow keys choose (activateOnFocus), since nothing is saved by trying one. */
export function TabsList({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.List>>) {
  return <BaseTabs.List activateOnFocus {...props} className={cn("mb-2 flex gap-1 text-sm", className)} />;
}

export function Tab({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.Tab>>) {
  return (
    <BaseTabs.Tab
      {...props}
      className={cn(
        "cursor-pointer rounded-md px-3 py-1 text-on-surface-variant outline-none select-none",
        "hover:bg-surface-container focus-visible:aero-focus data-active:bg-primary/10 data-active:text-primary",
        className,
      )}
    />
  );
}

export function TabPanel({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.Panel>>) {
  return <BaseTabs.Panel {...props} className={cn("outline-none", className)} />;
}
