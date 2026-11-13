import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { useRef, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { cn } from "../../lib/cn.js";

/** md: 448 px; lg: 640 px (the detail); xl: 680 px (the create form). On a phone every dialog fills the screen. */
const SIZES = { md: "md:max-w-md", lg: "md:max-w-160", xl: "md:max-w-170" } as const;

const FOCUSABLE =
  "input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), a[href]";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof SIZES;
  /** false makes an outside press do nothing: a dialog that holds a form must not lose what was typed. */
  dismissOnBackdrop?: boolean;
}

/**
 * A modal dialog (base-ui rule 12). Focus stays inside, the page behind is inert, and focus goes
 * back where it was on close. Esc and the X close it; an outside press does too, unless
 * `dismissOnBackdrop` is false. On open, focus goes to the first [data-autofocus] inside, else the
 * body's first field or button, else the footer's first button: never the X.
 */
export function Dialog({ open, onClose, title, children, footer, size = "md", dismissOnBackdrop = true }: DialogProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <BaseDialog.Root
      open={open}
      disablePointerDismissal={!dismissOnBackdrop}
      onOpenChange={(next, details) => {
        // The Escape guard: an Esc that a control inside already used isn't the dialog's.
        if (!next && details.reason === "escape-key" && details.event.defaultPrevented) return;
        if (!next) onClose();
      }}
    >
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-dialog bg-scrim backdrop-blur-[8px] data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-150" />
        <BaseDialog.Popup
          ref={popupRef}
          initialFocus={() =>
            popupRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
            bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE) ??
            popupRef.current?.querySelector<HTMLElement>("footer button:not(:disabled)") ??
            popupRef.current
          }
          className={cn(
            "fixed inset-0 z-dialog flex h-dvh w-full flex-col overflow-hidden border-outline bg-surface-bright outline-none",
            "md:inset-auto md:top-1/2 md:left-1/2 md:h-auto md:max-h-[calc(100dvh-3rem)] md:w-[calc(100%-3rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-lg md:border md:shadow-dialog",
            "data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-[opacity,scale] motion-safe:duration-150 md:data-ending-style:scale-95 md:data-starting-style:scale-95",
            SIZES[size],
          )}
        >
          <div
            className={cn(
              "flex h-14 shrink-0 items-center gap-3 border-b border-outline pr-1.5 pl-4 aero-bar md:pr-2.5 md:pl-6",
              size === "xl" ? "md:h-14" : "md:h-16",
            )}
          >
            <BaseDialog.Title className="flex-1 font-display text-dialog font-medium text-on-surface">
              {title}
            </BaseDialog.Title>
            <BaseDialog.Close
              aria-label="Close"
              className="grid size-12 place-items-center rounded-full text-on-surface-variant outline-none hover:bg-surface-container-high hover:text-on-surface focus-visible:aero-focus md:size-11"
            >
              <IoClose size={22} />
            </BaseDialog.Close>
          </div>
          <div
            ref={bodyRef}
            className={cn("min-h-0 flex-1 overflow-auto px-4 py-4 md:px-6", size === "xl" ? "md:py-4" : "md:py-5")}
          >
            {children}
          </div>
          {footer && (
            <footer className="flex shrink-0 justify-end gap-2 border-t border-outline-variant bg-surface-container-high px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:gap-3 md:px-6 md:pb-3">
              {footer}
            </footer>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
