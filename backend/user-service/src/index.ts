import dotenv from 'dotenv';
import fastify from 'fastify';
import db from './utils/dbPlugin';
import { userRoutes } from './routes/user.routes';
import { apikeyMiddleware } from './middleware/apikey.middleware';

dotenv.config();

export const app = fastify({
    logger: true
});

const start = async () => {
    try {
        app.decorate('db', db);
        app.addHook('preHandler', apikeyMiddleware);
        app.register(userRoutes, { prefix: '/api/v1' });
        const port = 3005;
        await app.listen({
            port: port,
            host: '0.0.0.0'
        });
        app.log.info(`User Service running on ${process.env.USER_SERVICE_URL}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();