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

    app.get("/users", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/search", async (request, reply) => {
        try {
            // q is automatically forwarded by proxyRequest from request.query
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/search", USER_SERVICE_URL);
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

    app.post("/users/change-password", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/change-password", USER_SERVICE_URL);
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

    app.post("/users/:id/follow", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/follow`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/users/:id/follow", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/follow`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/followers", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/followers", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/following", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/following", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/:id/followers", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/followers`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/:id/following", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/following`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/:id/is-following", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/is-following`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/friend-requests", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/friend-requests", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/users/friend-requests/:id/accept", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/friend-requests/${id}/accept`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/users/friend-requests/:id/reject", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/friend-requests/${id}/reject`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/users/friends/:friendId", async (request, reply) => {
        try {
            const { friendId } = request.params as { friendId: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/friends/${friendId}`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/friends", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/friends", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/friend-requests", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/friend-requests", USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/:id/block", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/block`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/users/:id/block", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/block`, USER_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/blocked", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/blocked", USER_SERVICE_URL);
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

    app.post("/users/me/avatar", async (request, reply) => {
        const { proxyMultipart } = await import("../utils/proxy");
        return proxyMultipart(request, reply, "/api/v1/users/me/avatar", USER_SERVICE_URL);
    });
}
