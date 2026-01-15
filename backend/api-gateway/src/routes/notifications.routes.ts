import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";
import { HttpStatus, sendError } from "@transcendence/common";
import { commonResponses } from "../utils/swagger.schemas";
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

    app.get("/notifications", {
        schema: {
            tags: ["Notifications"],
            summary: "Get all notifications",
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            type: { type: "string" },
                            message: { type: "string" },
                            read: { type: "boolean" },
                            createdAt: { type: "string" }
                        }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/notifications", NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/notifications/:id", {
        schema: {
            tags: ["Notifications"],
            summary: "Get notification by ID",
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                }
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        type: { type: "string" },
                        message: { type: "string" },
                        read: { type: "boolean" },
                        createdAt: { type: "string" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/notifications/${id}`, NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/notifications/:id/read", {
        schema: {
            tags: ["Notifications"],
            summary: "Mark notification as read",
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                }
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        read: { type: "boolean" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/notifications/${id}/read`, NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/notifications/read-all", {
        schema: {
            tags: ["Notifications"],
            summary: "Mark all notifications as read",
            response: {
                200: {
                    type: "object",
                    properties: {
                        count: { type: "integer" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/notifications/read-all", NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/notifications/:id", {
        schema: {
            tags: ["Notifications"],
            summary: "Delete notification",
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                }
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/notifications/${id}`, NOTIFICATION_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Notification service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });
}
