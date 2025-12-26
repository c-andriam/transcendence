import { FastifyInstance } from "fastify";
import httpProxy from "@fastify/http-proxy";

export async function recipesRoutes(app: FastifyInstance) {
    const routes = [
        { prefix: '/recipes', rewritePrefix: '/api/v1/recipes' }
    ];

    for (const route of routes) {
        app.register(httpProxy, {
            upstream: 'http://localhost:3003',
            prefix: route.prefix,
            rewritePrefix: route.rewritePrefix,
            http2: false
        });
    }
}
