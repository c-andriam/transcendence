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
            security: [{ apiKeyAuth: [] }],
            body: {
                type: "object",
                required: ["email", "password", "username", "fullName"],
                properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 8 },
                    username: { type: "string", minLength: 3 },
                    fullName: { type: "string", minLength: 1 }
                }
            },
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        user: {
                            type: "object",
                            properties: {
                                id: { type: "string", format: "uuid" },
                                email: { type: "string" },
                                username: { type: "string" }
                            }
                        }
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
                        message: { type: "string" },
                        accessToken: { type: "string" },
                        user: {
                            type: "object",
                            properties: {
                                id: { type: "string", format: "uuid" },
                                email: { type: "string" },
                                username: { type: "string" },
                                role: { type: "string" }
                            }
                        }
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
            security: [{ apiKeyAuth: [] }],
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
                    properties: {
                        message: { type: "string" }
                    }
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
                    properties: {
                        message: { type: "string" }
                    }
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
                    properties: {
                        message: { type: "string" }
                    }
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
                    properties: {
                        message: { type: "string" }
                    }
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