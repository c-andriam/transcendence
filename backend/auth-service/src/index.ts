import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

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

        await app.register(swagger, {
            openapi: {
                info: {
                    title: "Auth Service API",
                    version: "1.0.0"
                }
            }
        });
        await app.register(swaggerUi, {
            routePrefix: "/documentation",
        });

        app.register(require('./routes/auth.routes').authRoutes, {
            prefix: '/api/v1'
        });
        await app.listen({
            port: 3001,
            host: '0.0.0.0'
        });
        app.log.info('Server running on http://localhost:3001');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();