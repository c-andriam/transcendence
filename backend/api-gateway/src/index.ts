import dotenv from "dotenv"
dotenv.config();

import path from "path"
import { authMiddleware } from "./middleware/auth.middleware";
import fastify from "fastify";
import { registerRateLimiter } from "./middleware/rateLimiter.middleware";
import { recipesRoutes } from "./routes/recipes.routes";
import { usersRoutes } from "./routes/users.routes";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
// import fs from 'fs';

const key = process.env.API_GATEWAY_KEY;

if (!key) {
  throw new Error("API_GATEWAY_KEY is not defined");
}
export const app = fastify();

// const apiGatewaySpec = JSON.parse(fs.readFileSync ('../../docs/api/apiGateway.json', 'utf-8'));

const start = async () => {
  try {
    await registerRateLimiter(app);
    await app.register(swagger, {
      openapi:
      {
        info: {
          title: "API GATEWAY",
          version: "1.0.0",
          description: "API Gateway for Transcendence application"
        },
        servers: [
          {
            url: "https://{environment}/api/{version}",
            description: "Local development server",
            variables: {
              environment: {
                default: "cookshare.me"
              },
              port: {
                default: "3000"
              },
              version: {
                default: "v1"
              }
            }
          }
        ],
        components: {
          securitySchemes: {
            apiKeyAuth: {
              type: "apiKey",
              name: "x-api-key",
              in: "header"
            }
          }
        },
        security: [
          {
            apiKeyAuth: []
          }
        ]
      }
    });
    await app.register(swaggerUi, { routePrefix: "/documentation" });
    app.register(async (api) => {
      api.addHook("preHandler", authMiddleware);
      api.register(recipesRoutes, { prefix: '/api/v1' });
      api.register(usersRoutes, { prefix: '/api/v1' });
    })
    await app.listen({ port: 3000, host: "0.0.0.0" });
    app.log.info(`API Gateway running on ${process.env.API_GATEWAY_URL}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
