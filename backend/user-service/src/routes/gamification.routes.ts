
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { bodyValidator, sendSuccess, internalApiKeyMiddleware, authMiddleware } from '@transcendence/common';
import { processGamificationEvent, getUserGamificationProfile, GamificationEvent } from '../services/gamification.service';

const eventSchema = z.object({
    userId: z.string().uuid(),
    event: z.nativeEnum(GamificationEvent),
    data: z.any().optional()
});

export async function gamificationRoutes(app: FastifyInstance) {
    // Internal route for other services to trigger events
    app.post("/internal/gamification/event", {
        preHandler: [internalApiKeyMiddleware, bodyValidator(eventSchema)]
    }, async (request, reply) => {
        const { userId, event, data } = request.body as z.infer<typeof eventSchema>;
        const result = await processGamificationEvent(userId, event, data);
        sendSuccess(reply, result);
    });

    // Public route to see gamification stats
    app.get("/users/:id/gamification", async (request, reply) => {
        const { id } = request.params as { id: string };
        const profile = await getUserGamificationProfile(id);
        sendSuccess(reply, profile);
    });
}
