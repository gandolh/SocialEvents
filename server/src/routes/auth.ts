import type { FastifyInstance } from "fastify";
import { registerSchema, loginSchema } from "@socialevents/shared";
import { register, login } from "../services/authService.js";
import { signToken } from "../auth/jwt.js";
import { setSessionCookie, clearSessionCookie } from "../auth/cookie.js";
import { requireAuth, currentUser } from "../auth/guards.js";
import { usersRepo } from "../dal/users.js";
import { notFound } from "../http/errors.js";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/register", async (request, reply) => {
    const input = registerSchema.parse(request.body);
    const user = await register(input);
    setSessionCookie(
      reply,
      signToken({ sub: user.id, role: user.role, name: user.name, email: user.email }),
    );
    return reply.code(201).send({ user });
  });

  app.post("/login", async (request, reply) => {
    const input = loginSchema.parse(request.body);
    const user = await login(input);
    setSessionCookie(
      reply,
      signToken({ sub: user.id, role: user.role, name: user.name, email: user.email }),
    );
    return reply.send({ user });
  });

  app.post("/logout", async (_request, reply) => {
    clearSessionCookie(reply);
    return reply.code(204).send();
  });

  app.get("/me", { preHandler: requireAuth }, async (request) => {
    const claims = currentUser(request);
    const user = usersRepo.findById(claims.sub);
    if (!user) throw notFound("user not found");
    return { user };
  });
}
