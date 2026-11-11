import { useEffect, useRef, useState, type ReactElement } from "react";

interface InlineConfirmProps {
  /** Draws the control that starts the question. Call `ask` from its click. */
  trigger: (ask: () => void) => ReactElement;
  /** The question, drawn in place of the trigger: "Delete?". */
  question: string;
  /** Names the Yes button for a screen reader: `Yes, delete "Design"`. */
  yesLabel: string;
  /** What runs on Yes. While it runs Yes is disabled; a rejection puts a short message in place. */
  onConfirm: () => Promise<unknown>;
}

/**
 * An in-place Yes / No for a destructive action (base-ui rule 11, Q58): the trigger turns into
 * "Delete? Yes No", with focus on No. No or Esc puts the trigger back and focus with it. The
 * region is `aria-live`, so a screen reader hears the question.
 */
export function InlineConfirm({ trigger, question, yesLabel, onConfirm }: InlineConfirmProps) {
  const [asking, setAsking] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (asking) noRef.current?.focus();
    else if (restoreFocus.current) {
      restoreFocus.current = false;
      rootRef.current?.querySelector("button")?.focus();
    }
  }, [asking]);

  const cancel = () => {
    restoreFocus.current = true;
    setAsking(false);
  };

  const confirm = () => {
    setPending(true);
    onConfirm().then(
      () => {
        setPending(false);
        setAsking(false);
      },
      () => {
        setPending(false);
        setAsking(false);
        setFailed(true);
      },
    );
  };

  return (
    <span ref={rootRef} aria-live="polite" className="inline-flex items-center gap-2">
      {asking ? (
        <span
          role="group"
          aria-label={question}
          className="inline-flex items-center gap-2 text-sm"
          onKeyDown={(event) => {
            if (event.key === "Escape" && !pending) {
              event.preventDefault();
              cancel();
            }
          }}
        >
          <span className="text-on-surface-variant">{question}</span>
          <button
            type="button"
            aria-label={yesLabel}
            disabled={pending}
            onClick={confirm}
            className="rounded-md px-1.5 py-0.5 font-medium text-error outline-none hover:bg-surface-container focus-visible:aero-glow disabled:opacity-50"
          >
            Yes
          </button>
          <button
            ref={noRef}
            type="button"
            disabled={pending}
            onClick={cancel}
            className="rounded-md px-1.5 py-0.5 text-on-surface-variant outline-none hover:bg-surface-container focus-visible:aero-glow disabled:opacity-50"
          >
            No
          </button>
        </span>
      ) : (
        <>
          {failed && <span className="text-xs text-error">Could not delete.</span>}
          {trigger(() => {
            setFailed(false);
            setAsking(true);
          })}
        </>
      )}
    </span>
  );
}
