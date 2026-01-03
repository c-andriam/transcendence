import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hydrateRecipes } from "./hydration";

export async function proxyRequest(
    request: FastifyRequest,
    reply: FastifyReply,
    path: string,
    serviceUrl: string
) {
    const url = new URL(`${serviceUrl}${path}`);
    const query = request.query as Record<string, any>;
    if (query) {
        Object.keys(query).forEach(key => {
            if (query[key] !== undefined) {
                url.searchParams.append(key, String(query[key]))
            }
        });
    }

    const options: RequestInit = {
        method: request.method,
        headers: {
            "x-internal-api-key": process.env.INTERNAL_API_KEY,
            ...(request.headers.authorization && {
                "authorization": request.headers.authorization
            })
        }
    };

    if (['POST', 'PUT'].includes(request.method) && request.body) {
        options.headers["content-type"] = "application/json";
        options.body = JSON.stringify(request.body);
    }

    try {
        const response = await fetch(url.toString(), options);
        const statusCode = response.status;
        const body = await response.json();

        return { statusCode, body };
    } catch (error) {
        throw error;
    }
}

export async function proxyHydrate(
    app: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply,
    path: string,
    serviceUrl: string
) {
    try {
        const { statusCode, body } = await proxyRequest(request, reply, path, serviceUrl);

        if (statusCode >= 200 && statusCode < 300 && body.data) {
            body.data = await hydrateRecipes(app, body.data);
        }
        return reply.status(statusCode).send(body);
    } catch (error) {
        const status = (error as any).status || 500;
        const message = (error as any).data?.message || "Internal server error";
        reply.status(status).send({
            status: "error",
            message
        });
    }
}
