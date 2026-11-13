import { expect, SIZES, test } from "../fixtures.js";

test.use({ viewport: SIZES.desktop });

async function chooseTheme(page: import("@playwright/test").Page, name: "Light" | "Dark" | "System") {
  await page.getByRole("button", { name: "Account" }).click();
  await page.getByRole("menuitem", { name: "Profile & settings" }).click();
  await page.getByRole("radio", { name }).click();
  await page.keyboard.press("Escape");
}

test("a first visit is light, and Dark, System and Light follow the switch", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "November 2026" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await chooseTheme(page, "Dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.emulateMedia({ colorScheme: "light" });
  await chooseTheme(page, "System");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await chooseTheme(page, "Light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
