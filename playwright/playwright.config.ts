import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

/**
 * The UI specs. They run against a running, seeded test server (see README.md: the seed, the built client,
 * a throwaway database) whose address is SOCIALEVENTS_URL (3009, the hub's usual port, when it is not set). `global-setup.ts` adds the fixture events and
 * signs the seed users in. Two workers at most: other work shares the machine.
 */
const baseURL = process.env["SOCIALEVENTS_URL"] ?? "http://localhost:3009";

export default defineConfig({
  testDir: "./tests",
  outputDir: join(__dirname, ".output/results"),
  globalSetup: "./global-setup.ts",
  workers: 2,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    locale: "en-US",
    timezoneId: "UTC",
    colorScheme: "light",
    storageState: join(__dirname, ".output/alex.json"),
  },
});
