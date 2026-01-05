import { FastifyInstance } from "fastify";
import { z } from "zod";
import { bodyValidator, sendSuccess, sendCreated, authMiddleware } from "@transcendence/common";
import { loginUser, registerUser, createRefreshToken, refreshAccessToken, deleteRefreshToken } from "../services/auth.service";
import path from "path";

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

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", {
        preHandler: bodyValidator(registerSchema)
    }, async (request, reply) => {
        const result = await registerUser(request.body);
        sendCreated(reply, result, 'User registered successfully');
    });

    app.post("/login", {
        preHandler: bodyValidator(loginSchema)
    }, async (request, reply) => {
        const result = await loginUser(request.body);
        const { refreshToken, ...user } = result;
        const accessToken = app.jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            {
                expiresIn: '15m',
            }
        );
        // reply.setCookie('refreshToken', refreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'strict',
        //     path: '/refresh',
        //     maxAge: 7 * 24 * 60 * 60
        // });
        sendSuccess(reply, { accessToken, refreshToken }, 'Login successful');
    });

    app.post("/refresh", {
        preHandler: bodyValidator(refreshSchema)
    }, async (request, reply) => {
        const { refreshToken } = request.body as z.infer<typeof refreshSchema>;
        const result = await refreshAccessToken(refreshToken);
        const accessToken = app.jwt.sign(
            {
                id: result.userId,
                username: result.username,
            },
            {
                expiresIn: '15m',
            }
        );
        // reply.setCookie('refreshToken', result.refreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'strict',
        //     path: '/refresh',
        //     maxAge: 7 * 24 * 60 * 60
        // });
        sendSuccess(reply, { accessToken, refreshToken: result.refreshToken }, 'Access token refreshed successfully');
    });

    app.post("/logout", {
        preHandler: [authMiddleware, bodyValidator(logoutSchema)]
    }, async (request, reply) => {
        const { refreshToken } = request.body as z.infer<typeof logoutSchema>;
        await deleteRefreshToken(refreshToken);
        // reply.clearCookie('refreshToken', {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'strict',
        //     path: '/refresh',
        // });
        sendSuccess(reply, {}, 'Logout successful');
    });
}