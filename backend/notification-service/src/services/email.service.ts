import { Resend } from "resend";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const USE_CONSOLE_LOG = false;

if (!RESEND_API_KEY && !USE_CONSOLE_LOG) {
    console.error("RESEND_API_KEY is not defined");
    throw new Error("RESEND_API_KEY is required");
}

const resend = USE_CONSOLE_LOG ? null : new Resend(RESEND_API_KEY);

export async function sendResetPasswordEmail(to: string, resetToken: string) {
    const msgToSend = {
        to: to,
        from: 'cookshare@cookshare.me',
        subject: 'Reset Your Password',
        html: `<p>Click <a href="https://cookshare.me/reset-password?token=${resetToken}">here</a> to reset your password.</p>`
    };

    if (USE_CONSOLE_LOG) {
        return { success: true, mode: 'dev' };
    }

    try {
        const result = await resend.emails.send(msgToSend);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function sendVerificationEmail(to: string, verificationToken: string) {
    const msg = {
        to,
        from: 'cookshare@cookshare.me',
        subject: 'Verify Your Email',
        html: `<p>Click <a href="https://cookshare.me/verify-email?token=${verificationToken}">here</a> to verify your email.</p>`
    };
    if (USE_CONSOLE_LOG) {
        return { success: true, mode: 'dev' };
    }
    try {
        const result = await resend.emails.send(msg);
        return result;
    } catch (error) {
        throw error;
    }
}