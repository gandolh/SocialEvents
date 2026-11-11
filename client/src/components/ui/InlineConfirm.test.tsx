import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineConfirm } from "./InlineConfirm.js";

function setup(onConfirm: () => Promise<unknown>) {
  render(
    <InlineConfirm
      question="Delete?"
      yesLabel="Yes, delete it"
      onConfirm={onConfirm}
      trigger={(ask) => <button onClick={ask}>Delete</button>}
    />,
  );
}

describe("InlineConfirm", () => {
  it("asks in place, with focus on No, and No puts the trigger back", async () => {
    const onConfirm = vi.fn(() => Promise.resolve());
    setup(onConfirm);
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("group", { name: "Delete?" })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "No" }));
    fireEvent.click(screen.getByRole("button", { name: "No" }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Delete" })));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("Escape cancels", () => {
    setup(() => Promise.resolve());
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.keyDown(screen.getByRole("button", { name: "No" }), { key: "Escape" });
    expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
  });

  it("disables Yes while the request runs, then returns to the trigger", async () => {
    let finish: () => void = () => undefined;
    const request = new Promise<void>((resolve) => {
      finish = resolve;
    });
    setup(() => request);
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete it" }));
    expect(screen.getByRole("button", { name: "Yes, delete it" })).toHaveProperty("disabled", true);
    finish();
    await waitFor(() => expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy());
  });

  it("says so when the request fails", async () => {
    setup(() => Promise.reject(new Error("nope")));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, delete it" }));
    expect(await screen.findByText("Could not delete.")).toBeTruthy();
  });
});
