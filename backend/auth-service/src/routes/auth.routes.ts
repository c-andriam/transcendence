import { FastifyInstance } from "fastify";
import { z } from "zod";
import { bodyValidator, sendSuccess, sendCreated, authMiddleware, sendBadRequest, sendConflict, sendError, HttpStatus, UserRole } from "@transcendence/common";
import { loginUser, registerUser, createRefreshToken, refreshAccessToken, deleteRefreshToken } from "../services/auth.service";
import path from "path";
import { resetPassword, forgotPasswordByEmailIdentifier } from "../services/auth.service";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});

const DOMAIN = process.env.DOMAIN;
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT;
const USER_SERVICE_URL = `${DOMAIN}:${USER_SERVICE_PORT}`;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const NOTIFICATION_SERVICE_PORT = process.env.NOTIFICATION_SERVICE_PORT;
const NOTIFICATION_SERVICE_URL = `${DOMAIN}:${NOTIFICATION_SERVICE_PORT}`;

const registerSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string().min(8).max(142),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatarUrl: z.string().optional(),
    bio: z.string().optional(),
});

const loginSchema = z.object({
    identifier: z.string().min(3).max(50),
    password: z.string().min(8).max(142),
});

const refreshSchema = z.object({
    refreshToken: z.string(),
});

const logoutSchema = z.object({
    refreshToken: z.string(),
});

const emailSchema = z.object({
    email: z.string().email()
});

export async function authRoutes(app: FastifyInstance) {
    app.post("/auth/register", {
        preHandler: bodyValidator(registerSchema)
    }, async (request, reply) => {
        try {
            const result = await registerUser(request.body);
            sendCreated(reply, result, 'User registered successfully');
        } catch (error: any) {
            if (error.code === 'P2002' || error.message.includes('exists')) {
                return sendConflict(reply, "User with this email or username already exists");
            }
            app.log.error(error);
            sendError(reply, "Registration failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    });

    app.post("/auth/login", {
        preHandler: bodyValidator(loginSchema)
    }, async (request, reply) => {
        try {
            const result = await loginUser(request.body);
            const { refreshToken, ...user } = result;
            const accessToken = app.jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role || 'USER',
                },
                {
                    expiresIn: '15m',
                }
            );
            reply.setCookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,//process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/v1/auth/refresh',
                maxAge: 7 * 24 * 60 * 60
            });

            sendSuccess(reply, { accessToken }, 'Login successful');
        } catch (error: any) {
            if (error.message === 'Invalid credentials') {
                return sendError(reply, "Invalid credentials", HttpStatus.BAD_REQUEST);
            }
            if (error.message.includes('not found')) {
                return sendError(reply, "User not found", HttpStatus.NOT_FOUND);
            }
            app.log.error(error);
            if (error.message.includes('Please verify your email address before logging in')) {
                return sendError(reply, "Please verify your email address before logging in", HttpStatus.UNAUTHORIZED);
            }
            sendError(reply, "Login failed.", HttpStatus.UNAUTHORIZED);
        }
    });

    app.post("/auth/refresh", async (request, reply) => {
        const refreshToken = request.cookies.refreshToken;
        if (!refreshToken) {
            return sendBadRequest(reply, "Refresh token is required");
        }
        try {
            const result = await refreshAccessToken(refreshToken);
            const accessToken = app.jwt.sign(
                {
                    id: result.userId,
                    username: result.username,
                    role: (result.role as UserRole) || 'USER',
                },
                {
                    expiresIn: '15m',
                }
            );
            reply.setCookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,//process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/v1/auth/refresh',
                maxAge: 7 * 24 * 60 * 60
            });
            sendSuccess(reply, { accessToken }, 'Access token refreshed successfully');
        } catch (error: any) {
            app.log.error(error);
            sendError(reply, `Refresh failed: ${error.message}`, HttpStatus.UNAUTHORIZED);
        }
    });

    app.post("/auth/logout", {
        preHandler: [authMiddleware]
    }, async (request, reply) => {
        const refreshToken = request.cookies.refreshToken;
        if (!refreshToken) {
            return sendBadRequest(reply, "Refresh token is required");
        }
        try {
            await deleteRefreshToken(refreshToken);
            reply.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,//process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/v1/auth/refresh',
            });
            sendSuccess(reply, {}, 'Logout successful');
        } catch (error: any) {
            app.log.error(error);
            sendSuccess(reply, {}, 'Logout successful');
        }
    });

    app.post("/auth/reset-password", {
        preHandler: bodyValidator(z.object({
            token: z.string(),
            newPassword: z.string().min(8).max(142)
        }))
    }, async (request, reply) => {
        const { token, newPassword } = request.body as { token: string; newPassword: string };
        try {
            await resetPassword(token, newPassword);
            sendSuccess(reply, {}, 'Password reset successfully');
        } catch (error: any) {
            app.log.error(error);
            sendError(reply, "Password reset failed", HttpStatus.BAD_REQUEST);
        }
    });

    app.post("/auth/forgot-password", {
        preHandler: bodyValidator(emailSchema)
    }, async (request, reply) => {
        const { email } = request.body as { email: string };
        try {
            await forgotPasswordByEmailIdentifier(email);
            sendSuccess(reply, {}, 'If an account with that email exists, a password reset link has been sent.');
        } catch (error: any) {
            app.log.error(error);
            sendSuccess(reply, {}, 'If an account with that email exists, a password reset link has been sent.');
        }
    });

    app.post("/auth/verify-email", {
        preHandler: bodyValidator(z.object({ token: z.string() }))
    }, async (request, reply) => {
        const { token } = request.body as { token: string };
        try {
            const response = await fetch(`${USER_SERVICE_URL}/api/v1/internal/verify-email-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-internal-api-key': INTERNAL_API_KEY as string },
                body: JSON.stringify({ token })
            });
            if (!response.ok) {
                throw new Error('Verification failed');
            }
            const result = await response.json();
            if (result.status === 'error') {
                throw new Error(result.message || 'Invalid token');
            }
            sendSuccess(reply, {}, 'Email verified');
        } catch (error: any) {
            app.log.error(error);
            return sendBadRequest(reply, 'Invalid or expired verification token');
        }
    });

    app.post("/auth/resend-verification", {
        preHandler: bodyValidator(emailSchema)
    }, async (request, reply) => {
        const { email } = request.body as { email: string };
        try {
            const userResponse = await fetch(`${USER_SERVICE_URL}/api/v1/internal/users/by-email-identifier/${email}`, {
                headers: { 'x-internal-api-key': INTERNAL_API_KEY as string }
            });
            const userResult = await userResponse.json();
            if (userResult.status === 'error') {
                return sendSuccess(reply, {}, 'If an account with that email exists, a verification email has been sent.');
            }
            const { user } = userResult.data;
            const tokenResponse = await fetch(`${USER_SERVICE_URL}/api/v1/internal/create-verification-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-internal-api-key': INTERNAL_API_KEY as string },
                body: JSON.stringify({ userId: user.id })
            });
            const tokenResult = await tokenResponse.json();
            if (tokenResult.status === 'success') {
                await fetch(`${NOTIFICATION_SERVICE_URL}/api/v1/internal/send-verification-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-internal-api-key': INTERNAL_API_KEY as string },
                    body: JSON.stringify({ email: user.email, verificationToken: tokenResult.data.verificationToken })
                });
            }
            sendSuccess(reply, {}, 'If an account with that email exists, a verification email has been sent.');
        } catch (error: any) {
            app.log.error(error);
            return sendError(reply, 'Service unavailable, please try again later', HttpStatus.SERVICE_UNAVAILABLE);
        }
    });
}