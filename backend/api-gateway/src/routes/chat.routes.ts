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
            description: "### Overview\nDispatches a secure, real-time message between users.\n\n### Technical Details\n- Persists the message payload in the `chat-service` encrypted message store.\n- Analyzes receiver presence and status via the `user-service`.\n\n### Side Effects\n- Emits a `new_message` event via Socket.IO to the recipient's active sessions.\n- Triggers a system-level notification if the recipient is offline.\n\n### Security\n- Requires synchronous Gateway API Key and JWT Bearer authentication.\n- Implements content sanitization to prevent injection attacks.",
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
            description: "### Overview\nRetrieves the historical chronological exchange between the authenticated user and a specific peer.\n\n### Technical Details\n- Performs a high-performance query on the `Messages` table with optimized indexing on `senderId` and `receiverId`.\n- Automatically marks unread incoming messages in this conversation as 'read' upon retrieval.\n\n### Side Effects\n- Updates the unread message counter globally for the authenticated user.\n\n### Security\n- Enforces strict isolation: users can only access conversations where they are a primary participant.",
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