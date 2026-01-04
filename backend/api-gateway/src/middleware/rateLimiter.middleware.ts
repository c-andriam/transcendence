import rateLimit from '@fastify/rate-limit'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

const requestStore = new Map<string, number[]>();

export async function registerRateLimiter(app: FastifyInstance) {
    await app.register(rateLimit, {
        max: 100,
        timeWindow: 60000
    });
}

export function strictRateLimiter(max: number = 15, timeWindow: number = 60000) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const ip = request.ip;
        const now = Date.now();
        const timestamps = requestStore.get(ip) || [];
        const validTimestamps = timestamps.filter(ts => now - ts < timeWindow);
        if (validTimestamps.length >= max) {
            return reply.status(429).send({ status: 'error', message: 'Too many requests, please try again later.' });
        }
        validTimestamps.push(now);
        requestStore.set(ip, validTimestamps);
    };
}

export function moderateRateLimiter(max: number = 20, timeWindow: number = 60000) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const ip = request.ip;
        const now = Date.now();
        const timestamps = requestStore.get(ip) || [];
        const validTimestamps = timestamps.filter(ts => now - ts < timeWindow);
        if (validTimestamps.length >= max) {
            return reply.status(429).send({ status: 'error', message: 'Too many requests, please try again later.' });
        }
        validTimestamps.push(now);
        requestStore.set(ip, validTimestamps);
    };
}