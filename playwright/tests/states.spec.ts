import type { Page } from "@playwright/test";
import { expect, open, SIZES, stateOf, test } from "../fixtures.js";

const events = (page: Page, respond: Parameters<Page["route"]>[1]) =>
  page.route((url) => url.pathname === "/api/events", respond);

test.use({ viewport: SIZES.desktop });

test("an empty month says so", async ({ page }) => {
  await events(page, (route) => route.fulfill({ json: { events: [] } }));
  await open(page, "/");
  await expect(page.getByText("No events in November.").locator("visible=true")).toBeVisible();
});

test("a failed load offers Try again, and Try again reloads", async ({ page }) => {
  let fail = true;
  await events(page, (route) => (fail ? route.fulfill({ status: 500, json: { error: "x" } }) : route.fallback()));
  await open(page, "/");
  await expect(page.getByText("Couldn't load events.")).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("heading", { name: "November 2026" })).toBeVisible();
  await expect(page.getByText("Couldn't load events.")).toBeHidden();
});

test("a failed event shows its own message", async ({ page }) => {
  await page.route(
    (url) => /^\/api\/events\/[^/]+$/.test(url.pathname),
    (route) => route.fulfill({ status: 500, json: { error: "x" } }),
  );
  await open(page, "/");
  await page.getByRole("button", { name: "Pub Quiz Night" }).first().click();
  await expect(page.getByText("Couldn't load this event.")).toBeVisible();
});

test("a missing field in the create form keeps the app's own message", async ({ page }) => {
  await open(page, "/");
  await page.getByRole("button", { name: "Create Event" }).first().click();
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await expect(page.getByText("Name, date and location are required.")).toBeVisible();
});

test.describe("answering as an invited person", () => {
  test.use({ storageState: stateOf("sam") });

  test("Can't make it, then Join, show their states", async ({ page }) => {
    await open(page, "/");
    await page.getByRole("button", { name: "Can't make it" }).click();
    await expect(page.getByRole("button", { name: "Can't make it" })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /^(Join|Attending)/ }).click();
    await expect(page.getByRole("button", { name: "Attending ✓" })).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("the host sees no answers", () => {
  test.use({ storageState: stateOf("admin") });

  test("the ticket for the host has no Join", async ({ page }) => {
    await open(page, "/");
    await expect(page.getByRole("heading", { name: "November 2026" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Join" })).toHaveCount(0);
  });
});
