import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

if (!USER_SERVICE_URL) {
    throw new Error("USER_SERVICE_URL is not defined");
}

export async function usersRoutes(app: FastifyInstance) {
    app.get("/users", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                status: "error",
                message: "User service is unavailable"
            });
        }
    });

    app.get("/users/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                status: "error",
                message: "User service is unavailable"
            });
        }
    });

    app.post("/users", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                status: "error",
                message: "User service is unavailable"
            });
        }
    });

    app.put("/users/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                status: "error",
                message: "User service is unavailable"
            });
        }
    });

    app.delete("/users/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                status: "error",
                message: "User service is unavailable"
            });
        }
    });
}
