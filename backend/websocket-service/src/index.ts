import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { globalErrorHandler, validateEnv, internalApiKeyMiddleware } from '@transcendence/common';
import { SocketService } from './services/socket.service';
import { internalRoutes } from './routes/internal.routes';

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

app.get('/health', async () => ({ status: 'ok', service: 'websocket-service', timestamp: new Date().toISOString() }));

const start = async () => {
    try {
        await app.register(internalRoutes);

        await app.ready();
        SocketService.initialize(app);

        await app.listen({
            port: env.WEBSOCKET_SERVICE_PORT,
            host: '0.0.0.0'
        });

        app.log.info(`WebSocket Service running on ${process.env.DOMAIN}:${env.WEBSOCKET_SERVICE_PORT}`);
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