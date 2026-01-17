import dotenv from "dotenv";
import { authMiddleware } from "./middleware/auth.middleware";
import fastify from "fastify";
import { registerRateLimiter } from "./middleware/rateLimiter.middleware";
import { recipesRoutes } from "./routes/recipes.routes";
import { usersRoutes } from "./routes/users.routes";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { authRoutes } from "./routes/auth.routes";
import { notificationsRoutes } from "./routes/notifications.routes";
import { globalErrorHandler, validateEnv } from "@transcendence/common";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import path from "path";
import { chatRoutes } from "./routes/chat.routes";
import { gdprRoutes } from "./routes/gdpr.routes";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const env = validateEnv();

export const app = fastify({
  logger: {
    level: env.LOG_LEVEL
  },
  routerOptions: {
    maxParamLength: 256
  },
  ajv: {
    customOptions: {
      removeAdditional: true,
      useDefaults: true,
      coerceTypes: true,
      allErrors: true,
      strict: false,
      keywords: ["example"]
    }
  }
});

app.setErrorHandler(globalErrorHandler);

app.register(cookie, {
  secret: env.COOKIE_SECRET,
  parseOptions: {}
});

app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10
  }
});

app.get('/health', async () => ({ status: 'ok', service: 'api-gateway', timestamp: new Date().toISOString() }));

const start = async () => {
  try {
    await registerRateLimiter(app);
    await app.register(cors, {
      origin: true
    });
    // Register SWAGGER and basic tools first
    await app.register(swagger, {
      openapi:
      {
        openapi: "3.0.3",
        info: {
          title: "Transcendence API Gateway",
          version: "1.0.0",
          description: "Central entry point for the Transcendence microservices architecture."
        },
        servers: [
          {
            url: `http://localhost:${env.API_GATEWAY_PORT}`,
            description: "Local development server"
          }
        ],
        components: {
          securitySchemes: {
            apiKeyAuth: {
              type: "apiKey",
              name: "x-gateway-api-key",
              in: "header"
            },
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        }
      }
    });



    await app.register(swaggerUi, { routePrefix: "/documentation" });

    app.get('/documentation/json-debug', async () => {
      return app.swagger();
    });

    // Register all routes under /api/v1
    await app.register(async (api) => {
      // Public routes
      await api.register(authRoutes);
      await api.register(gdprRoutes);

      // Private routes (hook is scoped to this block and its children)
      await api.register(async (privateApi) => {
        privateApi.addHook("preHandler", authMiddleware);
        await privateApi.register(recipesRoutes);
        await privateApi.register(usersRoutes);
        await privateApi.register(notificationsRoutes);
        await privateApi.register(chatRoutes);
      });
    }, { prefix: '/api/v1' });

    await app.ready();
    await app.listen({ port: env.API_GATEWAY_PORT, host: "0.0.0.0" });

    app.log.info(`API Gateway running on ${process.env.DOMAIN}:${env.API_GATEWAY_PORT}`);

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}, closing server...`);
    await app.close();
    process.exit(0);
  });
});

start();
