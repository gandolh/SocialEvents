import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { useRef, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";

const FOCUSABLE =
  "input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), a[href]";

interface SheetDrawerProps {
  open: boolean;
  onClose: () => void;
  /** The sheet's title, drawn in its glass title bar. */
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * The phone's bottom sheet (base-ui rule 15), carrying an event's detail: a grab bar and a swipe down
 * close it, and so do the X, a tap outside and Esc. Focus goes to the first [data-autofocus] inside, else the
 * body's first field or button, else the footer's first button; on close it returns to what opened it.
 */
export function SheetDrawer({ open, onClose, title, children, footer }: SheetDrawerProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <BaseDrawer.Root
      open={open}
      swipeDirection="down"
      onOpenChange={(next, details) => {
        // The Escape guard: an Esc that a control inside already used isn't the sheet's.
        if (!next && details.reason === "escape-key" && details.event.defaultPrevented) return;
        if (!next) onClose();
      }}
    >
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="fixed inset-0 z-dialog bg-scrim opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-[8px] data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 motion-safe:transition-opacity motion-safe:duration-300 md:hidden" />
        <BaseDrawer.Viewport className="fixed inset-0 z-dialog flex items-end md:hidden">
          <BaseDrawer.Popup
            ref={popupRef}
            initialFocus={() =>
              popupRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
              bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE) ??
              popupRef.current?.querySelector<HTMLElement>("footer button:not(:disabled)") ??
              popupRef.current
            }
            className="relative flex max-h-[92dvh] w-full [transform:translateY(var(--drawer-swipe-movement-y))] flex-col overflow-hidden rounded-t-xl border border-b-0 border-outline bg-surface-bright shadow-dialog outline-none data-ending-style:[transform:translateY(100%)] data-starting-style:[transform:translateY(100%)] data-swiping:duration-0 data-swiping:select-none motion-safe:transition-transform motion-safe:duration-300"
          >
            <span
              aria-hidden="true"
              className="absolute top-1.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-sm bg-outline"
            />
            <div className="flex h-14 shrink-0 items-center gap-3 border-b border-outline pr-1.5 pl-4 aero-bar">
              <BaseDrawer.Title className="flex-1 font-display text-dialog font-medium text-on-surface">
                {title}
              </BaseDrawer.Title>
              <BaseDrawer.Close
                aria-label="Close"
                className="grid size-12 place-items-center rounded-full text-on-surface-variant outline-none hover:bg-surface-container-high hover:text-on-surface focus-visible:aero-focus"
              >
                <IoClose size={22} />
              </BaseDrawer.Close>
            </div>
            <BaseDrawer.Content className="flex min-h-0 flex-1 flex-col">
              <div ref={bodyRef} className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-4 pt-4 pb-3">
                {children}
              </div>
              {footer && (
                <footer className="flex shrink-0 gap-2 border-t border-outline-variant bg-surface-container-high px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                  {footer}
                </footer>
              )}
            </BaseDrawer.Content>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
