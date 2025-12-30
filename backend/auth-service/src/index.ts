import 'dotenv/config';
import fastify from 'fastify';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth.routes';

const app = fastify({
    logger: true
});

app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret'
});

app.register(authRoutes);

const start = async () => {
    try {
        const port = 3002;
        await app.listen({
            port: port,
            host: '0.0.0.0'
        });

        app.log.info(`Auth Service running on http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();