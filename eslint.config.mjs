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
    // Allowed to print: the server entry and the migrate and seed CLIs talk to the person running
    // them, and the config module runs before any logger exists.
    console: ["server/src/index.ts", "server/src/db/migrate.ts", "server/src/seed/seed.ts", "server/src/config/env.ts"],
    tailwind: { css: "client/src/styles/index.css", order: true },
    // data/ is the local database.
    ignores: ["data/**", "client/dist-types/**"],
  }),
  {
    // The one reader of the environment is server/src/config/env.ts; the house names a file called
    // config.ts. When that module is renamed to config.ts, this block goes.
    name: "socialevents/env-module",
    files: ["server/src/config/env.ts"],
    rules: { "n/no-process-env": "off" },
  },
  {
    // A warning for now (2026-11-11): the mailer still prints through console. When it takes the
    // Fastify logger, this block goes and the rule is an error again.
    name: "socialevents/email-console-warns",
    files: ["server/src/integrations/email/index.ts"],
    rules: { "no-console": "warn" },
  },
];
