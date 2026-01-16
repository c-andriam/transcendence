import db from "../utils/dbPlugin";
import { notifyUser } from "../utils/websocket.util";
import { NotFoundError, ForbiddenError } from "@transcendence/common";

export async function createMessage(senderId: string, receiverId: string, content: string) {
    let conversation = await db.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { userId: senderId } } },
                { participants: { some: { userId: receiverId } } }
            ]
        }
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
            }
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
        senderId: message.senderId,
        content: message.content,
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
