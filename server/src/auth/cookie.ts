import type { FastifyReply } from "fastify";
import { config } from "../config/env.js";

export const SESSION_COOKIE = "se_session";

const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function setSessionCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.isProd,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(reply: FastifyReply): void {
  reply.clearCookie(SESSION_COOKIE, { path: "/" });
}
