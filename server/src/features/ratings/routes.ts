import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { idParamsSchema, ratingResponseSchema, setRatingSchema } from "@socialevents/shared";
import { notFound } from "../../lib/http-error.js";
import { currentUser, type Auth } from "../../plugins/auth/index.js";
import type { RatingsStore } from "./store.js";

/** What this feature takes from the app's context. The two lookups keep it from importing the events or users features. */
export interface RatingsOptions {
  ratings: RatingsStore;
  auth: Auth;
  /** Whether an event with this id exists. */
  eventExists: (id: string) => boolean;
  /** Whether a user with this id exists. */
  userExists: (id: string) => boolean;
}

/** Event ratings (`/events/:id/rating`) and host ratings (`/users/:id/rating`): the same three routes on two tables. */
export const ratingRoutes: FastifyPluginAsyncZod<RatingsOptions> = async (
  app,
  { ratings, auth, eventExists, userExists },
) => {
  // Every route here needs a session, checked before the request is validated.
  app.addHook("preValidation", auth.requireAuth);

  const subjects = [
    { path: "/api/events/:id/rating", store: ratings.event, exists: eventExists, missing: "event not found" },
    { path: "/api/users/:id/rating", store: ratings.host, exists: userExists, missing: "user not found" },
  ] as const;

  for (const { path, store, exists, missing } of subjects) {
    app.get(path, { schema: { params: idParamsSchema, response: { 200: ratingResponseSchema } } }, (request) => {
      const me = currentUser(request);
      return store.get(request.params.id, me.sub);
    });

    app.put(
      path,
      { schema: { params: idParamsSchema, body: setRatingSchema, response: { 200: ratingResponseSchema } } },
      (request) => {
        const me = currentUser(request);
        if (!exists(request.params.id)) throw notFound(missing);
        return store.set(request.params.id, me.sub, request.body.rating);
      },
    );

    app.delete(path, { schema: { params: idParamsSchema, response: { 200: ratingResponseSchema } } }, (request) => {
      const me = currentUser(request);
      return store.remove(request.params.id, me.sub);
    });
  }
};
