import 'dotenv/config';
import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { globalErrorHandler, internalApiKeyMiddleware, validateEnv } from '@transcendence/common';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

const env = validateEnv();

const app = fastify({
    logger: {
        level: env.LOG_LEVEL,
    }
});

app.setErrorHandler(globalErrorHandler);

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
});

app.get('/health', async () => ({ status: 'ok', service: 'chat-service', timestamp: new Date().toISOString() }));

const start = async () => {
    try {
        await app.register(async (api) => {
            api.addHook('preHandler', internalApiKeyMiddleware);
        });

        await app.ready();
        await app.listen({
            port: env.CHAT_SERVICE_PORT,
            host: '0.0.0.0'
        });

        app.log.info(`Chat Service running on ${process.env.DOMAIN}:${env.CHAT_SERVICE_PORT}`);
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