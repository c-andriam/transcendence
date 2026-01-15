import fastify from 'fastify';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth.routes';
import { globalErrorHandler, validateEnv } from '@transcendence/common';
import cookie from "@fastify/cookie";
import path from "path";
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

app.register(jwt, {
    secret: env.JWT_SECRET
});

app.register(cookie, {
    secret: env.COOKIE_SECRET,
    parseOptions: {}
});

app.get('/health', async () => ({ status: 'ok', service: 'auth-service', timestamp: new Date().toISOString() }));

const start = async () => {
    try {
        await app.register(authRoutes, { prefix: '/api/v1' });

        await app.ready();
        await app.listen({
            port: env.AUTH_SERVICE_PORT,
            host: '0.0.0.0'
        });

        app.log.info(`Auth Service running on ${process.env.DOMAIN}:${env.AUTH_SERVICE_PORT}`);
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