// Contrast of the token pairs in client/src/styles/index.css, in both themes.
// Reads the light values from the @theme block and the dark ones from the [data-theme="dark"] block,
// and follows a var(--color-x) alias. Text needs 4.5:1; an icon, a control's edge, a date bar and the
// focus ring need 3:1. A bar (the glass top bar, the phone bottom bar, a dialog's title bar) and a
// gloss button are gradients: a pair on one is checked at both of its stops, and the worse one counts.
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

/** "#rrggbb", "#rgb" or "rgb(r g b / a)" to [r, g, b, a]. A var(--color-x) alias is looked up in `theme`. */
function parse(value, theme) {
  const alias = /^var\(--([a-z0-9-]+)\)$/.exec(value);
  if (alias) return parse(theme[alias[1]], theme);
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

/** Each pair: a label, the foreground token, the background token (a "|" joins a gradient's stops), the minimum. */
const TEXT = 4.5;
const EDGE = 3;
const BAR = "glass-from|glass-to";
const GLOSS = "gloss-top|gloss-mid|gloss-bottom";
const PAIRS = [
  ["text on an island", "on-surface", "surface-bright", TEXT],
  ["muted text on an island", "on-surface-variant", "surface-bright", TEXT],
  ["text on the sunk tone (date tile, weekday band, footer)", "on-surface", "surface-container-high", TEXT],
  ["muted text on the sunk tone", "on-surface-variant", "surface-container-high", TEXT],
  ["faint text on the sunk tone (other months' dates)", "on-surface-faint", "surface-container-high", TEXT],
  ["text on a bar", "on-surface", BAR, TEXT],
  ["muted text on a bar (inactive tab)", "on-surface-variant", BAR, TEXT],
  ["primary text on an island (links, selected segment)", "primary", "surface-bright", TEXT],
  ["primary text on a bar (wordmark, current tab)", "primary", BAR, TEXT],
  ["primary text on the sunk tone", "primary", "surface-container-high", TEXT],
  ["text on the primary fill (today's disc)", "on-primary", "primary", TEXT],
  ["text on the gloss (Join, Create, the avatar)", "on-primary", GLOSS, TEXT],
  ["error text on an island", "error", "surface-bright", TEXT],
  ["error text on the sunk tone", "error", "surface-container-high", TEXT],
  ["success text on an island", "success", "surface-bright", TEXT],
  ["Game night chip text", "cat-game-night", "chip-game-night", TEXT],
  ["Holiday chip text", "cat-holiday", "chip-holiday", TEXT],
  ["Team building chip text", "cat-team-building", "chip-team-building", TEXT],
  ["Other chip text", "cat-other", "chip-neutral", TEXT],
  ["Game night chip edge on an island", "cat-game-night", "surface-bright", EDGE],
  ["Holiday chip edge on an island", "cat-holiday", "surface-bright", EDGE],
  ["Team building chip edge on an island", "cat-team-building", "surface-bright", EDGE],
  ["Other chip edge on an island", "chip-neutral-edge", "surface-bright", EDGE],
  ["Game night date bar on an island", "cat-game-night", "surface-bright", EDGE],
  ["Holiday date bar on an island", "cat-holiday", "surface-bright", EDGE],
  ["Team building date bar on an island", "cat-team-building", "surface-bright", EDGE],
  ["Other date bar on an island", "cat-other", "surface-bright", EDGE],
  ["rating stars on an island", "cat-game-night", "surface-bright", EDGE],
  ["control edge on an island (buttons, fields, checkboxes)", "outline", "surface-bright", EDGE],
  ["control edge on the sunk tone (segment track)", "outline", "surface-container-high", EDGE],
  ["bar edge on a bar", "outline", BAR, EDGE],
  ["focus ring on the desktop", "focus-ring", "background", EDGE],
  ["focus ring on an island", "focus-ring", "surface-bright", EDGE],
  ["focus ring on a bar", "focus-ring", BAR, EDGE],
  ["focus ring against its halo", "focus-ring", "focus-halo", EDGE],
  ["an island against the desktop (the 1 px edge carries the rest)", "surface-bright", "background", 1.09],
  ["the sunk tone against an island (it also carries an edge)", "surface-container-high", "surface-bright", 1.09],
];

let failed = 0;
const worst = { light: { text: 99, ui: 99 }, dark: { text: 99, ui: 99 } };
for (const [themeName, theme] of [
  ["light", light],
  ["dark", dark],
]) {
  for (const [label, fg, bg, min] of PAIRS) {
    const got = Math.min(
      ...bg.split("|").map((stop) => {
        const behind = parse(theme[`color-${stop}`], theme);
        return ratio(composite(behind, parse(theme[`color-${fg}`], theme)), behind);
      }),
    );
    const need = themeName === "dark" && min === 1.09 ? 1.15 : min;
    const ok = got >= need;
    if (!ok) failed += 1;
    if (min === TEXT) worst[themeName].text = Math.min(worst[themeName].text, got);
    if (min === EDGE) worst[themeName].ui = Math.min(worst[themeName].ui, got);
    console.log(`${ok ? "ok   " : "FAIL "} ${themeName.padEnd(5)} ${label}: ${got.toFixed(2)}:1 (needs ${need})`);
  }
}

for (const name of ["light", "dark"]) {
  console.log(
    `${name}: text minimum ${worst[name].text.toFixed(2)}:1, icon and edge minimum ${worst[name].ui.toFixed(2)}:1`,
  );
}
if (failed > 0) {
  console.error(`check-contrast: ${failed} pair(s) under their minimum`);
  process.exit(1);
}
console.log("check-contrast: every pair is at its own minimum, in both themes");
