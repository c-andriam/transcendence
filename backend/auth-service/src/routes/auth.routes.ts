import { FastifyInstance } from "fastify";
import { loginUser, registerUser } from "../services/auth.service";
import { z } from "zod";
import { JWT } from "@fastify/jwt";

const registerSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string().min(8).max(42),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatarUrl: z.string().optional(),
    bio: z.string().optional(),
});

const loginSchema = z.object({
    identifier: z.string().min(3).max(50),
    password: z.string().min(8).max(42),
});

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", async (request, reply) => {
        try {
            const validatedData = registerSchema.parse(request.body);
            const result = await registerUser(validatedData);
            if (result.status === 'error') {
                return reply.status(400).send(result);
            }
            return reply.status(201).send(result);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.issues
                });
            }
            return reply.status(500).send({
                status: 'error',
                message: error.message || 'Internal Server Error'
            });
        }
    });

    app.post("/login", async (request, reply) => {
        try {
            const validatedData = loginSchema.parse(request.body);
            const user = await loginUser(validatedData);
            const token = app.jwt.sign({
                id: user.id,
                username: user.username,
            });
            return reply.status(200).send({
                status: 'success',
                data: {
                    token
                }
            });
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.issues
                });
            }
            return reply.status(401).send({
                status: 'error',
                message: error.message || 'Invalid credentials'
            });
        }
    });
}