import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import db from './utils/dbPlugin';
import { userRoutes } from './routes/user.routes';
import { globalErrorHandler, internalApiKeyMiddleware, validateEnv } from '@transcendence/common';
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

const env = validateEnv();

export const app = fastify({
    logger: {
        level: env.LOG_LEVEL
    }
});

app.setErrorHandler(globalErrorHandler);

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
});

app.get('/health', async () => ({ status: 'ok', service: 'user-service', timestamp: new Date().toISOString() }));

const start = async () => {
    try {
        app.decorate('db', db);
        await app.register(async (api) => {
            api.addHook('preHandler', internalApiKeyMiddleware);
            await api.register(userRoutes, { prefix: '/api/v1' });
        });

        await app.ready();
        await app.listen({
            port: env.USER_SERVICE_PORT,
            host: '0.0.0.0'
        });

        app.log.info(`User Service running on ${process.env.DOMAIN}:${env.USER_SERVICE_PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
    process.on(signal, async () => {
        app.log.info(`Received ${signal}, closing server...`);
        await app.close();
        process.exit(0);
    });
});

start();