import type { FastifyPluginAsync } from "fastify";
import fastifyStatic from "@fastify/static";

export interface ClientStaticOptions {
  /** The built client's folder. */
  root: string;
}

/**
 * Serves the built client from the same origin (single-origin production). A path under `/api` that no route
 * answers stays a JSON 404; any other unknown path gets `index.html`, so the client's router can take it.
 */
export const clientStatic: FastifyPluginAsync<ClientStaticOptions> = async (app, { root }) => {
  await app.register(fastifyStatic, { root });
  app.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith("/api")) {
      return reply.code(404).send({ error: "not_found" });
    }
    return reply.sendFile("index.html");
  });
};
