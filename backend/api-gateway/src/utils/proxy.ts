import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hydrateRecipes } from "./hydration";
import { HttpStatus, sendError } from "@transcendence/common";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});

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
            }),
            ...(request.headers.cookie && {
                "cookie": request.headers.cookie
            })
        }
    };
    if (['POST', 'PUT', 'DELETE'].includes(request.method) && request.body) {
        options.headers["content-type"] = "application/json";
        options.body = JSON.stringify(request.body);
    }
    try {
        const response = await fetch(url.toString(), options);
        const statusCode = response.status;
        const body = await response.json();

        const setCookieHeaders = response.headers.get('set-cookie');
        if (setCookieHeaders) {
            reply.header('set-cookie', setCookieHeaders);
        }

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
        const status = (error as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = (error as any).data?.message || "Internal server error";
        sendError(reply, message, status);
    }
}

export async function proxyMultipart(
    request: FastifyRequest,
    reply: FastifyReply,
    path: string,
    serviceUrl: string,
    options: { fileRequired?: boolean } = { fileRequired: true }
) {
    const url = new URL(`${serviceUrl}${path}`);
    const query = request.query as Record<string, any>;
    if (query) {
        Object.keys(query).forEach(key => {
            if (query[key] !== undefined) {
                url.searchParams.append(key, String(query[key]));
            }
        });
    }

    try {
        const FormData = (await import('form-data')).default;
        const formData = new FormData();

        const parts = request.parts();
        let hasFile = false;

        for await (const part of parts) {
            if (part.type === 'file') {
                hasFile = true;
                const buffer = await part.toBuffer();
                formData.append(part.fieldname, buffer, {
                    filename: part.filename,
                    contentType: part.mimetype
                });
            } else {
                formData.append(part.fieldname, part.value);
            }
        }

        if (options.fileRequired && !hasFile) {
            return reply.status(400).send({
                status: "error",
                message: "No file uploaded"
            });
        }
        const responseData = await new Promise<{ statusCode: number; body: any }>((resolve, reject) => {
            formData.submit({
                protocol: 'http:',
                host: new URL(serviceUrl).hostname,
                port: new URL(serviceUrl).port || 80,
                path: path,
                method: 'POST',
                headers: {
                    "x-internal-api-key": process.env.INTERNAL_API_KEY!,
                    ...(request.headers.authorization && {
                        "authorization": request.headers.authorization
                    }),
                    ...(request.headers.cookie && {
                        "cookie": request.headers.cookie
                    })
                }
            }, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const body = JSON.parse(data);
                        resolve({ statusCode: res.statusCode || 500, body });
                    } catch {
                        resolve({ statusCode: res.statusCode || 500, body: { message: data } });
                    }
                });
                res.on('error', reject);
            });
        });

        return reply.status(responseData.statusCode).send(responseData.body);
    } catch (error: any) {
        return sendError(reply, error.message || "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
