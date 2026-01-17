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

const BRAND_COLOR = "#ff6b6b";
const TEXT_COLOR = "#2d3436";
const BG_COLOR = "#f9f9f9";

function wrapInBaseTemplate(title: string, content: string, ctaText?: string, ctaUrl?: string) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${TEXT_COLOR}; background-color: ${BG_COLOR}; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: ${BRAND_COLOR}; padding: 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px; }
        .footer { background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #636e72; }
        .button { display: inline-block; padding: 14px 30px; background-color: ${BRAND_COLOR}; color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 25px; }
        .warning { color: #d63031; font-weight: bold; }
        p { margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CookShare</h1>
        </div>
        <div class="content">
            <h2>${title}</h2>
            ${content}
            ${ctaText && ctaUrl ? `<center><a href="${ctaUrl}" class="button">${ctaText}</a></center>` : ''}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CookShare. All rights reserved.</p>
            <p>You received this email because of your account activity on CookShare.</p>
        </div>
    </div>
</body>
</html>
    `;
}

export async function sendResetPasswordEmail(to: string, resetToken: string) {
    const resetUrl = `https://cookshare.me/reset-password?token=${resetToken}`;
    const html = wrapInBaseTemplate(
        "Reset Your Password",
        `<p>Hello,</p>
         <p>We received a request to reset your password for your CookShare account. If you didn't make this request, you can safely ignore this email.</p>
         <p>Otherwise, click the button below to choose a new password. This link will expire in 1 hour.</p>`,
        "Reset Password",
        resetUrl
    );

    const msgToSend = {
        to: to,
        from: 'CookShare <no-reply@cookshare.me>',
        subject: 'Reset Your Password - CookShare',
        html
    };

    if (USE_CONSOLE_LOG) {
        console.log('[DEV] Reset email sent to:', to);
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
    const verifyUrl = `https://cookshare.me/verify-email?token=${verificationToken}`;
    const html = wrapInBaseTemplate(
        "Welcome to CookShare!",
        `<p>Hello and welcome!</p>
         <p>Thank you for joining our community of food lovers. Click the button below to verify your email address and start exploring thousands of recipes.</p>`,
        "Verify Email",
        verifyUrl
    );

    const msg = {
        to,
        from: 'CookShare <no-reply@cookshare.me>',
        subject: 'Verify Your Email - CookShare',
        html
    };

    if (USE_CONSOLE_LOG) {
        console.log('[DEV] Verification email sent to:', to);
        return { success: true, mode: 'dev' };
    }

    try {
        const result = await resend.emails.send(msg);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function sendDeletionConfirmationEmail(to: string, deletionToken: string, username: string) {
    const confirmUrl = `https://cookshare.me/gdpr/confirm-deletion?token=${deletionToken}`;
    const html = wrapInBaseTemplate(
        "Account Deletion Request",
        `<p>Hello <strong>${username}</strong>,</p>
         <p>We received a request to permanently delete your CookShare account.</p>
         <p class="warning">⚠️ This action is IRREVERSIBLE. All your recipes, comments, ratings, and collections will be permanently removed.</p>
         <p>If you want to proceed with the deletion, click the button below. This link will expire in 24 hours.</p>`,
        "Confirm Permanent Deletion",
        confirmUrl
    );

    const msg = {
        to,
        from: 'CookShare <no-reply@cookshare.me>',
        subject: '⚠️ Confirm Account Deletion - CookShare',
        html
    };

    if (USE_CONSOLE_LOG) {
        console.log('[DEV] Deletion email sent to:', to);
        return { success: true, mode: 'dev' };
    }

    try {
        const result = await resend.emails.send(msg);
        return result;
    } catch (error) {
        throw error;
    }
}