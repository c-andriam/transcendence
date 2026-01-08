import { FastifyRequest, FastifyReply } from "fastify";
import { ForbiddenError } from "@transcendence/common";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const apiKey = request.headers["x-gateway-api-key"];
    if (!apiKey) {
        request.log.warn("API Key not found");
        throw new ForbiddenError("API Key not found");
    }
    if (apiKey !== process.env.API_GATEWAY_KEY) {
        request.log.warn("invalid API Key");
        throw new ForbiddenError("Invalid API Key");
    }
}