---
paths:
  - "client/src/**"
---

# The web client (`client/src`)

- Read [corpus/wiki/design-system.md](../../corpus/wiki/design-system.md) before you add or change a screen.
- Components come through `client/src/components/ui/`. A new control goes there, not inline in a route.
- The Aero theme is the skin ([corpus/wiki/decisions.md](../../corpus/wiki/decisions.md)): colours and glass
  surfaces come from the `@theme` tokens in `client/src/styles/index.css`.
- No inline `style` except for computed geometry.
- A promise a handler discards is marked `void`; an async handler is wrapped: `onClick={() => void save()}`.
- `client/src/lib/utils.ts` and `ProfileModal.tsx` still hold arbitrary hex colours, and `AdminPage.tsx` a native
  `confirm()`. `npm run check:conventions` lists them (`check-base-ui --warn-only`); add no new ones.
- Brief 16 adds the Base UI lines here and drops that `--warn-only`.
- Read the `house-style` skill for the rest of the rules and why each exists.
