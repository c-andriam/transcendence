import { FastifyRequest, FastifyReply } from "fastify";
import { ForbiddenError, validateApiKey, isApiKeyExpired } from "@transcendence/common";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const API_MASTER_SECRET = process.env.API_MASTER_SECRET || process.env.API_GATEWAY_KEY || "";

const API_KEY_MAX_AGE_SECONDS = parseInt(process.env.API_KEY_MAX_AGE_SECONDS || "31536000", 10);


export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const apiKey = request.headers["x-gateway-api-key"] as string | undefined;

  if (!apiKey) {
    request.log.warn("API Key not found");
    throw new ForbiddenError("API Key not found");
  }

  if (apiKey.startsWith("cs_")) {
    const result = validateApiKey(apiKey, API_MASTER_SECRET);

    if (!result.valid) {
      request.log.warn("Invalid signed API Key");
      throw new ForbiddenError("Invalid API Key");
    }
    
    if (result.timestamp && isApiKeyExpired(result.timestamp, API_KEY_MAX_AGE_SECONDS)) {
      request.log.warn(`Expired API Key for user ${result.userId}`);
      throw new ForbiddenError("API Key expired");
    }

    (request as any).apiKeyUserId = result.userId;
    request.log.info(`API request from user: ${result.userId}`);
    return;
  }

  if (apiKey === process.env.API_GATEWAY_KEY) {
    (request as any).apiKeyUserId = "gateway";
    return;
  }

  request.log.warn("Invalid API Key");
  throw new ForbiddenError("Invalid API Key");
}