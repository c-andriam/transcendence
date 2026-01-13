import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";
import { HttpStatus, sendError } from "@transcendence/common";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});

const DOMAIN = process.env.DOMAIN;
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;

const USER_SERVICE_URL = `${DOMAIN}:${USER_SERVICE_PORT}`;

if (!USER_SERVICE_URL) {
    throw new Error("USER_SERVICE_URL is not defined");
}

export async function usersRoutes(app: FastifyInstance) {

    app.get("/users/me", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/users", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/users", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/users/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/users/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/api-key/generate", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/api-key/generate", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });
}
