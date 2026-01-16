import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";
import { validateEnv, HttpStatus, sendError } from "@transcendence/common";
import { commonResponses, createResponseSchema } from "../utils/swagger.schemas";

const env = validateEnv();

const SERVICE_URL = `http://localhost:${env.CHAT_SERVICE_PORT}/api/v1`;

export async function chatRoutes(app: FastifyInstance) {
    app.post("/messages", {
        schema: {
            tags: ["Chat"],
            summary: "Send a message",
            description: "### Overview\nSends a real-time message to another user.\n\n### Technical Details\n- Saves the message to the database via `chat-service`.\n- Triggers a real-time websocket event `new_message` to the recipient.\n\n### Security\n- Requires a valid JWT Bearer Token.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            body: {
                type: "object",
                required: ["receiverId", "content"],
                properties: {
                    receiverId: { type: "string", format: "uuid" },
                    content: { type: "string", minLength: 1 }
                }
            },
            response: {
                201: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        conversationId: { type: "string", format: "uuid" },
                        senderId: { type: "string", format: "uuid" },
                        content: { type: "string" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/messages", SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Chat service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/messages/:otherUserId", {
        schema: {
            tags: ["Chat"],
            summary: "Get conversation history",
            description: "### Overview\nRetrieves the message history with a specific user.\n\n### Technical Details\n- Fetches messages from the `chat-service` database.\n- Returns an empty array if no conversation exists.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    otherUserId: { type: "string", format: "uuid" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            senderId: { type: "string", format: "uuid" },
                            content: { type: "string" },
                            createdAt: { type: "string", format: "date-time" },
                            isRead: { type: "boolean" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { otherUserId } = request.params as { otherUserId: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/messages/${otherUserId}`, SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Chat service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });
}