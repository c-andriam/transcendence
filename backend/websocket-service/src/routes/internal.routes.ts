import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { bodyValidator, sendSuccess, internalApiKeyMiddleware } from '@transcendence/common';
import { SocketService } from '../services/socket.service';

const triggerEventSchema = z.object({
    userId: z.string().min(1),
    event: z.string().min(1),
    data: z.any()
});

export async function internalRoutes(app: FastifyInstance) {
    app.post("/internal/trigger-event", {
        preHandler: [internalApiKeyMiddleware, bodyValidator(triggerEventSchema)]
    }, async (request, reply) => {
        const { userId, event, data } = request.body as z.infer<typeof triggerEventSchema>;
        SocketService.emitToUser(userId, event, data);
        sendSuccess(reply, { dispatched: true }, 'Event triggered successfully');
    });

    const triggerRoomEventSchema = z.object({
        room: z.string().min(1),
        event: z.string().min(1),
        data: z.any()
    });

    app.post("/internal/trigger-room-event", {
        preHandler: [internalApiKeyMiddleware, bodyValidator(triggerRoomEventSchema)]
    }, async (request, reply) => {
        const { room, event, data } = request.body as z.infer<typeof triggerRoomEventSchema>;
        SocketService.emitToRoom(room, event, data);
        sendSuccess(reply, { dispatched: true }, 'Room event triggered successfully');
    });
}
