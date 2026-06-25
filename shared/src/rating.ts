import { z } from "zod";
import { ratingValueSchema } from "./common.js";
import { ratingAggregateSchema } from "./event.js";

/** Rating response: aggregate plus the caller's own rating (if any). */
export const ratingResponseSchema = z.object({
  aggregate: ratingAggregateSchema,
  myRating: ratingValueSchema.nullable(),
});
export type RatingResponse = z.infer<typeof ratingResponseSchema>;

export const setRatingSchema = z.object({
  rating: ratingValueSchema,
});
export type SetRatingInput = z.infer<typeof setRatingSchema>;
