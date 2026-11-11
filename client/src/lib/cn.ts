import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge, told the app's own @theme names, so it can tell that two z
 * values clash. Keep the list in step with the `--z-index-*` tokens in
 * `styles/index.css`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      z: [{ z: ["sticky", "overlay", "dialog", "popup"] }],
    },
  },
});

/** Joins class names, and lets a later class win over an earlier one it conflicts with. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
