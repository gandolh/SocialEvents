import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { useRef, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { cn } from "../../lib/cn.js";

const SIZES = { md: "max-w-md", lg: "max-w-2xl", xl: "max-w-4xl" } as const;

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
        <BaseDialog.Backdrop className="fixed inset-0 z-dialog bg-scrim backdrop-blur-sm data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-150" />
        <BaseDialog.Popup
          ref={popupRef}
          initialFocus={() =>
            popupRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
            bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE) ??
            popupRef.current?.querySelector<HTMLElement>("footer button:not(:disabled)") ??
            true
          }
          className={cn(
            "fixed top-1/2 left-1/2 z-dialog flex max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl aero-glass-strong outline-none",
            "data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-safe:transition-[opacity,scale] motion-safe:duration-150",
            SIZES[size],
          )}
        >
          <div className="flex items-center justify-between border-b border-glass-divider px-6 py-4">
            <BaseDialog.Title className="text-lg font-semibold text-on-surface">{title}</BaseDialog.Title>
            <BaseDialog.Close
              aria-label="Close"
              className="rounded-full p-1 text-on-surface-variant outline-none hover:bg-surface-container focus-visible:aero-glow"
            >
              <IoClose size={20} />
            </BaseDialog.Close>
          </div>
          <div ref={bodyRef} className="flex-1 overflow-auto px-6 py-4">
            {children}
          </div>
          {footer && (
            <footer className="flex justify-end gap-2 border-t border-glass-divider px-6 py-4">{footer}</footer>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
