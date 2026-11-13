const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Text that goes into mail HTML: markup in it arrives as text. Every user-supplied value takes this. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

/** A header value on one line: every run of CR and LF becomes a single space. */
export function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}
