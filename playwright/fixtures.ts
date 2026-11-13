import { join } from "node:path";
import { test as base, expect, type Page } from "@playwright/test";

/** The day every spec pretends it is: Thursday 12 November 2026, 10:00 in the morning (UTC, as the config sets). */
export const NOW = new Date("2026-11-12T10:00:00.000Z");

export const SIZES = {
  desktop: { width: 1280, height: 800 },
  phone: { width: 390, height: 844 },
  small: { width: 360, height: 800 },
} as const;

/** The saved sign-in of a seed user (`global-setup.ts` writes it). */
export const stateOf = (user: string) => join(__dirname, ".output", `${user}.json`);

export type Theme = "light" | "dark";

/** Opens a path with the clock frozen and the saved theme set before the first paint. */
export async function open(page: Page, path: string, theme: Theme = "light"): Promise<void> {
  // The session route allows 20 requests a minute per address; a fresh made-up address per page keeps a long run under it
  // (the test server trusts X-Forwarded-For: start it with TRUST_PROXY=true).
  const address = `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${1 + Math.floor(Math.random() * 250)}`;
  await page.context().setExtraHTTPHeaders({ "x-forwarded-for": address });
  await page.clock.setFixedTime(NOW);
  await page.addInitScript((value) => localStorage.setItem("socialevents-theme", value), theme);
  await page.goto(path);
}

export const test = base;
export { expect };
