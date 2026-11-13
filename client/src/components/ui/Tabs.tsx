import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn.js";

type WithClass<P> = Omit<P, "className"> & { className?: string };

/** Switches between panels of content. The root draws nothing of its own. */
export const Tabs = BaseTabs.Root;

/** The row of tabs. Arrow keys choose (activateOnFocus), since nothing is saved by trying one. */
export function TabsList({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.List>>) {
  return (
    <BaseTabs.List
      activateOnFocus
      {...props}
      className={cn("flex w-fit gap-0.5 rounded-md border border-outline bg-surface-container-high p-[3px]", className)}
    />
  );
}

export function Tab({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.Tab>>) {
  return (
    <BaseTabs.Tab
      {...props}
      className={cn(
        "flex h-11 cursor-pointer items-center justify-center rounded-sm border border-transparent px-4 text-body font-semibold text-on-surface-variant outline-none select-none md:h-9",
        "hover:text-on-surface focus-visible:aero-focus data-active:border-outline data-active:bg-surface-bright data-active:text-primary",
        className,
      )}
    />
  );
}

export function TabPanel({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.Panel>>) {
  return <BaseTabs.Panel {...props} className={cn("outline-none", className)} />;
}
