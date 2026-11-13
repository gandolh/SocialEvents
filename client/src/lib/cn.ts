import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge, told the app's own @theme names, so it can tell that two z
 * values clash. Keep the lists in step with the `--z-index-*`, `--text-*` and
 * `--radius-tile` tokens in `styles/index.css`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      z: [{ z: ["sticky", "overlay", "dialog", "popup"] }],
      // The type scale in `--text-*`: without this, `text-label` reads as a colour and drops a `text-primary`.
      "font-size": [{ text: ["label", "small", "body", "list", "title", "dialog", "month"] }],
      rounded: [{ rounded: ["tile"] }],
    },
  },
});

/** Joins class names, and lets a later class win over an earlier one it conflicts with. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
