import dotenv from "dotenv"
import path from "path"
import { authMiddleware } from "./middleware/auth.middleware";
import fastify from "fastify";
import { registerRateLimiter } from "./middleware/rateLimiter.middleware";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env")
});

const key = process.env.API_GATEWAY_KEY;

if (!key) {
  throw new Error("API_GATEWAY_KEY is not defined");
}
export const app = fastify();

const start = async () => {
  try {
    await registerRateLimiter(app);
    app.addHook("preHandler", authMiddleware);
    app.get("/", async (request, reply) => {
      return reply.send("Hello World!");
    });
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server started on port 3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
