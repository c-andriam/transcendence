import 'dotenv/config';
import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { notificationRoutes } from './routes/notification.routes';
import { globalErrorHandler, internalApiKeyMiddleware, validateEnv } from '@transcendence/common';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

const env = validateEnv();

const app = fastify({
    logger: {
        level: env.LOG_LEVEL
    }
});

app.setErrorHandler(globalErrorHandler);

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
});

app.get('/health', async () => ({ status: 'ok', service: 'notification-service', timestamp: new Date().toISOString() }));

const start = async () => {
    try {
        await app.register(async (api) => {
            api.addHook('preHandler', internalApiKeyMiddleware);
            await api.register(notificationRoutes, { prefix: '/api/v1' });
        });

        await app.ready();
        await app.listen({
            port: env.NOTIFICATION_SERVICE_PORT,
            host: '0.0.0.0'
        });

        app.log.info(`Notification Service running on ${process.env.DOMAIN}:${env.NOTIFICATION_SERVICE_PORT}`);
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