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

app.get('/health', async (request, reply) => {
    return {
        status: 'ok',
        service: 'chat-service'
    };
});

const start = async () => {
    try {
        app.log.info('Database connection...');
        await prisma.$connect();
        app.log.info('Database connected');

        await app.register(swagger, {
            openapi: {
                info: {
                    title: "Chat Service API",
                    version: "1.0.0"
                }
            }
        });
        await app.register(swaggerUi, {
            routePrefix: "/documentation",
        });
        await app.listen({
            port: 3005,
            host: '0.0.0.0'
        });
        app.log.info('Server running on http://localhost:3005');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();