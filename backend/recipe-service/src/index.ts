import dotenv from 'dotenv';
import fastify from 'fastify';
import db from './utils/db';
import { recipesRoutes } from './routes/recipe.routes';
import { categoryRoutes } from './routes/category.routes';
import { globalErrorHandler, internalApiKeyMiddleware } from '@transcendence/common';

dotenv.config();

if (!process.env.INTERNAL_API_KEY) {
    throw new Error("INTERNAL_API_KEY is not defined");
}

export const app = fastify({
    logger: true
});

app.setErrorHandler(globalErrorHandler);

const start = async () => {
    try {
        app.decorate('prisma', db);
        app.addHook("preHandler", internalApiKeyMiddleware);
        await app.register(recipesRoutes, { prefix: '/api/v1' });
        await app.register(categoryRoutes, { prefix: '/api/v1' });
        const port = Number(process.env.RECIPE_SERVICE_PORT);
        await app.listen({
            port: port,
            host: '0.0.0.0'
        });
        const recipe_service_url = `${process.env.DOMAIN}:${process.env.RECIPE_SERVICE_PORT}`;
        console.log(`Recipe Service running on ${recipe_service_url}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();