import type { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { hasZodFastifySchemaValidationErrors, ResponseSerializationError } from "@fastify/type-provider-zod";
import { HttpError } from "../lib/http-error.js";

/** The `error` code for a 4xx that Fastify or a plugin raised, by status. */
function clientErrorCode(status: number): string {
  switch (status) {
    case 404:
      return "not_found";
    case 413:
      return "payload_too_large";
    case 415:
      return "unsupported_media_type";
    case 429:
      return "rate_limited";
    default:
      return "bad_request";
  }
}

/** The status a thrown value carries, if it carries one (Fastify's own errors and its plugins' do). */
function statusOf(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("statusCode" in error)) return undefined;
  return typeof error.statusCode === "number" ? error.statusCode : undefined;
}

/**
 * The one error handler. The body stays the repo's flat `{ error, message? }`.
 *
 * - `HttpError` answers its status and code.
 * - A request that fails its route schema answers 400 `validation_error`, with the first issue's message.
 * - A 4xx that Fastify or a plugin raised (bad JSON, a body too large, a rate limit) keeps its status.
 * - Anything else is a 500 `internal_error`, logged with the request. A thrown message never reaches the client.
 */
const errorHandling: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error: unknown, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({ error: "validation_error", message: error.validation[0]?.message });
    }
    if (error instanceof HttpError) {
      return reply.code(error.statusCode).send({ error: error.errorCode, message: error.message });
    }
    const status = statusOf(error);
    if (status !== undefined && status >= 400 && status < 500) {
      if (status === 429) return reply.code(429).send({ error: "rate_limited" });
      const message = error instanceof Error ? error.message : undefined;
      return reply.code(status).send({ error: clientErrorCode(status), message });
    }
    if (error instanceof ResponseSerializationError) {
      // A handler sent what its response schema doesn't allow: a bug to fix, never the client's fault. The reply
      // holds people's data, so the log names the route and not the zod issues.
      request.log.error(`${request.method} ${request.url}: the reply does not match its response schema`);
    } else {
      request.log.error({ err: error }, `${request.method} ${request.url}: unhandled error`);
    }
    return reply.code(500).send({ error: "internal_error" });
  });
};

export const errors = fp(errorHandling, { name: "errors" });

/**
 * Sets the 404 handler, rate-limited: a scanner walking unknown paths gets 429s, not a free 404 per guess.
 * Needs `@fastify/rate-limit` registered first. Exactly one place in the app calls this.
 */
export function setRateLimitedNotFound(
  app: FastifyInstance,
  handler: (request: FastifyRequest, reply: FastifyReply) => unknown,
): void {
  app.setNotFoundHandler({ preHandler: app.rateLimit({ max: 60, timeWindow: "1 minute" }) }, handler);
}

/** The JSON 404 for a path no route answers. */
export function jsonNotFound(_request: FastifyRequest, reply: FastifyReply): FastifyReply {
  return reply.code(404).send({ error: "not_found" });
}
