import { useSyncExternalStore } from "react";

/** The phone layout is below Tailwind's `md` (768 px). Keep this query and the `md:` classes in step. */
const QUERY = "(max-width: 767px)";

function subscribe(onChange: () => void): () => void {
  if (typeof window.matchMedia !== "function") return () => undefined;
  const list = window.matchMedia(QUERY);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

function snapshot(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(QUERY).matches;
}

/** True on a phone-width screen. Used where the screen swaps a component, not only its classes. */
export function useIsPhone(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
