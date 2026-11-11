// Contrast of the token pairs in client/src/styles/index.css, in both themes.
// Reads the light values from the @theme block and the dark ones from the [data-theme="dark"] block.
// Text needs 4.5:1; the focus ring and a control's edge need 3:1. Translucent layers (the glass) are
// composited over the desktop's middle colour first, the way the browser stacks them.
// Exits 1 when a pair is under its minimum.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../client/src/styles/index.css", import.meta.url), "utf8");

function block(opener) {
  const start = css.indexOf(opener);
  if (start === -1) throw new Error(`index.css has no "${opener}" block`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

function tokens(body) {
  const out = {};
  for (const [, name, value] of body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) out[name] = value.trim();
  return out;
}

const light = tokens(block("@theme"));
const dark = { ...light, ...tokens(block(':root[data-theme="dark"]')) };

/** "#rrggbb", "#rgb" or "rgb(r g b / a)" to [r, g, b, a]. */
function parse(value) {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  const fn = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+))?\s*\)$/.exec(value);
  if (fn) return [Number(fn[1]), Number(fn[2]), Number(fn[3]), fn[4] === undefined ? 1 : Number(fn[4])];
  throw new Error(`cannot read the colour "${value}"`);
}

/** Lays colours over one another, the first being opaque. */
function composite(...layers) {
  let [r, g, b] = layers[0];
  for (const [lr, lg, lb, la] of layers.slice(1)) {
    r = lr * la + r * (1 - la);
    g = lg * la + g * (1 - la);
    b = lb * la + b * (1 - la);
  }
  return [r, g, b, 1];
}

function luminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Each pair: a label, the foreground token, the stack of tokens behind it, and the minimum.
 *
 * KNOWN_LIGHT holds the light-theme pairs that were already under the minimum when the dark theme
 * arrived (brief 16 changes no light colour). Each keeps a floor, the ratio measured then, so it
 * cannot get worse, and is listed in the output. Brief 18's redesign is the place to lift them,
 * and each entry goes as it does.
 */
const KNOWN_LIGHT = {
  "muted text on the sidebar and top bar": 4.38,
  "muted text on the content panel": 4.21,
  "primary text on a card": 4.03,
  "error text on a card": 4.48,
  "Team building chip": 4.43,
  "initials on an avatar": 3.71,
  "a chosen radio's text": 3.51,
};

const TEXT = 4.5;
const EDGE = 3;
const PAIRS = [
  ["text on the page", "on-surface", ["surface"], TEXT],
  ["muted text on the page", "on-surface-variant", ["surface"], TEXT],
  ["text on a raised surface", "on-surface", ["surface-container-lowest"], TEXT],
  ["muted text on a container", "on-surface-variant", ["surface-container"], TEXT],
  ["text on the sidebar and top bar", "on-surface", ["desktop-mid", "glass-to"], TEXT],
  ["muted text on the sidebar and top bar", "on-surface-variant", ["desktop-mid", "glass-to"], TEXT],
  ["text on the content panel", "on-surface", ["desktop-mid", "glass-panel"], TEXT],
  ["muted text on the content panel", "on-surface-variant", ["desktop-mid", "glass-panel"], TEXT],
  ["text on a card", "on-surface", ["desktop-mid", "glass-panel", "glass-to"], TEXT],
  ["muted text on a card", "on-surface-variant", ["desktop-mid", "glass-panel", "glass-to"], TEXT],
  ["text in a dialog", "on-surface", ["desktop-mid", "glass-strong-to"], TEXT],
  ["muted text in a dialog", "on-surface-variant", ["desktop-mid", "glass-strong-to"], TEXT],
  ["text in a field", "on-surface", ["desktop-mid", "glass-strong-to", "field"], TEXT],
  ["text on the primary button", "on-primary", ["primary"], TEXT],
  ["text on the social button", "on-secondary", ["social-mid"], TEXT],
  ["text on the danger button", "on-error", ["danger-mid"], TEXT],
  ["primary text on a card", "primary", ["desktop-mid", "glass-panel", "glass-to"], TEXT],
  ["error text on a card", "error", ["desktop-mid", "glass-panel", "glass-to"], TEXT],
  ["success text on a dialog", "success", ["desktop-mid", "glass-strong-to"], TEXT],
  ["Game night chip", "secondary", ["chip-game-night"], TEXT],
  ["Holiday chip", "tertiary", ["chip-holiday"], TEXT],
  ["Team building chip", "cat-team-building", ["chip-team-building"], TEXT],
  ["other chip", "on-surface-variant", ["desktop-mid", "glass-panel", "glass-to", "chip-neutral"], TEXT],
  ["initials on an avatar", "on-primary", ["primary-container"], TEXT],
  ["focus ring on a dialog", "focus-ring", ["desktop-mid", "glass-strong-to"], EDGE],
  ["focus ring on a card", "focus-ring", ["desktop-mid", "glass-panel", "glass-to"], EDGE],
  ["focus ring on the page", "focus-ring", ["surface"], EDGE],
  ["a chosen radio's text", "primary", ["desktop-mid", "glass-strong-to", "primary-tint"], TEXT],
];

let failed = 0;
for (const [themeName, theme] of [
  ["light", light],
  ["dark", dark],
]) {
  // bg-primary/10, the chosen radio's tint.
  const withDerived = {
    ...theme,
    "color-primary-tint": `rgb(${parse(theme["color-primary"]).slice(0, 3).join(" ")} / 0.1)`,
  };
  for (const [label, fg, stack, min] of PAIRS) {
    const behind = composite(...stack.map((name) => parse(withDerived[`color-${name}`])));
    const front = parse(withDerived[`color-${fg}`]);
    const got = ratio(composite(behind, front), behind);
    const floor = themeName === "light" ? KNOWN_LIGHT[label] : undefined;
    const ok = got >= (floor ?? min);
    if (!ok) failed += 1;
    const tag = !ok ? "FAIL" : floor !== undefined && got < min ? "known" : "ok";
    console.log(`${tag.padEnd(5)} ${themeName.padEnd(5)} ${label}: ${got.toFixed(2)}:1 (needs ${min})`);
  }
}

if (failed > 0) {
  console.error(`check-contrast: ${failed} pair(s) under their minimum`);
  process.exit(1);
}
console.log("check-contrast: no pair is under its minimum, or under its floor where one is listed");
