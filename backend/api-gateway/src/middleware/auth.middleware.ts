import { FastifyRequest, FastifyReply } from "fastify";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const apiKey = request.headers["x-api-key"];
    if (!apiKey) {
        request.log.warn("API Key not found");
        return reply.status(403).send({
            error: "Forbidden",
            message: "API Key not found"
        });
    }
    if (apiKey !== process.env.API_GATEWAY_KEY) {
        request.log.warn("invalid API Key");
        return reply.status(403).send({
            error: "Forbidden",
            message: "Invalid API Key"
        });
    }
    return reply.status(200).send({
        success: "Success",
        message: "valid API Key",
        API_KEY: apiKey
    });
}