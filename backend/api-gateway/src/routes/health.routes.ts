import { FastifyInstance } from "fastify";
import { validateEnv, HttpStatus, sendSuccess, sendError } from "@transcendence/common";
import { commonResponses, createResponseSchema } from "../utils/swagger.schemas";
import fetch from "node-fetch";

const env = validateEnv();

const SERVICES = [
    { name: "auth-service", port: env.AUTH_SERVICE_PORT },
    { name: "recipe-service", port: env.RECIPE_SERVICE_PORT },
    { name: "user-service", port: env.USER_SERVICE_PORT },
    { name: "chat-service", port: env.CHAT_SERVICE_PORT },
    { name: "notification-service", port: env.NOTIFICATION_SERVICE_PORT },
    { name: "websocket-service", port: env.WEBSOCKET_SERVICE_PORT },
];

export async function healthRoutes(app: FastifyInstance) {
    app.get("/health/all", {
        schema: {
            tags: ["System"],
            summary: "Get health status of all microservices",
            description: "### Overview\nProvides a centralized diagnostic dashboard by aggregating real-time health metrics from all distributed microservices.\n\n### Technical Details\n- Executes parallel asynchronous health probes via the internal networking layer.\n- Implements a strict 2000ms timeout per service using `AbortController` to prevent gateway hanging.\n- Normalizes heterogeneous response formats into a unified system report.\n\n### Side Effects\n- Overall system status transitions to `DEGRADED` if any mission-critical service is unreachable.\n\n### Security\n- Accessible via Gateway API Key. Intended for internal monitoring and dashboard integration.",
            response: {
                200: createResponseSchema({
                    type: "object",
                    properties: {
                        status: { type: "string" },
                        services: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    status: { type: "string" },
                                    url: { type: "string" },
                                    responseTime: { type: "number" },
                                    details: { type: "object", additionalProperties: true }
                                }
                            }
                        }
                    }
                }),
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        const healthChecks = SERVICES.map(async (service) => {
            const url = `${env.DOMAIN}:${service.port}/health`;
            const start = Date.now();
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);

            try {
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeout);
                const details = await response.json().catch(() => ({}));
                return {
                    name: service.name,
                    status: response.ok ? "UP" : "DEGRADED",
                    url,
                    responseTime: Date.now() - start,
                    details
                };
            } catch (error) {
                return {
                    name: service.name,
                    status: "DOWN",
                    url,
                    responseTime: Date.now() - start,
                    details: { error: (error as Error).message }
                };
            }
        });

        const results = await Promise.all(healthChecks);
        const overallStatus = results.every(s => s.status === "UP") ? "HEALTHY" : "DEGRADED";

        return sendSuccess(reply, {
            status: overallStatus,
            services: results
        }, "System health retrieved successfully");
    });
}
