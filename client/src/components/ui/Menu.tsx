import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "../../lib/cn.js";
import { panel } from "./looks.js";

interface MenuProps {
  /** The element that opens it, passed through `render` so a button never nests in a button. */
  trigger: ReactElement;
  children: ReactNode;
  className?: string;
}

/** A menu of actions behind a button, opening below it and aligned to its right edge. */
export function Menu({ trigger, children, className }: MenuProps) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner align="end" sideOffset={8} collisionPadding={8} className="z-popup outline-none">
          <BaseMenu.Popup className={cn(panel, "max-h-(--available-height) overflow-y-auto", className)}>
            {children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}

type ItemProps = Omit<ComponentProps<typeof BaseMenu.Item>, "className"> & { danger?: boolean };

export function MenuItem({ danger, ...props }: ItemProps) {
  return (
    <BaseMenu.Item
      {...props}
      className={cn(
        "block w-full cursor-default px-4 py-2 text-left text-sm outline-none select-none data-highlighted:bg-surface-container",
        danger && "text-error",
      )}
    />
  );
}
