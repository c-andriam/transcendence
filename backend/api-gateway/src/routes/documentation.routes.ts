import { FastifyInstance } from "fastify";


export async function documentationRoutes(app: FastifyInstance) {
    app.get('/json', async (request, reply) => {
        try {
            const rootDoc: any = {
                openapi: "3.0.3",
                info: {
                    title: "Transcendence API",
                    version: "1.0.0",
                },
                servers: [
                    {
                        url: "/api/v1",
                        description: "API Gateway (V1)"
                    }
                ],
                paths: {
                    "/health": {
                        "get": {
                            "tags": ["API Gateway"],
                            "summary": "Check the health of all microservices",
                            "responses": { "200": { "description": "OK" } }
                        }
                    },
                    "/json": {
                        "get": {
                            "tags": ["API Gateway"],
                            "summary": "Get the aggregated OpenAPI JSON",
                            "responses": { "200": { "description": "OK" } }
                        }
                    },
                    "/status": {
                        "get": {
                            "tags": ["API Gateway"],
                            "summary": "Diagnostic: Aggregator is active",
                            "responses": { "200": { "description": "OK" } }
                        }
                    }
                },
                components: {
                    schemas: {}
                },
                tags: [
                    { name: 'API Gateway', description: 'Internal utility routes' }
                ]
            }

            const targets = [
                { name: 'Recipe', url: 'http://localhost:3003/documentation/json' },
                { name: 'Auth', url: 'http://localhost:3001/documentation/json' },
                { name: 'Notification', url: 'http://localhost:3002/documentation/json' },
                { name: 'User', url: 'http://localhost:3004/documentation/json' },
                { name: 'Chat', url: 'http://localhost:3005/documentation/json' }
            ];

            const results = await Promise.allSettled(
                targets.map(t => fetch(t.url).then(res => res.json()))
            );

            results.forEach((res, index) => {
                const targetName = targets[index].name;
                if (res.status === 'fulfilled' && res.value) {
                    const data = res.value;

                    // Merge paths
                    if (data.paths) {
                        for (const [path, methods] of Object.entries(data.paths)) {
                            // Strip /api/v1 and ensure it starts with /
                            let newPath = path.startsWith('/api/v1') ? path.replace('/api/v1', '') : path;
                            if (!newPath.startsWith('/')) newPath = '/' + newPath;
                            // Remove any double slashes
                            newPath = newPath.replace(/\/+/g, '/');
                            rootDoc.paths[newPath] = methods;
                        }
                    }

                    // Merge components
                    if (data.components?.schemas) {
                        rootDoc.components.schemas = { ...rootDoc.components.schemas, ...data.components.schemas };
                    }

                    // Merge tags
                    if (Array.isArray(data.tags)) {
                        data.tags.forEach((tag: any) => {
                            if (tag && tag.name && !rootDoc.tags.some((rt: any) => rt.name === tag.name)) {
                                rootDoc.tags.push(tag);
                            }
                        });
                    }
                } else {
                    app.log.warn(`Aggregator: Failed to fetch from ${targetName}`);
                }
            });
            return reply.send(rootDoc);
        } catch (error) {
            return reply.code(500).send({
                status: 'error',
                message: 'Failed to aggregate documentation',
                error: String(error)
            });
        }
    });
}