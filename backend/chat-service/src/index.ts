import 'dotenv/config';
import fastify from 'fastify';

const app = fastify({
    logger: true
});

const start = async () => {
    try {
        const port = 3003;
        await app.listen({
            port: port,
            host: '0.0.0.0'
        });

        app.log.info(`Chat Service running on http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();