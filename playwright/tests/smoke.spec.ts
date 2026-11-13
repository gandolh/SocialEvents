import { expect, open, test } from "../fixtures.js";

test("the calendar opens on the fixture month", async ({ page }) => {
  await open(page, "/");
  await expect(page.getByRole("heading", { name: "November 2026" })).toBeVisible();
});
