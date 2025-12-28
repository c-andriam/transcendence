import { FastifyInstance } from "fastify";
import httpProxy from "@fastify/http-proxy";

export async function authRoutes(app: FastifyInstance) {
    const routes = [
        { prefix: '/auth', rewritePrefix: '/api/v1' }
    ];
    for (const route of routes) {
        app.register(httpProxy, {
            upstream: 'http://localhost:3001',
            prefix: route.prefix,
            rewritePrefix: route.rewritePrefix,
            http2: false
        });
    }
}
