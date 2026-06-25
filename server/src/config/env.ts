import "dotenv/config";
import { z } from "zod";
import crypto from "node:crypto";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_PATH: z.string().default("./data/socialevents.sqlite"),
  CLIENT_ORIGIN: z.string().optional(),
  JWT_SECRET: z.string().optional(),

  WEATHER_API_KEY: z.string().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("SocialEvents <no-reply@socialevents.local>"),
});

const parsed = envSchema.parse(process.env);

function resolveJwtSecret(): string {
  if (parsed.JWT_SECRET && parsed.JWT_SECRET.length >= 16) {
    return parsed.JWT_SECRET;
  }
  if (parsed.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET is required in production (min 16 chars). Set it in the environment.",
    );
  }
  const ephemeral = crypto.randomBytes(32).toString("hex");
  // eslint-disable-next-line no-console
  console.warn(
    "[config] JWT_SECRET not set — using an ephemeral dev secret. " +
      "Sessions will not survive a restart. Set JWT_SECRET to persist them.",
  );
  return ephemeral;
}

export const config = {
  nodeEnv: parsed.NODE_ENV,
  isProd: parsed.NODE_ENV === "production",
  isTest: parsed.NODE_ENV === "test",
  port: parsed.PORT,
  databasePath: parsed.DATABASE_PATH,
  clientOrigin: parsed.CLIENT_ORIGIN,
  jwtSecret: resolveJwtSecret(),
  weather: {
    apiKey: parsed.WEATHER_API_KEY || null,
  },
  smtp: {
    host: parsed.SMTP_HOST || null,
    port: parsed.SMTP_PORT,
    user: parsed.SMTP_USER || null,
    pass: parsed.SMTP_PASS || null,
    from: parsed.SMTP_FROM,
  },
} as const;

export type AppConfig = typeof config;
