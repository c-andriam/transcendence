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
            description: "### Overview\nRetrieves the private profile information of the currently logged-in user.\n\n### Technical Details\n1. Extracts user ID from the JWT payload.\n2. Proxies request to `user-service`.\n3. Aggregates data from `User` and `Profile` tables.\n\n### Security\n- Requires a valid JWT Bearer Token.\n- Only returns data for the authenticated user.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        email: { type: "string" },
                        username: { type: "string" },
                        firstName: { type: "string", nullable: true },
                        lastName: { type: "string", nullable: true },
                        avatarUrl: { type: "string", nullable: true },
                        bio: { type: "string", nullable: true },
                        role: { type: "string" },
                        isOnline: { type: "boolean" },
                        isEmailVerified: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nLists all registered users in the system.\n\n### Technical Details\n- Fetches basic profile data (username, avatar, role).\n- Supports pagination (default: page 1, limit 10).\n\n### Security\n- Publicly accessible, but sensitive fields (email, password) are excluded.",
            security: [{ apiKeyAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            username: { type: "string" },
                            email: { type: "string" },
                            firstName: { type: "string", nullable: true },
                            lastName: { type: "string", nullable: true },
                            avatarUrl: { type: "string", nullable: true },
                            role: { type: "string" },
                            bio: { type: "string", nullable: true },
                            isOnline: { type: "boolean" },
                            isEmailVerified: { type: "boolean" },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nFinds users based on a search query.\n\n### Technical Details\n- Performs a case-insensitive partial match on `username` and `email`.\n- Uses full-text search indexing in the `user-service` database.\n\n### Validation & Constraints\n- **q**: Minimum 1 character required.",
            security: [{ apiKeyAuth: [] }],
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
                            avatarUrl: { type: "string" },
                            email: { type: "string" },
                            firstName: { type: "string", nullable: true },
                            lastName: { type: "string", nullable: true }
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
            description: "### Overview\nRetrieves the public profile of any user.\n\n### Technical Details\n- Fetches data based on the provided UUID.\n- Includes social stats (follower/following counts) and online status.",
            security: [{ apiKeyAuth: [] }],
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
                        email: { type: "string" },
                        firstName: { type: "string", nullable: true },
                        lastName: { type: "string", nullable: true },
                        avatarUrl: { type: "string", nullable: true },
                        bio: { type: "string", nullable: true },
                        role: { type: "string" },
                        isOnline: { type: "boolean" },
                        isEmailVerified: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nAllows an authenticated user to update their password.\n\n### Technical Details\n1. Verifies the `currentPassword` against the `auth-service`.\n2. If correct, hashes and updates the `newPassword`.\n\n### Validation & Constraints\n- **newPassword**: Must be different from the current password and meet complexity rules.",
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
            description: "### Overview\nUpdates the profile details for a specific user.\n\n### Technical Details\n- Allows partial updates (PATCH-like behavior).\n- Validates that the requester has permission (Owner or Admin).\n\n### Side Effects\n- Updates the `updatedAt` timestamp.\n- May trigger a cache invalidation for the user profile.",
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
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    username: { type: "string" },
                    avatarUrl: { type: "string" },
                    bio: { type: "string" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        email: { type: "string" },
                        username: { type: "string" },
                        firstName: { type: "string", nullable: true },
                        lastName: { type: "string", nullable: true },
                        avatarUrl: { type: "string", nullable: true },
                        bio: { type: "string", nullable: true },
                        role: { type: "string" },
                        isOnline: { type: "boolean" },
                        isEmailVerified: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nDeletes a user account and all associated data.\n\n### Technical Details\n- Performs a permanent delete across multiple services (Auth, User, Recipe, etc.).\n- This is a destructive operation and cannot be undone.\n\n### Security\n- Requires Owner or Admin privileges.",
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
                        id: { type: "string", format: "uuid" },
                        email: { type: "string" },
                        username: { type: "string" },
                        firstName: { type: "string", nullable: true },
                        lastName: { type: "string", nullable: true },
                        avatarUrl: { type: "string", nullable: true },
                        bio: { type: "string", nullable: true },
                        role: { type: "string" },
                        isOnline: { type: "boolean" },
                        isEmailVerified: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nEstablishes a follow relationship between two users.\n\n### Technical Details\n- Creates a record in the `Follows` table.\n- Prevents users from following themselves.\n\n### Side Effects\n- Sends a real-time notification to the followed user.",
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
                        id: { type: "string", format: "uuid" },
                        followerId: { type: "string", format: "uuid" },
                        followingId: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nTerminates a follow relationship.\n\n### Technical Details\n- Removes the specific record from the `Follows` table.\n\n### Side Effects\n- The unfollowed user will no longer see your updates in their feed (if applicable).",
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
                        id: { type: "string", format: "uuid" },
                        followerId: { type: "string", format: "uuid" },
                        followingId: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nRetrieves a list of users who are following the authenticated user.\n\n### Technical Details\n- Queries the `Follows` table where `followingId` is the current user.\n- Returns basic profile data for each follower.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            username: { type: "string" },
                            avatarUrl: { type: "string", nullable: true },
                            isOnline: { type: "boolean" }
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
            description: "### Overview\nRetrieves a list of users that the authenticated user is currently following.\n\n### Technical Details\n- Queries the `Follows` table where `followerId` is the current user.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            username: { type: "string" },
                            avatarUrl: { type: "string", nullable: true },
                            isOnline: { type: "boolean" }
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
            description: "### Overview\nLists all users following a specific user profile.\n\n### Technical Details\n- Publicly accessible endpoint.\n- Returns basic profile summaries.",
            security: [{ apiKeyAuth: [] }],
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
                            username: { type: "string" },
                            avatarUrl: { type: "string", nullable: true },
                            isOnline: { type: "boolean" }
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
            description: "### Overview\nLists all users that a specific user is currently following.",
            security: [{ apiKeyAuth: [] }],
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
                            username: { type: "string" },
                            avatarUrl: { type: "string", nullable: true },
                            isOnline: { type: "boolean" }
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
            description: "### Overview\nVerifies if a follow relationship exists between the current user and another user.\n\n### Technical Details\n- Returns a boolean `isFollowing`.",
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
            description: "### Overview\nSends a request to another user to become friends.\n\n### Technical Details\n- Creates a pending friend request record.\n- Checks for existing requests or friendships to prevent duplicates.\n\n### Side Effects\n- Sends a real-time notification to the receiver.",
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
                        senderId: { type: "string", format: "uuid" },
                        receiverId: { type: "string", format: "uuid" },
                        status: { type: "string" },
                        createdAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nApproves a pending friend request, establishing a mutual friendship.\n\n### Technical Details\n- Updates the request status to `ACCEPTED`.\n- Creates a bidirectional friendship link in the `Friends` table.\n\n### Side Effects\n- Notifies the sender that their request was accepted.",
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
                        id: { type: "string", format: "uuid" },
                        status: { type: "string" },
                        senderId: { type: "string", format: "uuid" },
                        receiverId: { type: "string", format: "uuid" }
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
            description: "### Overview\nDeclines a pending friend request.\n\n### Technical Details\n- Updates the request status to `REJECTED` or deletes the record (depending on policy).\n\n### Side Effects\n- The sender is NOT notified of the rejection (standard privacy practice).",
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
                        id: { type: "string", format: "uuid" },
                        status: { type: "string" },
                        senderId: { type: "string", format: "uuid" },
                        receiverId: { type: "string", format: "uuid" }
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
            description: "### Overview\nEnds a mutual friendship between two users.\n\n### Technical Details\n- Removes the records from the `Friends` table.\n\n### Side Effects\n- Both users are removed from each other's friends lists.",
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
            description: "### Overview\nRetrieves a list of all users who are currently friends with the authenticated user.\n\n### Technical Details\n- Returns basic profile data and online status for each friend.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", format: "uuid" },
                            username: { type: "string" },
                            avatarUrl: { type: "string", nullable: true },
                            isOnline: { type: "boolean" }
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
            description: "### Overview\nLists all incoming friend requests that are currently in a `PENDING` state.",
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
            description: "### Overview\nPrevents another user from interacting with you.\n\n### Technical Details\n- Creates a record in the `Blocks` table.\n- Automatically unfollows and removes as friend (if applicable).\n\n### Side Effects\n- The blocked user can no longer send messages or see your private profile.",
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
                        id: { type: "string", format: "uuid" },
                        blockerId: { type: "string", format: "uuid" },
                        blockedId: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nRemoves a block restriction, allowing the user to interact with you again.\n\n### Technical Details\n- Deletes the record from the `Blocks` table.",
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
                        id: { type: "string", format: "uuid" },
                        blockerId: { type: "string", format: "uuid" },
                        blockedId: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" }
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
            description: "### Overview\nRetrieves a list of all users you have currently blocked.",
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
            description: "### Overview\nGenerates a unique API key for the user to access the platform programmatically.\n\n### Technical Details\n- Generates a secure random string.\n- Stores the hashed version in the database.\n- Returns the plain key ONLY ONCE upon generation.\n\n### Security\n- Requires active session. Treat the API key as a password.",
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
        validatorCompiler: () => () => true,
        schema: {
            tags: ["Users"],
            summary: "Upload avatar",
            description: "### Overview\nUploads and sets a new profile picture for the user.\n\n### Technical Details\n- Processes `multipart/form-data`.\n- Uploads the image to Cloudinary.\n- Updates the `avatarUrl` in the `User` profile.\n\n### Validation & Constraints\n- **file**: Must be a valid image (JPEG, PNG, WebP).",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
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

    app.get("/users/:id/export-data", {
        schema: {
            tags: ["GDPR"],
            summary: "Export user data",
            description: "### Overview\nExports all user data in JSON format for GDPR compliance.\n\n### Technical Details\n- Collects data from all services (profile, recipes, messages, notifications).\n- Returns a downloadable JSON file.\n\n### Security\n- Users can only export their own data.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "User ID" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        exportDate: { type: "string" },
                        profile: { type: "object" },
                        social: { type: "object" },
                        content: { type: "object" }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/export-data`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/users/:id/request-deletion", {
        schema: {
            tags: ["GDPR"],
            summary: "Request account deletion",
            description: "### Overview\nInitiates the account deletion process.\n\n### Technical Details\n- Creates a secure deletion token.\n- Sends a confirmation email to the user.\n- Token expires after 24 hours.\n\n### Security\n- Users can only request deletion of their own account.\n- Deletion requires email confirmation.",
            security: [{ apiKeyAuth: [], bearerAuth: [] }],
            params: {
                type: "object",
                required: ["id"],
                properties: {
                    id: { type: "string", format: "uuid", description: "User ID" }
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
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/users/${id}/request-deletion`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });
}
