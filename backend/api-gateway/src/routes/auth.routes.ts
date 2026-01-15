import { FastifyInstance } from "fastify";
import { proxyRequest } from "../utils/proxy";
import { strictRateLimiter, moderateRateLimiter } from "../middleware/rateLimiter.middleware";
import dotenv from "dotenv";
import path from "path";
import { bodyValidator, HttpStatus, sendError } from "@transcendence/common";

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
        preHandler: [strictRateLimiter(15, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/register", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/auth/login", {
        preHandler: [strictRateLimiter(15, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/login", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/auth/refresh", {
        preHandler: [moderateRateLimiter(10, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/refresh", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/auth/logout", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/api/v1/auth/logout", AUTH_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/auth/forgot-password", {
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