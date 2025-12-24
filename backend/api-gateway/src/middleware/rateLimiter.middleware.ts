import rateLimit from '@fastify/rate-limit'
import { FastifyInstance } from 'fastify'

export async function registerRateLimiter(app: FastifyInstance) {
    await app.register(rateLimit, {
        max: 100,
        timeWindow: 60000
    });
}