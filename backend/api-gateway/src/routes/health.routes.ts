import { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
    app.get('/health', async (request, reply) => {
        try {
            const [recipeHealth, authHealth] = await Promise.allSettled([
                fetch('http://localhost:3003/api/v1/health').then(res => res.json()),
                fetch('http://localhost:3001/api/v1/health').then(res => res.json())
            ]);

            const recipeStatus = recipeHealth.status === 'fulfilled' ? recipeHealth.value : { status: 'down', error: recipeHealth.reason };
            const authStatus = authHealth.status === 'fulfilled' ? authHealth.value : { status: 'down', error: authHealth.reason };

            const isHealthy = recipeHealth.status === 'fulfilled' && authHealth.status === 'fulfilled';

            return reply.code(isHealthy ? 200 : 503).send({
                status: isHealthy ? 'ok' : 'partial_outage',
                services: {
                    recipe: recipeStatus,
                    auth: authStatus
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
