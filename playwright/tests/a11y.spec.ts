import type { Page } from "@playwright/test";
import { expect, open, SIZES, test } from "../fixtures.js";

/**
 * Tabs through the page and returns every focused element that never shows a ring (a 2 px solid outline). A date
 * field takes one press per segment, so the presses on one element count as one: it needs the ring on some of them.
 */
async function ringless(page: Page, presses: number): Promise<string[]> {
  const bad: string[] = [];
  let last = { key: "", label: "", ring: false };
  for (let i = 0; i < presses; i++) {
    await page.keyboard.press("Tab");
    const state = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const ring = style.outlineStyle === "solid" && parseFloat(style.outlineWidth) >= 2 && style.boxShadow !== "none";
      const key = String([...document.querySelectorAll("*")].indexOf(el));
      const name = el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 24) ?? el.tagName;
      return { ring, key, label: `${el.tagName.toLowerCase()} "${name}"` };
    });
    if (!state) continue;
    if (state.key === last.key) {
      last.ring ||= state.ring;
      continue;
    }
    if (last.key && !last.ring) bad.push(last.label);
    last = state;
  }
  if (last.key && !last.ring) bad.push(last.label);
  return bad;
}

test.describe("focus ring", () => {
  test.use({ viewport: SIZES.desktop });

  test("every control in the shell shows the two-tone ring", async ({ page }) => {
    await open(page, "/");
    await expect(page.getByRole("heading", { name: "November 2026" })).toBeVisible();
    expect(await ringless(page, 22)).toEqual([]);
  });

  test("every control in the directory shows the ring", async ({ page }) => {
    await open(page, "/events");
    await expect(page.getByRole("button", { name: /Pub Quiz Night/ })).toBeVisible();
    expect(await ringless(page, 24)).toEqual([]);
  });

  test("every control in the create dialog shows the ring", async ({ page }) => {
    await open(page, "/");
    await page.getByRole("button", { name: "Create Event" }).first().click();
    await expect(page.getByRole("dialog", { name: "Create event" })).toBeVisible();
    expect(await ringless(page, 14)).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the detail dialog has no transition and no running animation", async ({ page }) => {
    await page.setViewportSize(SIZES.desktop);
    await open(page, "/");
    await page.getByRole("button", { name: "Pub Quiz Night" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Pub Quiz Night" });
    await expect(dialog).toBeVisible();
    const motion = await dialog.evaluate((el) => ({
      duration: getComputedStyle(el).transitionDuration,
      animations: document.getAnimations().filter((a) => a.playState === "running").length,
    }));
    expect(motion.duration).toBe("0s");
    expect(motion.animations).toBe(0);
  });

  test("the phone event sheet has no transition and no running animation", async ({ page }) => {
    await page.setViewportSize(SIZES.phone);
    await open(page, "/");
    await page.getByRole("button", { name: "Pub Quiz Night" }).first().click();
    const sheet = page.getByRole("dialog", { name: "Pub Quiz Night" });
    await expect(sheet).toBeVisible();
    const motion = await sheet.evaluate((el) => ({
      duration: getComputedStyle(el).transitionDuration,
      animations: document.getAnimations().filter((a) => a.playState === "running").length,
    }));
    expect(motion.duration).toBe("0s");
    expect(motion.animations).toBe(0);
  });
});
