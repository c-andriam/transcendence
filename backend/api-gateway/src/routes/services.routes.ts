import { FastifyInstance } from "fastify";
import httpProxy from "@fastify/http-proxy";

export async function otherServicesRoutes(app: FastifyInstance) {
    // Notification Service (3002)
    app.register(httpProxy, {
        upstream: 'http://localhost:3002',
        prefix: '/notifications',
        rewritePrefix: '',
        http2: false
    });

    // User Service (3004)
    app.register(httpProxy, {
        upstream: 'http://localhost:3004',
        prefix: '/users',
        rewritePrefix: '',
        http2: false
    });

    // Chat Service (3005)
    app.register(httpProxy, {
        upstream: 'http://localhost:3005',
        prefix: '/chat',
        rewritePrefix: '',
        http2: false
    });
}
