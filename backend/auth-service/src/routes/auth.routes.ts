import { FastifyInstance } from "fastify";
import { loginUser, registerUser } from "../services/auth.service";
import { z } from "zod";
import { bodyValidator, sendSuccess, sendCreated } from "@transcendence/common";

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
        const user = await loginUser(request.body);
        const token = app.jwt.sign({
            id: user.id,
            username: user.username,
        });
        sendSuccess(reply, { token }, 'Login successful');
    });
}