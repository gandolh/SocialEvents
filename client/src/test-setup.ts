import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Testing Library's automatic cleanup needs vitest globals, which this repo leaves off.
afterEach(() => {
  cleanup();
});
