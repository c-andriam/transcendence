import { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
    app.get('/health', {
        schema: {
            tags: ['Gateway'],
            summary: 'Check the health of all microservices'
        }
    }, async (request, reply) => {
        try {
            const [recipeHealth, authHealth, notificationHealth, userHealth, chatHealth] = await Promise.allSettled([
                fetch('http://localhost:3003/api/v1/health').then(res => res.json()),
                fetch('http://localhost:3001/api/v1/health').then(res => res.json()),
                fetch('http://localhost:3002/health').then(res => res.json()),
                fetch('http://localhost:3004/health').then(res => res.json()),
                fetch('http://localhost:3005/health').then(res => res.json())
            ]);

            const getStatus = (res: any) => res.status === 'fulfilled' ? res.value : { status: 'down', error: res.reason };

            const recipeStatus = getStatus(recipeHealth);
            const authStatus = getStatus(authHealth);
            const notificationStatus = getStatus(notificationHealth);
            const userStatus = getStatus(userHealth);
            const chatStatus = getStatus(chatHealth);

            const isHealthy = [recipeHealth, authHealth, notificationHealth, userHealth, chatHealth].every(h => h.status === 'fulfilled');

            return reply.code(isHealthy ? 200 : 503).send({
                status: isHealthy ? 'ok' : 'partial_outage',
                services: {
                    recipe: recipeStatus,
                    auth: authStatus,
                    notification: notificationStatus,
                    user: userStatus,
                    chat: chatStatus
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            return reply.code(500).send({
                status: 'error',
                message: 'Failed to aggregate health checks',
                error: String(error)
            });
        }
    });
}
