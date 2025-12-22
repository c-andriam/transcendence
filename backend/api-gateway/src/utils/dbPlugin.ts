import fastiplug from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import fastify, { FastifyInstance } from "fastify";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare module "fastify" {
    interface FastifyInstance {
        db: PrismaClient;
    }
}

const dbPlugin = fastiplug(async (fastify: FastifyInstance) => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not defined");
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    try {
        await prisma.$connect();
        console.log("Database connected");
    } catch (err) {
        process.exit(1);
    }
    fastify.decorate("db", prisma);
    fastify.addHook("onClose", async () => {
        await prisma.$disconnect();
    })
});

export default dbPlugin;