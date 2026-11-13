import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { expect, open, test, type Theme } from "../fixtures.js";

/**
 * Screenshots of every screen, for the comparison with the board's comps. They are written only when
 * SHOTS_DIR is set, so a plain run skips them: `SHOTS_DIR=<dir> npm run e2e -- tests/shots`.
 * Names: <screen>-<theme>-<width>.png.
 */
const dir = process.env["SHOTS_DIR"];
const WIDTHS = [
  [1280, 800],
  [390, 844],
  [360, 800],
] as const;
const THEMES: Theme[] = ["light", "dark"];

interface Screen {
  name: string;
  path: string;
  /** Shot at 390 only (the comps draw it there). */
  only390?: boolean;
  /** Holds the session request so the loading screen stays up. */
  stall?: boolean;
  /** Which seed user is signed in (alex when unset; "none" is signed out). */
  user?: string;
  /** Opens a dialog or menu, or waits for the page to settle, before the shot. */
  prepare?: (page: Page, phone: boolean) => Promise<void>;
}

const settle = async (page: Page) => {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
};

const heading = (name: string) => async (page: Page) =>
  void (await page.getByRole("heading", { name }).first().waitFor());

const openTicket = async (p: Page) => {
  await p.getByRole("heading", { name: "November 2026" }).waitFor();
  await p.getByRole("button", { name: "Pub Quiz Night" }).first().click();
  await p.getByRole("dialog", { name: "Pub Quiz Night" }).waitFor();
  await p.getByText("Teams of four, one answer sheet per table.").waitFor();
};
const openCreate = async (p: Page, phone: boolean) => {
  await p.getByRole("heading", { name: "November 2026" }).waitFor();
  await p
    .getByRole("button", { name: "Create Event" })
    .and(phone ? p.locator("div.sticky button") : p.locator("header button"))
    .click();
  await p.getByRole("dialog", { name: "Create event" }).waitFor();
};
const account = async (p: Page) => {
  await p.getByRole("heading", { name: "November 2026" }).waitFor();
  await p.getByRole("button", { name: "Account" }).click();
  await p.getByRole("menuitem", { name: "Profile & settings" }).waitFor();
};

const SCREENS: Screen[] = [
  { name: "calendar", path: "/", prepare: heading("November 2026") },
  { name: "event-detail", path: "/", prepare: openTicket },
  { name: "create-event", path: "/", prepare: openCreate },
  {
    name: "scrolled",
    path: "/",
    prepare: async (p, phone) => {
      await heading("November 2026")(p);
      await p.getByRole("heading", { name: "In November" }).waitFor();
      if (phone) await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    },
    only390: true,
  },
  { name: "day", path: "/calendar/day", prepare: heading("Nov 12, 2026") },
  {
    name: "events",
    path: "/events",
    prepare: async (p) => void (await p.getByRole("button", { name: /Pub Quiz Night/ }).waitFor()),
  },
  { name: "map", path: "/map", prepare: heading("Event Map") },
  { name: "admin", path: "/admin", user: "admin", prepare: heading("Departments") },
  { name: "account-menu", path: "/", prepare: account },
  {
    name: "profile",
    path: "/",
    prepare: async (p) => {
      await account(p);
      await p.getByRole("menuitem", { name: "Profile & settings" }).click();
      await p.getByRole("dialog", { name: "Profile & settings" }).waitFor();
    },
  },
  {
    name: "notifications",
    path: "/",
    prepare: async (p) => {
      await p.getByRole("heading", { name: "November 2026" }).waitFor();
      await p.getByRole("button", { name: "Notifications" }).click();
      await p.getByText("Notifications", { exact: true }).waitFor();
    },
  },
  {
    name: "sign-in",
    path: "/",
    user: "none",
    prepare: async (p) => void (await p.getByRole("button", { name: "Sign in" }).waitFor()),
  },
  {
    name: "session-loading",
    path: "/",
    prepare: async (p) => {
      await p.getByRole("status", { name: "Loading" }).waitFor();
    },
    stall: true,
  },
];

test.describe("screenshots", () => {
  test.skip(!dir, "SHOTS_DIR is not set");
  for (const screen of SCREENS) {
    for (const theme of THEMES) {
      for (const [width, height] of WIDTHS) {
        if (screen.only390 && width !== 390) continue;
        test.describe(`${screen.name} ${theme} ${width}`, () => {
          test.use({
            storageState:
              screen.user === "none"
                ? { cookies: [], origins: [] }
                : join(__dirname, `../.output/${screen.user ?? "alex"}.json`),
          });
          test("shot", async ({ page }) => {
            await page.setViewportSize({ width, height });
            if (screen.stall) await page.route("**/api/auth/me", () => new Promise(() => undefined));
            await open(page, screen.path, theme);
            await screen.prepare?.(page, width < 768);
            await settle(page);
            mkdirSync(dir ?? ".", { recursive: true });
            await page.screenshot({ path: join(dir ?? ".", `${screen.name}-${theme}-${width}.png`) });
            expect(page.url()).toContain("localhost");
          });
        });
      }
    }
  }
});
