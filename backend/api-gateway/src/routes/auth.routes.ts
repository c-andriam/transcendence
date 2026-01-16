import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";
import { strictRateLimiter, moderateRateLimiter } from "../middleware/rateLimiter.middleware";
import dotenv from "dotenv";
import path from "path";
import { bodyValidator, HttpStatus, sendError } from "@transcendence/common";
import { commonResponses, createResponseSchema } from "../utils/swagger.schemas";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});

const DOMAIN = process.env.DOMAIN;
const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT;

const AUTH_SERVICE_URL = `${DOMAIN}:${AUTH_SERVICE_PORT}`;

if (!AUTH_SERVICE_URL) {
    throw new Error("AUTH_SERVICE_URL is not defined");
}

export async function authRoutes(app: FastifyInstance) {
    app.post("/auth/register", {
        schema: {
            tags: ["Authentication"],
            summary: "Register a new user",
            description: "### Overview\nCreates a new user account in the Transcendence ecosystem.\n\n### Technical Details\n1. Validates input data against schema.\n2. Proxies request to `auth-service` for credential creation.\n3. `auth-service` internally calls `user-service` to create the user profile.\n4. Uses bcrypt for password hashing (rounds: 10).\n\n### Validation & Constraints\n- **Email**: Must be unique and valid format.\n- **Username**: Must be unique, 3-30 characters.\n- **Password**: Minimum 8 characters, should include mixed cases and symbols.\n\n### Side Effects\n- Creates records in `User` and `Auth` tables.\n- Sends a verification email to the user.\n\n### Security\n- Requires a valid Gateway API Key.",
            security: [{ apiKeyAuth: [] }],
            consumes: ["multipart/form-data"],
            body: {
                type: "object",
                required: ["email", "password", "username"],
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 8 },
                    username: { type: "string", minLength: 3 },
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    bio: { type: "string" },
                    avatar: { type: "string", format: "binary", description: "Optional profile picture" }
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
                        createdAt: { type: "string", format: "date-time" }
                    }
                }),
                ...commonResponses
            }
        },
        preHandler: [strictRateLimiter(15, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/register", AUTH_SERVICE_URL);
                return reply.status(statusCode as any).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/auth/login", {
        schema: {
            tags: ["Authentication"],
            summary: "Login user",
            description: "### Overview\nAuthenticates a user and establishes a secure session.\n\n### Technical Details\n1. Verifies credentials against the `auth-service`.\n2. Generates a short-lived JWT Access Token (15m).\n3. Generates a long-lived Refresh Token (7d).\n4. Sets the Refresh Token in a `HttpOnly`, `Secure`, `SameSite=Strict` cookie.\n\n### Validation & Constraints\n- **Identifier**: Can be either email or username.\n- **Rate Limiting**: Strict limit of 15 attempts per minute to prevent brute-force.\n\n### Side Effects\n- Updates `lastLogin` timestamp in the database.\n- Sets user status to `ONLINE` via `user-service`.\n\n### Security\n- Requires Gateway API Key.\n- Protected against CSRF via secure cookie flags.",
            security: [{ apiKeyAuth: [] }],
            body: {
                type: "object",
                required: ["identifier", "password"],
                properties: {
                    identifier: { type: "string", minLength: 3 },
                    password: { type: "string" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        accessToken: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        },
        preHandler: [strictRateLimiter(15, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/login", AUTH_SERVICE_URL);
                return reply.status(statusCode as any).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/auth/refresh", {
        schema: {
            tags: ["Authentication"],
            summary: "Refresh access token",
            description: "### Overview\nGenerates a new JWT Access Token using a valid Refresh Token.\n\n### Technical Details\n1. Extracts the Refresh Token from the secure `HttpOnly` cookie.\n2. Verifies the token's signature and expiration.\n3. Checks if the token exists and is active in the `auth-service` database.\n4. Issues a new short-lived Access Token (15m).\n\n### Side Effects\n- May rotate the Refresh Token (if configured) to prevent replay attacks.\n\n### Security\n- Requires a valid Refresh Token cookie.\n- Protected against CSRF and XSS via secure cookie flags.",
            security: [{ apiKeyAuth: [] }],
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        accessToken: { type: "string" }
                    }
                }),
                ...commonResponses
            }
        },
        preHandler: [moderateRateLimiter(10, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/refresh", AUTH_SERVICE_URL);
                return reply.status(statusCode as any).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/auth/logout", {
        schema: {
            tags: ["Authentication"],
            summary: "Logout user",
            description: "### Overview\nTerminates the current user session.\n\n### Technical Details\n1. Clears the Refresh Token cookie on the client side.\n2. Notifies `auth-service` to invalidate the Refresh Token in the database.\n\n### Side Effects\n- Sets user status to `OFFLINE` via `user-service`.\n\n### Security\n- Requires an active session (valid Refresh Token).",
            security: [{ apiKeyAuth: [] }],
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
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/logout", AUTH_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/auth/forgot-password", {
        schema: {
            tags: ["Authentication"],
            summary: "Request password reset email",
            description: "### Overview\nInitiates the password recovery process.\n\n### Technical Details\n1. Generates a unique, one-time-use reset token.\n2. Stores the hashed token in the database with a 1-hour expiration.\n3. Triggers the notification service to send the recovery email.\n\n### Side Effects\n- Sends an email containing a secure link with the reset token.\n\n### Security\n- Rate limited to prevent email spamming.",
            security: [{ apiKeyAuth: [] }],
            body: {
                type: "object",
                required: ["email"],
                properties: {
                    email: { type: "string", format: "email" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        },
        preHandler: [moderateRateLimiter(5, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/forgot-password", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/auth/reset-password", {
        schema: {
            tags: ["Authentication"],
            summary: "Reset password using token",
            description: "### Overview\nCompletes the password recovery process by setting a new password.\n\n### Technical Details\n1. Validates the reset token against the database.\n2. Checks if the token has expired.\n3. Hashes the new password and updates the user's credentials.\n4. Invalidates the used reset token.\n\n### Validation & Constraints\n- **Token**: Must be valid and not expired.\n- **New Password**: Must meet complexity requirements.\n\n### Side Effects\n- Updates the password in the `Auth` table.\n- Invalidate all active sessions for this user (optional/recommended).",
            security: [{ apiKeyAuth: [] }],
            body: {
                type: "object",
                required: ["token", "newPassword"],
                properties: {
                    token: { type: "string" },
                    newPassword: { type: "string", minLength: 8 }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        },
        preHandler: [moderateRateLimiter(5, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/reset-password", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/auth/verify-email", {
        schema: {
            tags: ["Authentication"],
            summary: "Verify email address",
            description: "### Overview\nConfirms the ownership of the email address provided during registration.\n\n### Technical Details\n1. Validates the verification token.\n2. Updates the `isEmailVerified` flag in the `User` profile.\n\n### Side Effects\n- Unlocks full account features (e.g., posting recipes, social interactions).",
            security: [{ apiKeyAuth: [] }],
            body: {
                type: "object",
                required: ["token"],
                properties: {
                    token: { type: "string" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        },
        preHandler: [moderateRateLimiter(5, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/verify-email", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/auth/resend-verification", {
        schema: {
            tags: ["Authentication"],
            summary: "Resend verification email",
            description: "### Overview\nRequests a new verification email if the previous one was lost or expired.\n\n### Technical Details\n1. Checks if the user is already verified.\n2. Generates a new verification token.\n3. Triggers the notification service.\n\n### Side Effects\n- Sends a new verification email.",
            security: [{ apiKeyAuth: [] }],
            body: {
                type: "object",
                required: ["email"],
                properties: {
                    email: { type: "string", format: "email" }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {}
                }),
                ...commonResponses
            }
        },
        preHandler: [moderateRateLimiter(5, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/resend-verification", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });
}