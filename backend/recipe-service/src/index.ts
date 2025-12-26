import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const app = fastify({
    logger: true
});

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const start = async () => {
    try {
        app.log.info('Database connection...');
        await prisma.$connect();
        app.log.info('Database connected');
        app.decorate('prisma', prisma);
        app.register(require('./routes/recipe.routes').recipesRoutes, {
            prefix: '/api/v1/'
        });
        await app.listen({
            port: 3003,
            host: '0.0.0.0'
        });
        app.log.info('Server running on http://localhost:3003');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    };
};

start();