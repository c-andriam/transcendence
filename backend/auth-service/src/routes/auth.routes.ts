import { FastifyInstance } from 'fastify';

export async function authRoutes(app: FastifyInstance) {

    app.get('/health', {
        schema: {
            tags: ['Auth'],
            summary: 'Auth Service Health'
        }
    }, async (request, reply) => {
        return {
            status: 'ok',
            service: 'auth-service'
        };
    });
}