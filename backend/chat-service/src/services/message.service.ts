import db from "../utils/dbPlugin";
import { notifyUser } from "../utils/websocket.util";
import { NotFoundError, ForbiddenError, validateEnv } from "@transcendence/common";

const env = validateEnv();

export async function createMessage(senderId: string, receiverId: string, content: string) {
    try {
        const userServiceUrl = `http://localhost:${env.USER_SERVICE_PORT}/api/v1/internal/users/${senderId}/block-status/${receiverId}`;
        const response = await fetch(userServiceUrl, {
            headers: { 'x-internal-api-key': env.INTERNAL_API_KEY }
        });
        const result = await response.json();

        if (result.status === 'success') {
            if (result.data.isBlockedBy) {
                throw new ForbiddenError("You cannot send messages to this user (Blocked)");
            }
            if (result.data.hasBlocked) {
                throw new ForbiddenError("You strictly blocked this user. Unblock to send message.");
            }
        }
    } catch (error) {
        if (error instanceof ForbiddenError) throw error;
        console.error("Failed to check block status:", error);
    }

    let conversation = await db.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { userId: senderId } } },
                { participants: { some: { userId: receiverId } } }
            ]
        },
        include: { participants: true }
    });

    if (!conversation) {
        conversation = await db.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: senderId },
                        { userId: receiverId }
                    ]
                }
            },
            include: { participants: true }
        });
    }

    const message = await db.message.create({
        data: {
            senderId,
            conversationId: conversation.id,
            content
        }
    });

    await notifyUser(receiverId, 'new_message', {
        id: message.id,
        conversationId: conversation.id,
        senderId,
        content,
        createdAt: message.createdAt
    });

    return message;
}

export async function getMessages(userId: string, otherUserId: string) {
    const conversation = await db.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { userId: userId } } },
                { participants: { some: { userId: otherUserId } } }
            ]
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    return conversation?.messages || [];
}
