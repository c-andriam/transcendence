import { Resend } from "resend";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// const USE_CONSOLE_LOG = process.env.NODE_ENV !== 'production' || !RESEND_API_KEY;

const USE_CONSOLE_LOG = false;

if (!RESEND_API_KEY && !USE_CONSOLE_LOG) {
    console.error("RESEND_API_KEY is not defined");
    throw new Error("RESEND_API_KEY is required");
}

console.log("Email service mode:", USE_CONSOLE_LOG ? "CONSOLE LOG (dev)" : "RESEND");

const resend = USE_CONSOLE_LOG ? null : new Resend(RESEND_API_KEY);

export async function sendResetPasswordEmail(to: string, resetToken: string) {
    console.log(`📧 Sending reset password email to: ${to}`);
    console.log(`🔗 Reset link: https://cookshare.me/reset-password?token=${resetToken}`);

    const msgToSend = {
        to: to,
        from: 'cookshare@cookshare.me',
        subject: 'Reset Your Password',
        html: `<p>Click <a href="https://cookshare.me/reset-password?token=${resetToken}">here</a> to reset your password.</p>`
    };

    if (USE_CONSOLE_LOG) {
        console.log("📧 EMAIL CONTENT (DEV MODE):", msgToSend);
        return { success: true, mode: 'dev' };
    }

    try {
        const result = await resend.emails.send(msgToSend);
        console.log("✅ Reset password email sent successfully:", result);
        return result;
    } catch (error) {
        console.error("❌ Error sending reset password email:", error);
        throw error;
    }
}

export async function sendVerificationEmail(to: string, verificationToken: string) {
    console.log(`📧 Sending verification email to: ${to}`);
    console.log(`🔗 Verification link: https://cookshare.me/verify-email?token=${verificationToken}`);

    const msg = {
        to,
        from: 'cookshare@cookshare.me',
        subject: 'Verify Your Email',
        html: `<p>Click <a href="https://cookshare.me/verify-email?token=${verificationToken}">here</a> to verify your email.</p>`
    };

    if (USE_CONSOLE_LOG) {
        console.log("📧 EMAIL CONTENT (DEV MODE):", msg);
        return { success: true, mode: 'dev' };
    }

    try {
        const result = await resend.emails.send(msg);
        console.log("✅ Verification email sent successfully:", result);
        return result;
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw error;
    }
}