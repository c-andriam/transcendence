import dotenv from 'dotenv';
import fastify from 'fastify';
import db from './utils/db';
import { recipesRoutes } from './routes/recipe.routes';
import { categoryRoutes } from './routes/category.routes';
import { imageRoutes } from './routes/image.routes';
import { globalErrorHandler, internalApiKeyMiddleware, validateEnv } from '@transcendence/common';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
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

app.register(fastifyMultipart, {
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
    }
});

app.get('/health', async () => ({ status: 'ok', service: 'recipe-service', timestamp: new Date().toISOString() }));

const start = async () => {
    try {
        app.decorate('prisma', db);
        await app.register(async (api) => {
            api.addHook("preHandler", internalApiKeyMiddleware);
            await api.register(recipesRoutes, { prefix: '/api/v1' });
            await api.register(categoryRoutes, { prefix: '/api/v1' });
            await api.register(imageRoutes, { prefix: '/api/v1' });
        });

        await app.ready();
        await app.listen({
            port: env.RECIPE_SERVICE_PORT,
            host: '0.0.0.0'
        });

        app.log.info(`Recipe Service running on ${process.env.DOMAIN}:${env.RECIPE_SERVICE_PORT}`);
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