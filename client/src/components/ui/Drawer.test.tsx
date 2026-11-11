import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { NavDrawer } from "./Drawer.js";

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <NavDrawer open={open} onOpenChange={setOpen} title="Menu" trigger={<button>Open the menu</button>}>
      <a
        href="#events"
        onClick={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
      >
        All Events
      </a>
    </NavDrawer>
  );
}

async function openDrawer() {
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: "Open the menu" }));
  return screen.findByRole("dialog", { name: "Menu" });
}

describe("NavDrawer", () => {
  it("opens with a title that names it", async () => {
    expect(await openDrawer()).toBeTruthy();
  });

  it("closes on Escape", async () => {
    await openDrawer();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("closes when a link inside it is pressed", async () => {
    await openDrawer();
    fireEvent.click(screen.getByRole("link", { name: "All Events" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("closes from the X", async () => {
    await openDrawer();
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
