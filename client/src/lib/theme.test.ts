import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const KEY = "socialevents-theme";

/** A fresh copy of the store, as a page load would build it, with the system's colour scheme faked. */
async function load(options: { stored?: string; throws?: boolean; dark?: boolean } = {}) {
  vi.resetModules();
  localStorage.clear();
  if (options.stored) localStorage.setItem(KEY, options.stored);
  if (options.throws) {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
  }
  let dark = options.dark ?? false;
  const listeners = new Set<() => void>();
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return dark;
    },
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  }));
  const theme = await import("./theme.js");
  return {
    theme,
    flipSystem(next: boolean) {
      dark = next;
      for (const listener of listeners) listener();
    },
  };
}

beforeEach(() => {
  delete document.documentElement.dataset.theme;
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("the theme store", () => {
  it("is light on a first visit, even when the system is dark", async () => {
    const { theme } = await load({ dark: true });
    expect(theme.getTheme()).toBe("light");
  });

  it("returns the stored choice", async () => {
    const { theme } = await load({ stored: "dark" });
    expect(theme.getTheme()).toBe("dark");
  });

  it("ignores a stored value it does not know", async () => {
    const { theme } = await load({ stored: "sepia" });
    expect(theme.getTheme()).toBe("light");
  });

  it("survives a localStorage that throws", async () => {
    const { theme } = await load({ throws: true });
    expect(theme.getTheme()).toBe("light");
    expect(() => theme.setTheme("dark")).not.toThrow();
    expect(theme.getTheme()).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("applies a choice to <html> and keeps it", async () => {
    const { theme } = await load();
    theme.setTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(KEY)).toBe("dark");
  });

  it("resolves System from the system's colour scheme", async () => {
    const { theme } = await load({ dark: true });
    expect(theme.resolve("system", true)).toBe("dark");
    expect(theme.resolve("system", false)).toBe("light");
    expect(theme.resolve("light", true)).toBe("light");
    theme.setTheme("system");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("follows the system while System is chosen, and only then", async () => {
    const { theme, flipSystem } = await load({ dark: false });
    const stop = theme.watchSystemTheme();
    theme.setTheme("system");
    expect(document.documentElement.dataset.theme).toBe("light");
    flipSystem(true);
    expect(document.documentElement.dataset.theme).toBe("dark");
    theme.setTheme("light");
    flipSystem(false);
    flipSystem(true);
    expect(document.documentElement.dataset.theme).toBe("light");
    stop();
  });
});
