import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import type { ReactElement, ReactNode } from "react";
import { IoClose } from "react-icons/io5";

interface NavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Names the panel for a screen reader. It is not drawn. */
  title: string;
  /** The menu button in the top bar, passed through `render`. */
  trigger: ReactElement;
  children: ReactNode;
}

/**
 * The phone's navigation panel, sliding in from the left edge (base-ui rule 15). A swipe to the
 * left, a tap outside, the X or Esc closes it. It is controlled, so a link inside can close it as
 * it navigates. Focus returns to the trigger on close.
 */
export function NavDrawer({ open, onOpenChange, title, trigger, children }: NavDrawerProps) {
  return (
    <BaseDrawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="left">
      <BaseDrawer.Trigger render={trigger} />
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="fixed inset-0 z-dialog bg-scrim opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-sm data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 motion-safe:transition-opacity motion-safe:duration-300 lg:hidden" />
        <BaseDrawer.Viewport className="fixed inset-0 z-dialog lg:hidden">
          <BaseDrawer.Popup className="relative flex h-full w-[280px] max-w-[80vw] [transform:translateX(var(--drawer-swipe-movement-x))] flex-col rounded-none px-4 py-6 aero-glass-strong outline-none data-ending-style:[transform:translateX(-100%)] data-starting-style:[transform:translateX(-100%)] data-swiping:duration-0 data-swiping:select-none motion-safe:transition-transform motion-safe:duration-300">
            <BaseDrawer.Title className="sr-only">{title}</BaseDrawer.Title>
            <BaseDrawer.Close
              aria-label="Close menu"
              className="absolute top-3 right-3 rounded-full p-1 text-on-surface-variant outline-none hover:bg-surface-container focus-visible:aero-glow"
            >
              <IoClose size={20} />
            </BaseDrawer.Close>
            <BaseDrawer.Content className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</BaseDrawer.Content>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
