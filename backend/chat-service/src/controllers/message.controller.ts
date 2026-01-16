import { FastifyRequest, FastifyReply } from "fastify";
import { createMessage, getMessages } from "../services/message.service";
import { sendSuccess, sendCreated, BadRequestError } from "@transcendence/common";
import { z } from "zod";

const createMessageSchema = z.object({
    receiverId: z.string().min(1),
    content: z.string().min(1)
});

export async function sendMessageController(request: FastifyRequest, reply: FastifyReply) {
    const senderId = request.user.id;
    const body = createMessageSchema.parse(request.body);

    if (senderId === body.receiverId) {
        throw new BadRequestError("Cannot send message to self");
    }

    const message = await createMessage(senderId, body.receiverId, body.content);
    sendCreated(reply, message, "Message sent successfully");
}

export async function getMessagesController(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const { otherUserId } = request.params as { otherUserId: string };

    const messages = await getMessages(userId, otherUserId);
    sendSuccess(reply, messages, "Messages retrieved successfully");
}
