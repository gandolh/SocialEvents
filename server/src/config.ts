import dotenv from "dotenv";
import { z } from "zod";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** The server's `.env`: beside `package.json`, found from this file (`src/` and `dist/` sit at the same depth). */
const ENV_FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_PATH: z.string().default("./data/socialevents.sqlite"),
  CLIENT_ORIGIN: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  /** `true` when a reverse proxy sits in front, so `request.ip` is the client and not the proxy. */
  TRUST_PROXY: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  WEATHER_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("SocialEvents <no-reply@socialevents.local>"),
});

/** The server's settings, parsed once at start. No other file reads the environment. */
export interface Config {
  nodeEnv: "development" | "production" | "test";
  isProd: boolean;
  isTest: boolean;
  port: number;
  databasePath: string;
  clientOrigin: string | undefined;
  jwtSecret: string;
  trustProxy: boolean;
  weather: { apiKey: string | null };
  smtp: { host: string | null; port: number; user: string | null; pass: string | null; from: string };
}

function resolveJwtSecret(parsed: z.infer<typeof envSchema>): string {
  if (parsed.JWT_SECRET && parsed.JWT_SECRET.length >= 16) {
    return parsed.JWT_SECRET;
  }
  if (parsed.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production (min 16 chars). Set it in the environment.");
  }
  const ephemeral = crypto.randomBytes(32).toString("hex");
  console.warn(
    "[config] JWT_SECRET not set — using an ephemeral dev secret. " +
      "Sessions will not survive a restart. Set JWT_SECRET to persist them.",
  );
  return ephemeral;
}

/** Reads `server/.env` into the environment when it exists, keeping any variable already set. Returns the path used. */
export function loadEnvFile(file: string = ENV_FILE): string | undefined {
  if (!fs.existsSync(file)) return undefined;
  dotenv.config({ path: file, quiet: true });
  return file;
}

/** Parses the settings. A bad value throws, naming it; a missing file is normal (every key is optional). */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.parse(env);
  return {
    nodeEnv: parsed.NODE_ENV,
    isProd: parsed.NODE_ENV === "production",
    isTest: parsed.NODE_ENV === "test",
    port: parsed.PORT,
    databasePath: parsed.DATABASE_PATH,
    clientOrigin: parsed.CLIENT_ORIGIN,
    jwtSecret: resolveJwtSecret(parsed),
    trustProxy: parsed.TRUST_PROXY,
    weather: { apiKey: parsed.WEATHER_API_KEY || null },
    smtp: {
      host: parsed.SMTP_HOST || null,
      port: parsed.SMTP_PORT,
      user: parsed.SMTP_USER || null,
      pass: parsed.SMTP_PASS || null,
      from: parsed.SMTP_FROM,
    },
  };
}

// Until step 6 of brief 17 hands the settings to each module, they import this one value.
loadEnvFile();
export const config = loadConfig();
