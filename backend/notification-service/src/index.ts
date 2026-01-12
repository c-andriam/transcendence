import 'dotenv/config';
import fastify from 'fastify';
import { notificationRoutes } from './routes/notification.routes';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const app = fastify({
    logger: true
});

app.register(notificationRoutes);

const start = async () => {
    try {
        const port = process.env.NOTIFICATION_SERVICE_PORT ? parseInt(process.env.NOTIFICATION_SERVICE_PORT) : 3005;
        await app.listen({
            port: port,
            host: '0.0.0.0'
        });

        app.log.info(`Notification Service running on http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();