import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken, type AuthClaims } from "./jwt.js";
import { SESSION_COOKIE } from "./cookie.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthClaims;
  }
}

/** Attach request.user from the session cookie, if valid. Never throws. */
export function loadUser(request: FastifyRequest): void {
  const token = request.cookies?.[SESSION_COOKIE];
  if (!token) return;
  const claims = verifyToken(token);
  if (claims) request.user = claims;
}

/** preHandler: 401 unless authenticated. */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  loadUser(request);
  if (!request.user) {
    await reply.code(401).send({ error: "unauthorized" });
  }
}

/** preHandler: 401 if not authed, 403 unless admin. */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  loadUser(request);
  if (!request.user) {
    await reply.code(401).send({ error: "unauthorized" });
    return;
  }
  if (request.user.role !== "admin") {
    await reply.code(403).send({ error: "forbidden" });
  }
}

/** Guaranteed-present user after requireAuth ran. */
export function currentUser(request: FastifyRequest): AuthClaims {
  if (!request.user) throw new Error("currentUser called without requireAuth");
  return request.user;
}
