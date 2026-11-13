import { describe, expect, it } from "vitest";
import { escapeHtml, singleLine } from "./html.js";

describe("escapeHtml", () => {
  it("escapes the five characters", () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
    );
  });
  it("leaves plain text alone", () => {
    expect(escapeHtml("Team lunch, 12:30")).toBe("Team lunch, 12:30");
  });
});

describe("singleLine", () => {
  it("replaces line breaks with a space", () => {
    expect(singleLine("a\r\nBcc: x@y.z\nb")).toBe("a Bcc: x@y.z b");
  });
});
