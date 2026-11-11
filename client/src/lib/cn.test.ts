import { describe, expect, it } from "vitest";
import { cn } from "./cn.js";

describe("cn", () => {
  it("drops falsy values", () => {
    expect(cn("flex", false, null, undefined, "gap-2")).toBe("flex gap-2");
  });

  it("lets a later utility win over an earlier one it conflicts with", () => {
    expect(cn("px-2 px-4")).toBe("px-4");
  });

  it("knows the app's z-index tokens", () => {
    expect(cn("z-overlay", "z-dialog")).toBe("z-dialog");
  });
});
