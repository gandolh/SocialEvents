import preset from "./vendor/house-style/knip.json" with { type: "json" };

// knip has no `extends`, so this spreads the house preset. SocialEvents adds the entry knip can't find
// on its own: the changed-files script that `check:fast` runs.
export default {
  ...preset,
  workspaces: { ".": { entry: ["scripts/*.mjs"] } },
};
