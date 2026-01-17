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
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT || "3003";
const USER_SERVICE_URL = `${DOMAIN}:${USER_SERVICE_PORT}`;

// No auth middleware needed - token-based verification

export async function gdprRoutes(app: FastifyInstance) {
    app.delete("/gdpr/confirm-deletion", {
        schema: {
            tags: ["GDPR"],
            summary: "Confirm account deletion (Public)",
            description: "### Overview\nConfirms and executes the account deletion via a link sent by email.\n\n### Technical Details\n- Validates the deletion token sent in the request body.\n- Permanently deletes all user data across all services.\n- This action is IRREVERSIBLE.",
            body: {
                type: "object",
                required: ["token"],
                properties: {
                    token: { type: "string", description: "Deletion confirmation token received via email" }
                }
            },
            security: [{ apiKeyAuth: [] }],
            response: {
                200: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "success" },
                        message: { type: "string" },
                        data: {
                            type: "object",
                            properties: {
                                email: { type: "string" }
                            }
                        }
                    }
                },
                ...commonResponses
            }
        }
    }, async (request, reply) => {
        try {
            const { statusCode, body } = await proxyRequest(request, reply, `/api/v1/gdpr/confirm-deletion`, USER_SERVICE_URL);
            return reply.status(statusCode as any).send(body);
        } catch (error) {
            app.log.error(error);
            return sendError(reply, "User service is unavailable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    });
}

