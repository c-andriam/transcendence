import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

export async function usersRoutes(app: FastifyInstance) {
    app.get("/users", async (request, reply) => {
        const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users", USER_SERVICE_URL!);
        return reply.status(statusCode).send(body);
    });

    app.get("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL!);
        return reply.status(statusCode).send(body);
    });

    app.post("/users", async (request, reply) => {
        const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users", USER_SERVICE_URL!);
        return reply.status(statusCode).send(body);
    });

    app.put("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL!);
        return reply.status(statusCode).send(body);
    });

    app.delete("/users/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL!);
        return reply.status(statusCode).send(body);
    });
}
