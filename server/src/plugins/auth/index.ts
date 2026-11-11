import type { FastifyReply } from "fastify";
import type { Config } from "../../config.js";
import { createSessionCookie } from "./cookie.js";
import { createGuards } from "./guards.js";
import { createTokens, type AuthClaims } from "./jwt.js";

export { currentUser } from "./guards.js";
export { hashPassword, verifyPassword } from "./password.js";
export type { AuthClaims } from "./jwt.js";

/** Sessions: the guards that protect routes and the calls that start and end one. Built once from the settings. */
export function createAuth(config: Pick<Config, "jwtSecret" | "isProd">) {
  const tokens = createTokens(config.jwtSecret);
  const cookie = createSessionCookie(config.isProd);
  const guards = createGuards(tokens);
  return {
    requireAuth: guards.requireAuth,
    requireAdmin: guards.requireAdmin,
    /** Sign the person in: a token in the session cookie. */
    startSession(reply: FastifyReply, claims: AuthClaims): void {
      cookie.set(reply, tokens.sign(claims));
    },
    endSession(reply: FastifyReply): void {
      cookie.clear(reply);
    },
  };
}

export type Auth = ReturnType<typeof createAuth>;
