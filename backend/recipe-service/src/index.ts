import dotenv from 'dotenv';
import fastify from 'fastify';
import db from './utils/db';
import { recipesRoutes } from './routes/recipe.routes';
import { apikeyMiddleware } from './middleware/apikey.middleware';
import { categoryRoutes } from './routes/category.routes';

dotenv.config();

export const app = fastify({
    logger: true
});

const start = async () => {
    try {
        app.decorate('prisma', db);
        app.addHook("preHandler", apikeyMiddleware);
        await app.register(recipesRoutes, { prefix: '/api/v1' });
        await app.register(categoryRoutes, { prefix: '/api/v1' });
        const port = 3001;
        await app.listen({
            port: port,
            host: '0.0.0.0'
        });
        app.log.info(`Recipe Service running on ${process.env.RECIPE_SERVICE_URL}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();