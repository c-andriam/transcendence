import { FastifyInstance } from "fastify";
import { sendResetPasswordEmail, sendVerificationEmail } from "../services/email.service";
import { sendSuccess } from "@transcendence/common";

export async function notificationRoutes(app: FastifyInstance) {
    app.post("/api/v1/internal/send-reset-email", async (request, reply) => {
        const { email, resetToken } = request.body as { email: string; resetToken: string };
        await sendResetPasswordEmail(email, resetToken);
        sendSuccess(reply, {}, 'Email sent');
    });

    app.post("/api/v1/internal/send-verification-email", async (request, reply) => {
        const { email, verificationToken } = request.body as { email: string; verificationToken: string };
        await sendVerificationEmail(email, verificationToken);
        sendSuccess(reply, {}, 'Verification email sent');
    });
}