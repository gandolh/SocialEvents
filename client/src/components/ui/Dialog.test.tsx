import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog.js";

function press(element: Element) {
  fireEvent.pointerDown(element);
  fireEvent.mouseDown(element);
  fireEvent.pointerUp(element);
  fireEvent.mouseUp(element);
  fireEvent.click(element);
}

describe("Dialog", () => {
  it("names itself by its title and closes on Escape", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Detail">
        <p>Body</p>
      </Dialog>,
    );
    expect(await screen.findByRole("dialog", { name: "Detail" })).toBeTruthy();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on an outside press unless dismissOnBackdrop is false", async () => {
    const closes = vi.fn();
    const { unmount } = render(
      <Dialog open onClose={closes} title="Detail">
        <p>Body</p>
      </Dialog>,
    );
    await screen.findByRole("dialog");
    press(document.body);
    expect(closes).toHaveBeenCalledTimes(1);
    unmount();

    const form = vi.fn();
    render(
      <Dialog open onClose={form} title="Form" dismissOnBackdrop={false}>
        <input aria-label="Name" />
      </Dialog>,
    );
    await screen.findByRole("dialog");
    press(document.body);
    expect(form).not.toHaveBeenCalled();
  });

  it("leaves an Escape that a control inside already used", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Form">
        <input
          aria-label="Time"
          onKeyDown={(event) => {
            if (event.key === "Escape") event.preventDefault();
          }}
        />
      </Dialog>,
    );
    fireEvent.keyDown(await screen.findByLabelText("Time"), { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes from the X", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="Detail">
        <p>Body</p>
      </Dialog>,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
