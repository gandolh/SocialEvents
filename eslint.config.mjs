import { houseStyle } from "./vendor/house-style/eslint.config.js";

/**
 * The house config from the vendored house-style copy, given SocialEvents' folders. Thin on purpose:
 * the compiler is the first gate, and the house adds only what it cannot see. The rules and the
 * reason for each are in the copy.
 */
export default [
  ...houseStyle({
    root: import.meta.dirname,
    web: "client/src",
    server: "server/src",
    // Allowed to print: the server entry (a bad setting exits before any logger exists), the migrate and
    // seed CLIs (they talk to the person running them) and the config module (it runs before any logger).
    console: ["server/src/server.ts", "server/src/db/migrate.ts", "server/src/seed/seed.ts", "server/src/config.ts"],
    // The one reader of the environment.
    env: ["server/src/config.ts"],
    tailwind: { css: "client/src/styles/index.css", order: true },
    // data/ is the local database.
    ignores: ["data/**", "client/dist-types/**"],
  }),
];
