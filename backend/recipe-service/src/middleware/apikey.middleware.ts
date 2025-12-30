import { FastifyRequest, FastifyReply } from "fastify";

export async function apikeyMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const internalApiKey = request.headers["x-internal-api-key"];
    if (!internalApiKey) {
        request.log.warn("Missing internal API Key");
        return reply.status(403).send({
            error: "Forbidden",
            message: "Missing internal API Key"
        });
    }
    if (internalApiKey !== process.env.INTERNAL_API_KEY) {
        request.log.warn("Invalid internal API Key");
        return reply.status(403).send({
            error: "Forbidden",
            message: "Invalid internal API Key"
        });
    }
}