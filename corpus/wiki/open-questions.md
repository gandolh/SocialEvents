# Open questions

Only genuinely unresolved items. Delete each the moment it's answered.

- **Event cover images.** The Stitch `event_details` screen shows a photographic
  cover banner. SPEC.md's data model has no image field. Decide: add
  `events.cover_image_url` (and an upload/placeholder story) or use a
  category-based generated/placeholder banner? *Leaning: category placeholder for
  v1, no upload.*
- **bcrypt native build** in the eventual deploy env — confirm node-gyp works;
  else switch to `bcryptjs` (revisit [decisions.md](decisions.md) + log).
