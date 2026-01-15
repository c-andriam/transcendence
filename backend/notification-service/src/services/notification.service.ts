import db from "../utils/db";
import { NotificationType } from "@transcendence/common";

export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
) {
    return await db.notification.create({
        data: {
            userId,
            type,
            title,
            message,
            data
        }
    });
}

export async function getNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
        db.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        db.notification.count({ where: { userId } })
    ]);

    return {
        notifications,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function markAsRead(notificationId: string, userId: string) {
    const notification = await db.notification.findFirst({
        where: { id: notificationId, userId }
    });

    if (!notification) {
        throw new Error("Notification not found");
    }

    return await db.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });
}

export async function markAllAsRead(userId: string) {
    return await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
}

export async function deleteNotification(notificationId: string, userId: string) {
    const notification = await db.notification.findFirst({
        where: { id: notificationId, userId }
    });

    if (!notification) {
        throw new Error("Notification not found");
    }

    return await db.notification.delete({
        where: { id: notificationId }
    });
}
