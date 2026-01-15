import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";
import { HttpStatus, sendError } from "@transcendence/common";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});

const DOMAIN = process.env.DOMAIN;
const NOTIFICATION_SERVICE_PORT = process.env.NOTIFICATION_SERVICE_PORT;

const NOTIFICATION_SERVICE_URL = `${DOMAIN}:${NOTIFICATION_SERVICE_PORT}`;

if (!NOTIFICATION_SERVICE_URL) {
    throw new Error("NOTIFICATION_SERVICE_URL is not defined");
}

export async function notificationsRoutes(app: FastifyInstance) {

    app.get("/notifications", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/notifications", NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/notifications/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/notifications/${id}`, NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/notifications/:id/read", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/notifications/${id}/read`, NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/notifications/read-all", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/notifications/read-all", NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/notifications/:id", async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/notifications/${id}`, NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });
}
