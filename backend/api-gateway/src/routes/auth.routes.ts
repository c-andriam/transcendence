import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", async (request, reply) => {
        const { statusCode, body } = await proxyRequest(request, reply, "/register", AUTH_SERVICE_URL);
        return reply.status(statusCode).send(body);
    });

    app.post("/login", async (request, reply) => {
        const { statusCode, body } = await proxyRequest(request, reply, "/login", AUTH_SERVICE_URL);
        return reply.status(statusCode).send(body);
    });
}