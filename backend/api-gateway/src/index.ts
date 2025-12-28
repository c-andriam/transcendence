import dotenv from "dotenv"
import path from "path"
import { authMiddleware } from "./middleware/auth.middleware";
import fastify from "fastify";
import { registerRateLimiter } from "./middleware/rateLimiter.middleware";
import { recipesRoutes } from "./routes/recipes.routes";
import { authRoutes } from "./routes/auth.routes";
import { otherServicesRoutes } from "./routes/services.routes";
import { healthRoutes } from "./routes/health.routes";
import dbPlugin from "./utils/dbPlugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { documentationRoutes } from "./routes/documentation.routes";
// import fs from 'fs';

dotenv.config();

const key = process.env.API_GATEWAY_KEY;

if (!key) {
  throw new Error("API_GATEWAY_KEY is not defined");
}
export const app = fastify();

// const apiGatewaySpec = JSON.parse(fs.readFileSync('../../docs/api/apiGateway.json', 'utf-8'));

const start = async () => {
  try {
    await registerRateLimiter(app);
    app.register(dbPlugin);
    await app.register(swagger, {
      mode: 'static',
      specification: {
        document: {
          openapi: '3.0.0',
          info: { title: 'Transcendence API', version: '1.0.0' },
          paths: {}
        }
      }
    });

    await app.register(swaggerUi, {
      routePrefix: "/documentation",
      uiConfig: {
        url: "/api/v1/json",
        deepLinking: true,
        displayOperationId: false,
        defaultModelsExpandDepth: -1,
      }
    });
    app.register(healthRoutes, { prefix: '/api/v1' });
    app.register(documentationRoutes, { prefix: '/api/v1' });

    app.register(async (api) => {
      api.addHook("preHandler", authMiddleware);
      api.register(recipesRoutes, { prefix: '/api/v1' });
      api.register(authRoutes, { prefix: '/api/v1' });
      api.register(otherServicesRoutes, { prefix: '/api/v1' });
    });
    // console.log("Database connected");
    // app.addHook("preHandler", authMiddleware);
    // console.log("Auth middleware registered");
    // app.register(recipesRoutes, { prefix: '/api/v1' });
    // console.log("Recipes routes registered");
    await app.listen({ port: 3000, host: "0.0.0.0" });
    // console.log("Server started on port 3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
