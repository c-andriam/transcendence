import rateLimit from '@fastify/rate-limit'
import { FastifyInstance } from 'fastify'

export async function registerRateLimiter(app: FastifyInstance) {
    await app.register(rateLimit, {
        max: 10,
        timeWindow: 60000
    });
}