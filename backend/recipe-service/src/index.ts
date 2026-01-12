import dotenv from 'dotenv';
import fastify from 'fastify';
import db from './utils/db';
import { recipesRoutes } from './routes/recipe.routes';
import { categoryRoutes } from './routes/category.routes';
import { imageRoutes } from './routes/image.routes';
import { globalErrorHandler, internalApiKeyMiddleware } from '@transcendence/common';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

// dotenv.config();
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

if (!INTERNAL_API_KEY) {
    throw new Error("INTERNAL_API_KEY is not defined");
}

export const app = fastify({
    logger: true
});

app.setErrorHandler(globalErrorHandler);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

app.register(fastifyJwt, {
    secret: JWT_SECRET
});

app.register(fastifyMultipart, {
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
    }
});

const start = async () => {
    try {
        app.decorate('prisma', db);
        app.addHook("preHandler", internalApiKeyMiddleware);
        await app.register(recipesRoutes, { prefix: '/api/v1' });
        await app.register(categoryRoutes, { prefix: '/api/v1' });
        await app.register(imageRoutes, { prefix: '/api/v1' });
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