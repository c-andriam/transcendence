import { FastifyInstance } from "fastify";
import { sendResetPasswordEmail, sendVerificationEmail } from "../services/email.service";
import {
    createNotification,
    deleteNotification,
    getNotifications,
    markAllAsRead,
    markAsRead
} from "../services/notification.service";
import { sendSuccess, authMiddleware, bodyValidator, ForbiddenError, NotificationType } from "@transcendence/common";
import { z } from "zod";

const resetEmailSchema = z.object({
    email: z.string().email(),
    resetToken: z.string().min(1)
});

const verifyEmailSchema = z.object({
    email: z.string().email(),
    verificationToken: z.string().min(1)
});

const createNotificationSchema = z.object({
    userId: z.string().min(1),
    type: z.nativeEnum(NotificationType),
    title: z.string().min(1),
    message: z.string().min(1),
    data: z.record(z.string(), z.any()).optional()
});

export async function notificationRoutes(app: FastifyInstance) {
    app.post("/internal/send-reset-email", {
        preHandler: bodyValidator(resetEmailSchema)
    }, async (request, reply) => {
        const { email, resetToken } = request.body as z.infer<typeof resetEmailSchema>;
        await sendResetPasswordEmail(email, resetToken);
        sendSuccess(reply, {}, 'Email sent');
    });

    app.post("/internal/send-verification-email", {
        preHandler: bodyValidator(verifyEmailSchema)
    }, async (request, reply) => {
        const { email, verificationToken } = request.body as z.infer<typeof verifyEmailSchema>;
        await sendVerificationEmail(email, verificationToken);
        sendSuccess(reply, {}, 'Verification email sent');
    });

    app.get("/notifications", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user?.id;
        if (!userId) throw new ForbiddenError("Unauthorized");

        const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number };
        const result = await getNotifications(userId, Number(page), Number(limit));
        sendSuccess(reply, result);
    });

    app.put("/notifications/:id/read", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user?.id;
        if (!userId) throw new ForbiddenError("Unauthorized");

        const { id } = request.params as { id: string };
        await markAsRead(id, userId);
        sendSuccess(reply, {}, 'Notification marked as read');
    });

    app.put("/notifications/read-all", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user?.id;
        if (!userId) throw new ForbiddenError("Unauthorized");

        await markAllAsRead(userId);
        sendSuccess(reply, {}, 'All notifications marked as read');
    });

    app.delete("/notifications/:id", { preHandler: authMiddleware }, async (request, reply) => {
        const userId = request.user?.id;
        if (!userId) throw new ForbiddenError("Unauthorized");

        const { id } = request.params as { id: string };
        await deleteNotification(id, userId);
        sendSuccess(reply, {}, 'Notification deleted');
    });

    app.post("/internal/notifications", {
        preHandler: bodyValidator(createNotificationSchema)
    }, async (request, reply) => {
        const { userId, type, title, message, data } = request.body as z.infer<typeof createNotificationSchema>;
        const notification = await createNotification(userId, type, title, message, data);
        sendSuccess(reply, notification, 'Notification created');
    });
}