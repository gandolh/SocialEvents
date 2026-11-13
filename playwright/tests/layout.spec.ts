import type { Page } from "@playwright/test";
import { expect, open, SIZES, stateOf, test } from "../fixtures.js";

const ROUTES = [
  { path: "/", user: "alex", ready: "November 2026" },
  { path: "/calendar/day", user: "alex", ready: "Nov 12, 2026" },
  { path: "/events", user: "alex", ready: "Event Directory" },
  { path: "/map", user: "alex", ready: "Event Map" },
  { path: "/admin", user: "admin", ready: "Departments" },
];

for (const [name, size] of [
  ["390", SIZES.phone],
  ["360", SIZES.small],
] as const) {
  test.describe(`no horizontal scroll at ${name}`, () => {
    test.use({ viewport: size });
    for (const route of ROUTES) {
      test(`${route.path}`, async ({ browser }) => {
        const context = await browser.newContext({
          viewport: size,
          locale: "en-US",
          timezoneId: "UTC",
          storageState: stateOf(route.user),
        });
        const page = await context.newPage();
        await open(page, route.path);
        await expect(page.getByRole("heading", { name: route.ready }).first()).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
        await context.close();
      });
    }

    test("the event sheet and the create form", async ({ page }) => {
      await open(page, "/");
      await page.getByRole("button", { name: "Pub Quiz Night" }).first().click();
      await expect(page.getByRole("dialog", { name: "Pub Quiz Night" })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
      await page.keyboard.press("Escape");
      await page.locator("div.sticky").getByRole("button", { name: "Create Event" }).click();
      await expect(page.getByRole("dialog", { name: "Create event" })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
    });
  });
}

const box = async (page: Page, selector: string) => {
  const found = await page.locator(selector).first().boundingBox();
  if (!found) throw new Error(`no box for ${selector}`);
  return found;
};

test.describe("the first screen", () => {
  test("1280x800 holds all six weeks above the fold", async ({ page }) => {
    await page.setViewportSize(SIZES.desktop);
    await open(page, "/");
    await expect(page.getByRole("heading", { name: "November 2026" })).toBeVisible();
    const month = await box(page, 'section[aria-label="November 2026"]');
    test
      .info()
      .annotations.push({ type: "month island bottom", description: String(Math.round(month.y + month.height)) });
    expect(month.y + month.height).toBeLessThanOrEqual(800);
  });

  for (const [size, rows] of [
    [SIZES.phone, 2],
    [SIZES.small, 1],
  ] as const) {
    test(`${size.width}x${size.height} shows ${rows} whole In November row(s) above the bar`, async ({ page }) => {
      await page.setViewportSize(size);
      await open(page, "/");
      await expect(page.getByRole("heading", { name: "In November" })).toBeVisible();
      const bar = await box(page, "div.sticky.bottom-0");
      const items = page.locator('section[aria-label="In November"] li');
      const bottoms: number[] = [];
      for (let i = 0; i < rows; i++) {
        const row = await items.nth(i).boundingBox();
        if (!row) throw new Error("no row");
        bottoms.push(Math.round(row.y + row.height));
      }
      test.info().annotations.push({
        type: "row bottoms and bar top",
        description: `${bottoms.join(", ")} / ${Math.round(bar.y)}`,
      });
      for (const bottom of bottoms) expect(bottom).toBeLessThanOrEqual(bar.y);
    });
  }

  test("the end of the phone list stops above the bottom bar", async ({ page }) => {
    await page.setViewportSize(SIZES.phone);
    await open(page, "/");
    await expect(page.getByRole("heading", { name: "In November" })).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const bar = await box(page, "div.sticky.bottom-0");
    const list = await box(page, 'section[aria-label="In November"]');
    test
      .info()
      .annotations.push({ type: "gap above the bar", description: String(Math.round(bar.y - (list.y + list.height))) });
    expect(list.y + list.height).toBeLessThanOrEqual(bar.y);
  });
});

test.describe("sizes", () => {
  test("isolated phone controls are 48 px and the stars too", async ({ page }) => {
    await page.setViewportSize(SIZES.phone);
    await open(page, "/");
    for (const name of ["Notifications", "Account", "Previous month", "Next month"]) {
      const b = await page.getByRole("button", { name }).first().boundingBox();
      expect(b?.width, name).toBeGreaterThanOrEqual(48);
      expect(b?.height, name).toBeGreaterThanOrEqual(48);
    }
    const create = await page.locator("div.sticky").getByRole("button", { name: "Create Event" }).boundingBox();
    expect(create?.height).toBeGreaterThanOrEqual(48);
    await page.getByRole("button", { name: "Pub Quiz Night" }).first().click();
    const star = await page.getByRole("button", { name: "1 star" }).first().boundingBox();
    expect(star?.width).toBeGreaterThanOrEqual(48);
    expect(star?.height).toBeGreaterThanOrEqual(48);
  });

  test("on a phone the host's stars and 4.0 sit on one line, never wrapped", async ({ page }) => {
    for (const size of [SIZES.phone, SIZES.small]) {
      await page.setViewportSize(size);
      await open(page, "/");
      await page.getByRole("button", { name: "Pub Quiz Night" }).first().click();
      const group = page.getByRole("group", { name: "Host rating" });
      const value = group.locator("xpath=following-sibling::span");
      const g = await group.boundingBox();
      const v = await value.boundingBox();
      expect(v && g && Math.abs(v.y + v.height / 2 - (g.y + g.height / 2)) < 4, `${size.width}`).toBe(true);
      expect(v?.height).toBeLessThan(24);
      await page.keyboard.press("Escape");
    }
  });

  test("1280: the create form shows all four invitees without scrolling", async ({ page }) => {
    await page.setViewportSize(SIZES.desktop);
    await open(page, "/");
    await page.getByRole("button", { name: "Create Event" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Create event" });
    await expect(dialog).toBeVisible();
    const people = dialog.getByRole("checkbox");
    await expect(people).toHaveCount(4);
    const footer = await dialog.locator("footer").boundingBox();
    const last = await people.last().boundingBox();
    test.info().annotations.push({
      type: "last invitee bottom and footer top",
      description: `${Math.round((last?.y ?? 0) + (last?.height ?? 0))} / ${Math.round(footer?.y ?? 0)}`,
    });
    expect((last?.y ?? 0) + (last?.height ?? 0)).toBeLessThanOrEqual(footer?.y ?? 0);
  });
});
