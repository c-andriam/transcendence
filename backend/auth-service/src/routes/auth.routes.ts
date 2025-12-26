import { FastifyInstance } from 'fastify';

export async function authRoutes(app: FastifyInstance) {

    app.get('/health', async (request, reply) => {
        return {
            status: 'ok',
            service: 'auth-service'
        };
    });
}