import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ReactElement, ReactNode } from "react";
import { cn } from "../../lib/cn.js";
import { panel } from "./looks.js";

interface PopoverProps {
  /** The element that opens it, passed through `render` so a button never nests in a button. */
  trigger: ReactElement;
  /** The panel's heading; it also names the panel for a screen reader. */
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A small panel anchored below a button, aligned to its right edge. It opens on a tap and may hold controls. */
export function Popover({ trigger, title, children, className }: PopoverProps) {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner align="end" sideOffset={8} collisionPadding={8} className="z-popup">
          <BasePopover.Popup className={cn(panel, "max-w-(--available-width)", className)}>
            <BasePopover.Title className="border-b border-outline-variant/60 px-4 py-3 text-sm font-semibold">
              {title}
            </BasePopover.Title>
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
