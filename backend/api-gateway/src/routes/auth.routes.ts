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
    app.post("/register", {
        preHandler: [strictRateLimiter(15, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/register", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/login", {
        preHandler: [strictRateLimiter(15, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/login", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/refresh", {
        preHandler: [moderateRateLimiter(20, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/refresh", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/logout", async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, "/logout", AUTH_SERVICE_URL);
            return reply.status(statusCode).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });

    app.post("/forgot-password", {
        preHandler: [moderateRateLimiter(5, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/forgot-password", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/reset-password", {
        preHandler: [moderateRateLimiter(5, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/reset-password", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/verify-email", {
        preHandler: [moderateRateLimiter(10, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/verify-email", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });

    app.post("/resend-verification", {
        preHandler: [moderateRateLimiter(5, 60000)],
        handler: async (request, reply) => {
            try {
                const { statusCode, body } = await proxyRequest(request, reply, "/resend-verification", AUTH_SERVICE_URL);
                return reply.status(statusCode).send(body);
            } catch (error) {
                app.log.error(error);
                return sendError(reply, "Authentication service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
            }
        }
    });
}