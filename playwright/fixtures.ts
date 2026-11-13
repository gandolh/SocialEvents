import { test as base, expect, type Page } from "@playwright/test";

/** The day every spec pretends it is: Thursday 12 November 2026, 10:00 in the morning (UTC, as the config sets). */
const NOW = new Date("2026-11-12T10:00:00.000Z");

export type Theme = "light" | "dark";

/** Opens a path with the clock frozen and the saved theme set before the first paint. */
export async function open(page: Page, path: string, theme: Theme = "light"): Promise<void> {
  await page.clock.setFixedTime(NOW);
  await page.addInitScript((value) => localStorage.setItem("socialevents-theme", value), theme);
  await page.goto(path);
}

export const test = base;
export { expect };
