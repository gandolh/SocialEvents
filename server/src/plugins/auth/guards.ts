import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthClaims, Tokens } from "./jwt.js";
import { SESSION_COOKIE } from "./cookie.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthClaims;
  }
}

/** Guaranteed-present user after requireAuth ran. */
export function currentUser(request: FastifyRequest): AuthClaims {
  if (!request.user) throw new Error("currentUser called without requireAuth");
  return request.user;
}

/** The two route guards, for hooks that run before a route's schema validation (so a signed-out request is a 401, never a 400). */
export function createGuards(tokens: Tokens) {
  /** Attach request.user from the session cookie, if valid. Never throws. */
  function loadUser(request: FastifyRequest): void {
    const token = request.cookies?.[SESSION_COOKIE];
    if (!token) return;
    const claims = tokens.verify(token);
    if (claims) request.user = claims;
  }

  return {
    /** Hook: 401 unless authenticated. */
    async requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
      loadUser(request);
      if (!request.user) {
        await reply.code(401).send({ error: "unauthorized" });
      }
    },
    /** Hook: 401 if not authed, 403 unless admin. */
    async requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
      loadUser(request);
      if (!request.user) {
        await reply.code(401).send({ error: "unauthorized" });
        return;
      }
      if (request.user.role !== "admin") {
        await reply.code(403).send({ error: "forbidden" });
      }
    },
  };
}
