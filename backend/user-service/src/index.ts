import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import db from './utils/dbPlugin';
import { userRoutes } from './routes/user.routes';
import { globalErrorHandler, internalApiKeyMiddleware } from '@transcendence/common';
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

if (!process.env.INTERNAL_API_KEY) {
    throw new Error("INTERNAL_API_KEY is not defined");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export const app = fastify({
    logger: true
});

const JWT_SECRET = process.env.JWT_SECRET;

app.register(fastifyJwt, {
    secret: JWT_SECRET
});

app.setErrorHandler(globalErrorHandler);

const start = async () => {
    try {
        app.decorate('db', db);
        app.addHook('preHandler', internalApiKeyMiddleware);
        await app.register(userRoutes, { prefix: '/api/v1' });
        const port = Number(process.env.USER_SERVICE_PORT);
        await app.listen({
            port: port,
            host: '0.0.0.0'
        });
        const user_service_url = `${process.env.DOMAIN}:${process.env.USER_SERVICE_PORT}`;
        console.log(`User Service running on ${user_service_url}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();