import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";
import { HttpStatus, sendError } from "@transcendence/common";
import { commonResponses, createResponseSchema } from "../utils/swagger.schemas";
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
            description: "### Overview\nRetrieves a list of notifications for the authenticated user.\n\n### Technical Details\n- Fetches data from the `notification-service`.\n- Supports pagination (default: page 1, limit 20).\n- Includes metadata (data field) for deep-linking in the frontend.\n\n### Security\n- Requires a valid JWT Bearer Token.\n- Only returns notifications belonging to the authenticated user.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            querystring: {
                type: "object",
                properties: {
                    page: { type: "integer", default: 1 },
                    limit: { type: "integer", default: 20 }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        notifications: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string", format: "uuid" },
                                    type: { type: "string" },
                                    title: { type: "string" },
                                    message: { type: "string" },
                                    isRead: { type: "boolean" },
                                    data: { type: "object", additionalProperties: true, nullable: true },
                                    createdAt: { type: "string" }
                                }
                            }
                        },
                        pagination: {
                            type: "object",
                            properties: {
                                page: { type: "integer" },
                                limit: { type: "integer" },
                                total: { type: "integer" },
                                totalPages: { type: "integer" }
                            }
                        }
                    }
                }),
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



    app.put("/notifications/:id/read", {
        schema: {
            tags: ["Notifications"],
            summary: "Mark notification as read",
            description: "### Overview\nUpdates the status of a specific notification to 'read'.\n\n### Technical Details\n- Updates the `isRead` flag in the `notification-service` database.\n- Validates that the notification belongs to the requester.\n\n### Side Effects\n- Decrements the unread notification count in the frontend (via WebSocket or polling).",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
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
            description: "### Overview\nBulk updates all unread notifications for the user to 'read'.\n\n### Technical Details\n- Performs a batch update in the `notification-service`.\n\n### Side Effects\n- Resets the unread notification count to zero.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
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
            description: "### Overview\nPermanently removes a notification.\n\n### Technical Details\n- Deletes the record from the `notification-service` database.\n\n### Security\n- Requires ownership of the notification.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
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
