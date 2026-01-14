import fastify from 'fastify';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth.routes';
import { globalErrorHandler } from '@transcendence/common';
import cookie from "@fastify/cookie";
import path from "path";
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const app = fastify({
    logger: true
});

app.setErrorHandler(globalErrorHandler);

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
if (!INTERNAL_API_KEY) {
    throw new Error("INTERNAL_API_KEY is not defined");
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

app.register(jwt, {
    secret: JWT_SECRET
});

const COOKIE_SECRET = process.env.COOKIE_SECRET;

if (!COOKIE_SECRET) {
    throw new Error('COOKIE_SECRET environment variable is required');
}

app.register(cookie, {
  secret: COOKIE_SECRET,
  parseOptions: {}
});

app.register(authRoutes);

const start = async () => {
    try {
        const port = Number(process.env.AUTH_SERVICE_PORT);
        console.log(port);
        await app.listen({
            port: port,
            host: '0.0.0.0'
        });

    const auth_service_url = `${process.env.DOMAIN}:${process.env.AUTH_SERVICE_PORT}`;
    console.log(`Auth Service running on ${auth_service_url}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();