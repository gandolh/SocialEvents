import { useSyncExternalStore } from "react";

/** The theme the user picked. `system` follows the operating system, live. */
export type Theme = "light" | "dark" | "system";

const KEY = "socialevents-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

/** The two looks the stylesheet has: what `data-theme` on <html> holds. */
export function resolve(theme: Theme, prefersDark: boolean): "light" | "dark" {
  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
}

function prefersDark(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches;
}

function saved(): Theme {
  try {
    const value = localStorage.getItem(KEY);
    return isTheme(value) ? value : "light";
  } catch {
    // Storage is blocked (a private window): a first visit shows light.
    return "light";
  }
}

let current: Theme = typeof window === "undefined" ? "light" : saved();
const listeners = new Set<() => void>();

/** The theme in force: light on a first visit, the saved choice after. */
export function getTheme(): Theme {
  return current;
}

function apply(): void {
  document.documentElement.dataset.theme = resolve(current, prefersDark());
}

/** Applies a theme to <html>, keeps it on this device, and tells every subscriber. */
export function setTheme(theme: Theme): void {
  current = theme;
  apply();
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Storage is blocked: the choice lasts until the tab closes.
  }
  for (const listener of listeners) listener();
}

/** Re-applies System when the operating system flips. Returns the function that stops it. */
export function watchSystemTheme(): () => void {
  if (typeof window.matchMedia !== "function") return () => undefined;
  const query = window.matchMedia(DARK_QUERY);
  const onChange = () => {
    if (current === "system") apply();
  };
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The theme the user picked, re-rendering when it changes. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => "light");
}
