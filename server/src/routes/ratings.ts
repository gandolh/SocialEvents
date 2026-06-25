import type { FastifyInstance } from "fastify";
import { setRatingSchema, idSchema } from "@socialevents/shared";
import { z } from "zod";
import { requireAuth, currentUser } from "../auth/guards.js";
import { hostRatingsRepo } from "../dal/ratings.js";
import { usersRepo } from "../dal/users.js";
import { notFound } from "../http/errors.js";

const idParamsSchema = z.object({ id: idSchema });

/** Host (user) ratings, mounted under /users/:id/rating. */
export async function hostRatingRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireAuth);

  app.get("/:id/rating", async (request) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    return hostRatingsRepo.get(id, me.sub);
  });

  app.put("/:id/rating", async (request) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    if (!usersRepo.findById(id)) throw notFound("user not found");
    const { rating } = setRatingSchema.parse(request.body);
    return hostRatingsRepo.set(id, me.sub, rating);
  });

  app.delete("/:id/rating", async (request) => {
    const me = currentUser(request);
    const { id } = idParamsSchema.parse(request.params);
    return hostRatingsRepo.remove(id, me.sub);
  });
}
