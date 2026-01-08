import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenError } from '../error';

interface ApiKeyOptions {
    headerName?: string;
    envVarName?: string;
}

export function apiKeyMiddleware(options: ApiKeyOptions = {}) {
    const {
        headerName = 'x-internal-api-key',
        envVarName = 'INTERNAL_API_KEY'
    } = options;
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const expectedKey = process.env[envVarName];
        if (!expectedKey) {
            request.log.error(`Environment variable ${envVarName} is not defined`);
            throw new Error(`Environment variable ${envVarName} is not defined`);
        }

        const providedKey = request.headers[headerName] as string;
        if (!providedKey) {
            request.log.warn(`Missing ${headerName}`);
            throw new ForbiddenError(`Missing ${headerName}`);
        }
        if (providedKey !== expectedKey) {
            request.log.warn(`Invalid ${headerName}`);
            throw new ForbiddenError(`Invalid ${headerName}`);
        }
    };
}

export const internalApiKeyMiddleware = apiKeyMiddleware({
    headerName: 'x-internal-api-key',
    envVarName: 'INTERNAL_API_KEY'
});

export const gatewayApiKeyMiddleware = apiKeyMiddleware({
    headerName: 'x-gateway-api-key',
    envVarName: 'GATEWAY_API_KEY'
});