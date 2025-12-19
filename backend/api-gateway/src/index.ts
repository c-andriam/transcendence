import dotenv from "dotenv"
import path from "path"
import { authMiddleware } from "./middleware/auth.middleware";
import fastify from "fastify";

dotenv.config({
    path: path.resolve(__dirname, "../../../.env")
});

if (!process.env.API_GATEWAY_KEY) {
    throw new Error("API_GATEWAY_KEY is not defined");
}
const key = process.env.API_GATEWAY_KEY;
const app = fastify();
app.addHook("preHandler", authMiddleware);

const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 Serveur lancé sur le port 3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
