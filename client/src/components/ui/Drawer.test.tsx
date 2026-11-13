import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SheetDrawer } from "./Drawer.js";

function Harness({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <SheetDrawer
      open={open}
      onClose={() => {
        onClose?.();
        setOpen(false);
      }}
      title="Pub Quiz Night"
      footer={<button>Join</button>}
    >
      <p>Teams of four.</p>
    </SheetDrawer>
  );
}

describe("SheetDrawer", () => {
  it("is named by its title and holds its body and footer", async () => {
    render(<Harness />);
    expect(await screen.findByRole("dialog", { name: "Pub Quiz Night" })).toBeTruthy();
    expect(screen.getByText("Teams of four.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Join" })).toBeTruthy();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await screen.findByRole("dialog");
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes from the X", async () => {
    render(<Harness />);
    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
