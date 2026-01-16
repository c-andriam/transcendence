import { FastifyInstance } from "fastify";
import { sendMessageController, getMessagesController } from "../controllers/message.controller";
import { authMiddleware } from "@transcendence/common";

export async function chatRoutes(app: FastifyInstance) {
    app.post("/messages", { preHandler: [authMiddleware] }, sendMessageController);
    app.get("/messages/:otherUserId", { preHandler: [authMiddleware] }, getMessagesController);
}
