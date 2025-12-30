import { FastifyInstance } from "fastify";
import { loginUser, registerUser } from "../services/auth.service";
import { z } from "zod";
import { JWT } from "@fastify/jwt";

const registerSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatarUrl: z.string().optional(),
    bio: z.string().optional(),
});

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", async (request, reply) => {
        try {
            const result = await registerUser(request.body);
            if (result.status === 'error') {
                return reply.status(400).send(result);
            }
            return reply.status(201).send(result);
        } catch (error) {
            return reply.status(500).send({
                status: 'error',
                message: 'Internal Server Error'
            });
        }
    });

    app.post("/login", async (request, reply) => {
        try {
            const user = await loginUser(request.body);
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
            return reply.status(401).send({
                status: 'error',
                message: error.message || 'Invalid credentials'
            });
        }
    });
}