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
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;

const USER_SERVICE_URL = `${DOMAIN}:${USER_SERVICE_PORT}`;

if (!USER_SERVICE_URL) {
    throw new Error("USER_SERVICE_URL is not defined");
}

export async function usersRoutes(app: FastifyInstance) {

    app.get("/users/me", {
        schema: {
            tags: ["Users"],
            summary: "Get current user profile",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        email: { type: "string" },
                        username: { type: "string" },
                        fullName: { type: "string" },
                        avatarUrl: { type: "string" },
                        createdAt: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users", {
        schema: {
            tags: ["Users"],
            summary: "Get all users",
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            username: { type: "string" },
                            avatarUrl: { type: "string" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/search", {
        schema: {
            tags: ["Users"],
            summary: "Search users",
            querystring: {
                type: "object",
                properties: {
                    q: { type: "string" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            username: { type: "string" },
                            avatarUrl: { type: "string" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/search", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/:id", {
        schema: {
            tags: ["Users"],
            summary: "Get specific user profile",
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        username: { type: "string" },
                        fullName: { type: "string" },
                        avatarUrl: { type: "string" },
                        createdAt: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users", {
        schema: {
            hide: true
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/change-password", {
        schema: {
            tags: ["Users"],
            summary: "Change password",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            body: {
                type: "object",
                required: ["currentPassword", "newPassword"],
                properties: {
                    currentPassword: { type: "string" },
                    newPassword: { type: "string", minLength: 8 }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/change-password", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/users/:id", {
        schema: {
            tags: ["Users"],
            summary: "Update user profile",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                }
            },
            body: {
                type: "object",
                properties: {
                    fullName: { type: "string" },
                    username: { type: "string" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        username: { type: "string" },
                        fullName: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/users/:id", {
        schema: {
            tags: ["Users"],
            summary: "Delete user",
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
                    properties: {
                        message: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/:id/follow", {
        schema: {
            tags: ["Social"],
            summary: "Follow a user",
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
                    properties: {
                        message: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/follow`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/users/:id/follow", {
        schema: {
            tags: ["Social"],
            summary: "Unfollow a user",
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
                    properties: {
                        message: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/follow`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/followers", {
        schema: {
            tags: ["Social"],
            summary: "Get my followers",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            followerId: { type: "string" },
                            followingId: { type: "string" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/followers", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/following", {
        schema: {
            tags: ["Social"],
            summary: "Get people I follow",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            followerId: { type: "string" },
                            followingId: { type: "string" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/following", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/:id/followers", {
        schema: {
            tags: ["Social"],
            summary: "Get user's followers",
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            followerId: { type: "string" },
                            followingId: { type: "string" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/followers`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/:id/following", {
        schema: {
            tags: ["Social"],
            summary: "Get users followed by user",
            params: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            followerId: { type: "string" },
                            followingId: { type: "string" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/following`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/:id/is-following", {
        schema: {
            tags: ["Social"],
            summary: "Check if following",
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
                    properties: {
                        isFollowing: { type: "boolean" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/is-following`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/friend-requests", {
        schema: {
            tags: ["Social"],
            summary: "Send friend request",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            body: {
                type: "object",
                required: ["receiverId"],
                properties: {
                    receiverId: { type: "string" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        status: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/friend-requests", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/users/friend-requests/:id/accept", {
        schema: {
            tags: ["Social"],
            summary: "Accept friend request",
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
                    properties: {
                        message: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/friend-requests/${id}/accept`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.put("/users/friend-requests/:id/reject", {
        schema: {
            tags: ["Social"],
            summary: "Reject friend request",
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
                    properties: {
                        message: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/friend-requests/${id}/reject`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/users/friends/:friendId", {
        schema: {
            tags: ["Social"],
            summary: "Remove a friend",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    friendId: { type: "string" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { friendId } = request.params as { friendId: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/friends/${friendId}`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/friends", {
        schema: {
            tags: ["Social"],
            summary: "Get my friends list",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            username: { type: "string" },
                            avatarUrl: { type: "string" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/friends", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/friend-requests", {
        schema: {
            tags: ["Social"],
            summary: "Get pending friend requests",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            sender: {
                                type: "object",
                                properties: {
                                    id: { type: "string", format: "uuid" },
                                    username: { type: "string" },
                                    avatarUrl: { type: "string" }
                                }
                            }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/friend-requests", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/:id/block", {
        schema: {
            tags: ["Social"],
            summary: "Block a user",
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
                    properties: {
                        message: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/block`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.delete("/users/:id/block", {
        schema: {
            tags: ["Social"],
            summary: "Unblock a user",
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
                    properties: {
                        message: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/block`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.get("/users/me/blocked", {
        schema: {
            tags: ["Social"],
            summary: "Get blocked users",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            username: { type: "string" },
                            avatarUrl: { type: "string" }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/me/blocked", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/api-key/generate", {
        schema: {
            tags: ["Users"],
            summary: "Generate API Key",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        apiKey: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/users/api-key/generate", USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/me/avatar", {
        schema: {
            tags: ["Users"],
            summary: "Upload avatar",
            security: [{ bearerAuth: [] }],
            consumes: ['multipart/form-data'],
            body: {
                type: 'object',
                properties: {
                    file: { type: 'string', format: 'binary' }
                }
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        avatarUrl: { type: "string" }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const { proxyMultipart } = await import("../utils/proxy");
        return proxyMultipart(request, reply, "/api/v1/users/me/avatar", USER_SERVICE_URL);
    });
}
