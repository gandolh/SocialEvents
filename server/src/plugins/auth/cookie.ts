import type { FastifyReply } from "fastify";

export const SESSION_COOKIE = "se_session";

const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

/** The session cookie: set it on sign-in, clear it on sign-out. `secure` in production only. */
export function createSessionCookie(secure: boolean) {
  return {
    set(reply: FastifyReply, token: string): void {
      reply.setCookie(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: MAX_AGE_SECONDS,
      });
    },
    clear(reply: FastifyReply): void {
      reply.clearCookie(SESSION_COOKIE, { path: "/" });
    },
  };
}
